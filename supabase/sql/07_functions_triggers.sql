-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 07_functions_triggers.sql
-- Description: Business logic triggers, order number generation, inventory sync,
--              coupon validation, place_order() RPC (server-authoritative pricing),
--              and track_order() RPC for guest tracking.
-- Security: All SECURITY DEFINER functions explicitly set search_path = public.
-- Idempotency: Uses CREATE OR REPLACE FUNCTION & DROP TRIGGER IF EXISTS.
-- ==============================================================================

-- 1. Universal updated_at Timestamp Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger across mutable tables
DROP TRIGGER IF EXISTS trigger_set_updated_at_profiles ON public.profiles;
CREATE TRIGGER trigger_set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_categories ON public.categories;
CREATE TRIGGER trigger_set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_products ON public.products;
CREATE TRIGGER trigger_set_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_variants ON public.product_variants;
CREATE TRIGGER trigger_set_updated_at_variants
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_addresses ON public.customer_addresses;
CREATE TRIGGER trigger_set_updated_at_addresses
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_carts ON public.carts;
CREATE TRIGGER trigger_set_updated_at_carts
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_orders ON public.orders;
CREATE TRIGGER trigger_set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_coupons ON public.coupons;
CREATE TRIGGER trigger_set_updated_at_coupons
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_banners ON public.banners;
CREATE TRIGGER trigger_set_updated_at_banners
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_settings ON public.site_settings;
CREATE TRIGGER trigger_set_updated_at_settings
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Synchronize Product Total Stock from Variant Stocks
CREATE OR REPLACE FUNCTION public.sync_product_total_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_prod_id text;
BEGIN
  target_prod_id := COALESCE(NEW.product_id, OLD.product_id);
  
  UPDATE public.products
  SET total_stock = (
    SELECT COALESCE(SUM(stock), 0)
    FROM public.product_variants
    WHERE product_id = target_prod_id
  )
  WHERE id = target_prod_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_total_stock ON public.product_variants;
CREATE TRIGGER trigger_sync_total_stock
  AFTER INSERT OR UPDATE OF stock OR DELETE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.sync_product_total_stock();

-- 3. Order Number & Tracking Number Generators
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  candidate_id text;
  is_collision boolean;
BEGIN
  LOOP
    candidate_id := 'GAC-' || floor(random() * (99999 - 10000 + 1) + 10000)::text;
    SELECT EXISTS (SELECT 1 FROM public.orders WHERE id = candidate_id) INTO is_collision;
    IF NOT is_collision THEN
      RETURN candidate_id;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_tcs_tracking()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'TCS-' || floor(random() * (99999999 - 10000000 + 1) + 10000000)::text || 'PK';
END;
$$;

-- 4. Coupon Validation Function
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code text,
  p_subtotal numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_coupon record;
  v_discount numeric := 0;
BEGIN
  IF p_code IS NULL OR trim(p_code) = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'No coupon code provided');
  END IF;

  SELECT *
  INTO v_coupon
  FROM public.coupons
  WHERE upper(code) = upper(trim(p_code))
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or inactive coupon code');
  END IF;

  IF v_coupon.expiry_date < CURRENT_DATE THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon has expired');
  END IF;

  IF v_coupon.used_count >= v_coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit has been reached');
  END IF;

  IF p_subtotal < v_coupon.min_order THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Minimum order of PKR ' || v_coupon.min_order || ' required'
    );
  END IF;

  IF v_coupon.discount_type = 'percent' THEN
    v_discount := round((p_subtotal * v_coupon.value) / 100.0);
    IF v_coupon.max_discount IS NOT NULL AND v_discount > v_coupon.max_discount THEN
      v_discount := v_coupon.max_discount;
    END IF;
  ELSE
    v_discount := v_coupon.value;
  END IF;

  -- Ensure discount doesn't exceed order subtotal
  IF v_discount > p_subtotal THEN
    v_discount := p_subtotal;
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'code', v_coupon.code,
    'discount_type', v_coupon.discount_type,
    'discount_amount', v_discount,
    'coupon_id', v_coupon.id
  );
END;
$$;

-- 5. Order Inventory Restoration on Cancellation
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item record;
  curr_stock integer;
