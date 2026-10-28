-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 01_extensions_enums.sql
-- Description: Enables required Postgres extensions and creates domain-specific enums.
-- Idempotency: Safe to re-run; checks existence before creating.
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Domain Enums
-- User roles within GA Cloth
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM (
      'super_admin',
      'manager',
      'support_staff',
      'customer'
    );
  END IF;
END $$;

-- Order lifecycle statuses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'placed',
      'confirmed',
      'packed',
      'shipped',
      'delivered',
      'cancelled'
    );
  END IF;
END $$;

-- Supported payment methods in Pakistan
-- Note: 'bank_transfer' covers Meezan Islamic Bank, JazzCash manual transfer, and Easypaisa.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM (
      'cod',
      'bank_transfer',
      'card'
    );
  END IF;
END $$;

-- Payment lifecycle statuses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'verified',
      'paid',
      'failed'
    );
  END IF;
END $$;

-- Courier & shipment statuses (TCS Express)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shipment_status') THEN
    CREATE TYPE shipment_status AS ENUM (
      'pending',
      'assigned',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'returned'
    );
  END IF;
END $$;

-- Coupon discount computation types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_type') THEN
    CREATE TYPE coupon_type AS ENUM (
      'percent',
      'fixed'
    );
  END IF;
END $$;

-- Customer review moderation statuses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
    CREATE TYPE review_status AS ENUM (
      'pending',
      'approved',
      'rejected'
    );
  END IF;
END $$;

-- Product piece count types (physical Pakistani apparel)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'piece_count_type') THEN
    CREATE TYPE piece_count_type AS ENUM (
      '1-Piece',
      '2-Piece',
      '3-Piece'
    );
  END IF;
END $$;