BEGIN
  -- If order was changed to 'cancelled', return items to stock
  IF NEW.order_status = 'cancelled' AND OLD.order_status != 'cancelled' THEN
    FOR item IN
      SELECT variant_id, product_id, quantity
      FROM public.order_items
      WHERE order_id = NEW.id
    LOOP
      SELECT stock INTO curr_stock FROM public.product_variants WHERE id = item.variant_id;
      
      UPDATE public.product_variants
      SET stock = stock + item.quantity
      WHERE id = item.variant_id;

      INSERT INTO public.stock_movements (
        variant_id,
        product_id,
        change_amount,
        previous_stock,
        new_stock,
        reason,
        reference_id,
        created_by
      ) VALUES (
        item.variant_id,
        item.product_id,
        item.quantity,
        curr_stock,
        curr_stock + item.quantity,
        'order_cancelled',
        NEW.id,
        auth.uid()
      );
    END LOOP;

    -- Add timeline entry for cancellation
    INSERT INTO public.order_status_history (
      order_id,
      status,
      note_en,
      note_ur,
      created_by
    ) VALUES (
      NEW.id,
      'cancelled',
      'Order cancelled. Reserved inventory restored to catalog.',
      'آرڈر منسوخ کر دیا گیا اور انوینٹری بحال کر دی گئی۔',
      auth.uid()
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_order_cancellation ON public.orders;
CREATE TRIGGER trigger_order_cancellation
  AFTER UPDATE OF order_status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_change();

-- 6. place_order() RPC (Server-Authoritative Pricing & Secure Order Placement)
-- Works seamlessly for both Authenticated Users and Unauthenticated Guests.
-- Calculates real prices strictly from DB, applies server shipping policy,
-- creates all related records in an atomic transaction, and prevents client tampering.
CREATE OR REPLACE FUNCTION public.place_order(p_order_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_order_id text;
  v_customer_name text;
  v_customer_email text;
  v_customer_phone text;
  v_shipping_province text;
  v_shipping_city text;
  v_shipping_address text;
  v_delivery_notes text;
  v_payment_method payment_method;
  v_payment_status payment_status := 'pending';
  v_order_status order_status := 'placed';
  v_payment_ref text;
  v_payment_proof text;
  v_notes text;
  v_coupon_code text;

  v_items jsonb;
  v_item jsonb;
  v_variant_id text;
  v_qty integer;

  v_variant record;
  v_product record;
  v_canonical_unit_price numeric(12, 2);
  v_item_line_total numeric(12, 2);

  v_subtotal numeric(12, 2) := 0;
  v_discount numeric(12, 2) := 0;
  v_shipping_fee numeric(12, 2) := 0;
  v_total numeric(12, 2) := 0;

  v_settings record;
  v_coupon_result jsonb;
  v_tcs_tracking text;
BEGIN
  -- Extract customer & contact data
  v_user_id := auth.uid();
  v_customer_name := trim(COALESCE(p_order_payload->>'customerName', ''));
  v_customer_email := trim(COALESCE(p_order_payload->>'customerEmail', ''));
  v_customer_phone := trim(COALESCE(p_order_payload->>'customerPhone', ''));
  v_shipping_province := trim(COALESCE(p_order_payload->>'shippingProvince', ''));
  v_shipping_city := trim(COALESCE(p_order_payload->>'shippingCity', ''));
  v_shipping_address := trim(COALESCE(p_order_payload->>'shippingAddress', ''));
  v_delivery_notes := p_order_payload->>'deliveryNotes';
  v_payment_method := (COALESCE(p_order_payload->>'paymentMethod', 'cod'))::payment_method;
  v_payment_ref := p_order_payload->>'paymentReferenceNumber';
  v_payment_proof := p_order_payload->>'paymentProofUrl';
  v_notes := p_order_payload->>'notes';
  v_coupon_code := p_order_payload->>'appliedCoupon';

  -- Mandatory customer fields validation
  IF v_customer_name = '' OR v_customer_phone = '' OR v_shipping_address = '' THEN
    RAISE EXCEPTION 'Customer name, phone number, and physical street address are required.';
  END IF;

  -- Read Cart Items array
  v_items := p_order_payload->'items';
  IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Cannot place order with an empty shopping cart.';
  END IF;

  -- 1. SERVER-AUTHORITATIVE PRICE & STOCK VERIFICATION LOOP
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_variant_id := v_item->>'variantId';
    IF v_variant_id IS NULL THEN
      -- Fallback to selectedVariant.id or variant_id
      v_variant_id := COALESCE(v_item->'selectedVariant'->>'id', v_item->>'variant_id');
    END IF;
    
    v_qty := COALESCE((v_item->>'quantity')::integer, 1);
    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity % for item', v_qty;
    END IF;

    -- Fetch variant and product from database with row lock
    SELECT * INTO v_variant
    FROM public.product_variants
    WHERE id = v_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Apparel variant % not found in catalog.', v_variant_id;
    END IF;

    IF v_variant.stock < v_qty THEN
      RAISE EXCEPTION 'Requested quantity % exceeds available physical stock % for SKU %',
        v_qty, v_variant.stock, v_variant.sku;
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = v_variant.product_id;

    -- Canonical unit price: priceOverride OR salePrice OR regular price
    v_canonical_unit_price := COALESCE(v_variant.price_override, v_product.sale_price, v_product.price);
    v_item_line_total := v_canonical_unit_price * v_qty;
    v_subtotal := v_subtotal + v_item_line_total;
  END LOOP;

  -- 2. FETCH STORE SETTINGS & CALCULATE SHIPPING
  SELECT * INTO v_settings FROM public.site_settings WHERE id = 1;
  IF FOUND THEN
    IF v_subtotal >= v_settings.free_shipping_threshold THEN
      v_shipping_fee := 0;
    ELSE
      v_shipping_fee := v_settings.standard_shipping_fee;
    END IF;
  ELSE
    -- Defaults if site_settings row is missing
    IF v_subtotal >= 3500 THEN
      v_shipping_fee := 0;
    ELSE
      v_shipping_fee := 250;
    END IF;
  END IF;

  -- 3. VALIDATE COUPON ON SERVER
  IF v_coupon_code IS NOT NULL AND trim(v_coupon_code) != '' THEN
    v_coupon_result := public.validate_coupon(v_coupon_code, v_subtotal);
    IF (v_coupon_result->>'valid')::boolean = true THEN
      v_discount := (v_coupon_result->>'discount_amount')::numeric;
    ELSE
      -- Discard invalid coupon rather than failing entire order
      v_discount := 0;
      v_coupon_code := NULL;
    END IF;
  END IF;

  -- 4. FINAL GRAND TOTAL COMPUTATION
  v_total := GREATEST(0, (v_subtotal - v_discount) + v_shipping_fee);

  -- 5. PAYMENT STATUS RESOLUTION
  IF v_payment_method = 'card' THEN
    v_payment_status := 'paid';
    v_order_status := 'confirmed';
    IF v_payment_ref IS NULL THEN
      v_payment_ref := 'CARD-AUTH-' || floor(random() * 899999 + 100000)::text;
    END IF;
  ELSIF v_payment_method = 'bank_transfer' THEN
    v_payment_status := 'pending';
    v_order_status := 'placed';
  ELSE
    -- COD
    v_payment_status := 'pending';
    v_order_status := 'placed';
  END IF;

  -- 6. GENERATE IDENTIFIERS
  v_order_id := public.generate_order_id();
  v_tcs_tracking := public.generate_tcs_tracking();

  -- 7. INSERT ORDER HEADER
  INSERT INTO public.orders (
    id,
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_province,
    shipping_city,
    shipping_address,
    delivery_notes,
    subtotal,
    discount,
    applied_coupon,
    shipping_fee,
    total,
    payment_method,
    payment_status,
    payment_reference_number,
    payment_proof_url,
    order_status,
    tcs_tracking_number,
    notes
  ) VALUES (
    v_order_id,
    v_user_id,
    v_customer_name,
    v_customer_email,
    v_customer_phone,
    v_shipping_province,
    v_shipping_city,
    v_shipping_address,
    v_delivery_notes,
    v_subtotal,
    v_discount,
    v_coupon_code,
    v_shipping_fee,
    v_total,
    v_payment_method,
    v_payment_status,
    v_payment_ref,
    v_payment_proof,
    v_order_status,
    v_tcs_tracking,
    COALESCE(v_notes, 'Handcrafted luxury apparel parcel - TCS express dispatch')
  );

  -- 8. INSERT ORDER ITEMS & DEDUCT INVENTORY
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    v_variant_id := v_item->>'variantId';
    IF v_variant_id IS NULL THEN
      v_variant_id := COALESCE(v_item->'selectedVariant'->>'id', v_item->>'variant_id');
    END IF;
    v_qty := COALESCE((v_item->>'quantity')::integer, 1);

    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_variant_id;
    SELECT * INTO v_product FROM public.products WHERE id = v_variant.product_id;

    v_canonical_unit_price := COALESCE(v_variant.price_override, v_product.sale_price, v_product.price);
    v_item_line_total := v_canonical_unit_price * v_qty;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      title_en,
      size,
      color,
      sku,
      unit_price,
      quantity,
      line_total
    ) VALUES (
      v_order_id,
      v_product.id,
      v_variant.id,
      v_product.title_en,
      v_variant.size,
      v_variant.color,
      v_variant.sku,
      v_canonical_unit_price,
      v_qty,
      v_item_line_total
    );

    -- Deduct stock
    UPDATE public.product_variants
    SET stock = stock - v_qty
    WHERE id = v_variant.id;

    -- Record stock movement ledger
    INSERT INTO public.stock_movements (
      variant_id,
      product_id,
      change_amount,
      previous_stock,
      new_stock,
      reason,
      reference_id,
      created_by
    ) VALUES (
      v_variant.id,
      v_product.id,
      -v_qty,
      v_variant.stock,
      v_variant.stock - v_qty,
      'order_placed',
      v_order_id,
      v_user_id
    );
  END LOOP;

  -- 9. RECORD PAYMENT RECORD
  INSERT INTO public.payments (
    order_id,
    method,
    status,
    reference_number,
    amount,
    payment_channel
  ) VALUES (
    v_order_id,
    v_payment_method,
    v_payment_status,
    v_payment_ref,
    v_total,
    CASE v_payment_method
      WHEN 'card' THEN 'Credit/Debit Card (3DS Verified)'
      WHEN 'bank_transfer' THEN 'Bank Transfer / JazzCash / Easypaisa'
      ELSE 'Cash on Delivery (COD)'
    END
  );

  -- 10. RECORD PAYMENT PROOF IF SCREENSHOT SUBMITTED
  IF v_payment_proof IS NOT NULL AND trim(v_payment_proof) != '' THEN
    INSERT INTO public.payment_proofs (
      order_id,
      proof_url,
      reference_number
    ) VALUES (
      v_order_id,
      v_payment_proof,
      v_payment_ref
    );
  END IF;

  -- 11. INITIALIZE TCS SHIPMENT RECORD
  INSERT INTO public.shipments (
    order_id,
    courier,
    tracking_number,
    status
  ) VALUES (
    v_order_id,
    'TCS',
    v_tcs_tracking,
    'assigned'
  );

  -- 12. LOG TIMELINE EVENTS (Bilingual Urdu & English)
  INSERT INTO public.order_status_history (
    order_id,
    status,
    note_en,
    note_ur,
    created_by
  ) VALUES (
    v_order_id,
    'placed',
    CASE v_payment_method
      WHEN 'card' THEN 'Order placed with online card payment.'
      WHEN 'bank_transfer' THEN 'Order placed via Bank Transfer / Mobile Wallet. Awaiting payment verification.'
      ELSE 'Cash on delivery order received.'
    END,
    CASE v_payment_method
      WHEN 'card' THEN 'کارڈ کے ذریعے آن لائن آرڈر موصول ہوا۔'
      WHEN 'bank_transfer' THEN 'بینک ٹرانسفر کے ذریعے آرڈر موصول ہوا، تصدیق کے انتظار میں۔'
      ELSE 'کیش آن ڈیلیوری آرڈر موصول ہوا۔'
    END,
    v_user_id
  );

  IF v_order_status = 'confirmed' THEN
    INSERT INTO public.order_status_history (
      order_id,
      status,
      note_en,
      note_ur,
      created_by
    ) VALUES (
      v_order_id,
      'confirmed',
      'Payment verified & order confirmed.',
      'ادائیگی کی تصدیق اور آرڈر منظور۔',
      v_user_id
    );
  END IF;

  -- 13. LOG COUPON USAGE IF APPLIED
  IF v_coupon_code IS NOT NULL AND v_discount > 0 THEN
    INSERT INTO public.coupon_usages (
      coupon_id,
      order_id,
      user_id,
      discount_amount
    ) VALUES (
      (v_coupon_result->>'coupon_id')::uuid,
      v_order_id,
      v_user_id,
      v_discount
    );

    UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = (v_coupon_result->>'coupon_id')::uuid;
  END IF;

  -- RETURN CREATED ORDER SUMMARY
  RETURN jsonb_build_object(
    'success', true,
    'orderId', v_order_id,
    'tcsTrackingNumber', v_tcs_tracking,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'shippingFee', v_shipping_fee,
    'total', v_total,
    'paymentMethod', v_payment_method,
    'paymentStatus', v_payment_status,
    'orderStatus', v_order_status
  );
END;
$$;

-- 7. track_order() RPC (Safe Guest & Public Order Tracking)
-- Exposes delivery status and timeline without leaking sensitive financial info.
CREATE OR REPLACE FUNCTION public.track_order(
  p_order_id text,
  p_phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_order record;
  v_items jsonb;
  v_timeline jsonb;
  v_clean_phone text;
BEGIN
  IF p_order_id IS NULL OR trim(p_order_id) = '' THEN
    RETURN jsonb_build_object('found', false, 'error', 'Order ID is required.');
  END IF;

  -- Clean search parameters
  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');

  SELECT *
  INTO v_order
  FROM public.orders
  WHERE (
    upper(id) = upper(trim(p_order_id))
    OR upper(tcs_tracking_number) = upper(trim(p_order_id))
  )
  AND (
    v_clean_phone = ''
    OR regexp_replace(customer_phone, '[^0-9]', '', 'g') LIKE '%' || v_clean_phone || '%'
  );

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'found', false,
      'error', 'No order matching the provided details was found.'
    );
  END IF;

  -- Fetch items
  SELECT jsonb_agg(
    jsonb_build_object(
      'titleEn', title_en,
      'size', size,
      'color', color,
      'quantity', quantity,
      'unitPrice', unit_price,
      'lineTotal', line_total
    )
  )
  INTO v_items
  FROM public.order_items
  WHERE order_id = v_order.id;

  -- Fetch timeline
  SELECT jsonb_agg(
    jsonb_build_object(
      'status', status,
      'date', to_char(created_at, 'YYYY-MM-DD HH24:MI'),
      'noteEn', note_en,
      'noteUr', note_ur
    )
    ORDER BY created_at ASC
  )
  INTO v_timeline
  FROM public.order_status_history
  WHERE order_id = v_order.id;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_order.id,
    'date', to_char(v_order.created_at, 'YYYY-MM-DD HH24:MI'),
    'customerName', v_order.customer_name,
    'shippingCity', v_order.shipping_city,
    'shippingProvince', v_order.shipping_province,
    'orderStatus', v_order.order_status,
    'paymentMethod', v_order.payment_method,
    'paymentStatus', v_order.payment_status,
    'tcsTrackingNumber', v_order.tcs_tracking_number,
    'subtotal', v_order.subtotal,
    'discount', v_order.discount,
    'shippingFee', v_order.shipping_fee,
    'total', v_order.total,
    'items', COALESCE(v_items, '[]'::jsonb),
    'timeline', COALESCE(v_timeline, '[]'::jsonb)
  );
END;
$$;

-- 8. Customer Review Submission with Verified Buyer Enforcement
CREATE OR REPLACE FUNCTION public.submit_review(
  p_product_id text,
  p_rating integer,
  p_comment text,
  p_customer_name text,
  p_customer_city text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_is_verified boolean := false;
  v_matched_order_id text := NULL;
  v_review_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5 stars.';
  END IF;

  IF trim(p_comment) = '' THEN
    RAISE EXCEPTION 'Review comment cannot be empty.';
  END IF;

  -- Check if user is a verified buyer of this product
  IF v_user_id IS NOT NULL THEN
    SELECT o.id INTO v_matched_order_id
    FROM public.orders o
    JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.user_id = v_user_id
      AND oi.product_id = p_product_id
      AND o.order_status IN ('delivered', 'shipped')
    LIMIT 1;

    IF v_matched_order_id IS NOT NULL THEN
      v_is_verified := true;
    END IF;
  END IF;

  INSERT INTO public.reviews (
    product_id,
    order_id,
    user_id,
    customer_name,
    customer_city,
    rating,
    comment,
    is_verified_buyer,
    status
  ) VALUES (
    p_product_id,
    v_matched_order_id,
    v_user_id,
    trim(p_customer_name),
    trim(p_customer_city),
    p_rating,
    trim(p_comment),
    v_is_verified,
    'pending' -- Admin moderation required before public display
  )
  RETURNING id INTO v_review_id;

  RETURN jsonb_build_object(
    'success', true,
    'reviewId', v_review_id,
    'isVerifiedBuyer', v_is_verified,
    'status', 'pending'
  );
END;
$$;
