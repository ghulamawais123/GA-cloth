import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Sparkles,
  BrainCircuit,
  Eye,
  Shirt,
  CheckCircle2,
} from 'lucide-react';
import { ProductVariant } from '../types/store';

const SAMPLE_PRESET_IMAGES = [
  {
    label: 'Kashmiri Embroidered Chiffon',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    fabric: 'Chiffon',
  },
  {
    label: 'Pastel Schiffli Lawn 3-Piece',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    fabric: 'Lawn',
  },
  {
    label: 'Zari Jacquard Festive Pret',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    fabric: 'Jacquard',
  },
  {
    label: 'Mens Royal Egyptian Latha Kurta',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    fabric: 'Cotton',
  },
  {
    label: 'Velvet Embroidered Shawl Suit',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    fabric: 'Velvet',
  },
];

export const AddProductModal: React.FC = () => {
  const {
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    categories,
    setSelectedProductId,
    setCurrentView,
    language,
    showToast,
  } = useStore();

  if (!isAddProductModalOpen) return null;

  // Form State (Physical products only)
  const [titleEn, setTitleEn] = useState(editingProduct?.titleEn || '');
  const [titleUr, setTitleUr] = useState(editingProduct?.titleUr || '');
  const [category, setCategory] = useState(editingProduct?.category || 'cat-unstitched');
  const [subcategory, setSubcategory] = useState(editingProduct?.subcategory || '3-Piece Lawn');
  const [fabric, setFabric] = useState(editingProduct?.fabric || 'Lawn');
  const [pieceCount, setPieceCount] = useState<'1-Piece' | '2-Piece' | '3-Piece'>(
    (editingProduct?.pieceCount as '1-Piece' | '2-Piece' | '3-Piece') || '3-Piece'
  );
  const [price, setPrice] = useState<number>(editingProduct?.price || 4950);
  const [salePrice, setSalePrice] = useState<number | undefined>(editingProduct?.salePrice || 4200);
  const [imageUrl, setImageUrl] = useState(
    editingProduct?.images[0] || SAMPLE_PRESET_IMAGES[0].url
  );
  const [descriptionEn, setDescriptionEn] = useState(editingProduct?.descriptionEn || '');
  const [descriptionUr, setDescriptionUr] = useState(editingProduct?.descriptionUr || '');
  const [washCareEn, setWashCareEn] = useState(
    editingProduct?.washCareEn || 'Dry clean recommended or gentle hand wash.'
  );
  const [washCareUr, setWashCareUr] = useState(
    editingProduct?.washCareUr || 'ڈرائی کلین کی سفارش کی جاتی ہے۔'
  );
  const [features, setFeatures] = useState<string[]>(
    editingProduct?.features || [
      '100% Pure Premium Fabric',
      'Intricate Kashmiri & Resham threadwork',
      'Matching Dupatta & Trouser',
    ]
  );

  // Variants & Stock State
  const [variants, setVariants] = useState<ProductVariant[]>(
    editingProduct?.variants || [
      {
        id: 'var-1',
        size: 'Unstitched',
        color: 'Royal Emerald',
        colorHex: '#0b5239',
        sku: 'GAC-EM-UN',
        stock: 20,
      },
      {
        id: 'var-2',
        size: 'Medium',
        color: 'Royal Emerald',
        colorHex: '#0b5239',
        sku: 'GAC-EM-M',
        stock: 10,
      },
      {
        id: 'var-3',
        size: 'Large',
        color: 'Royal Emerald',
        colorHex: '#0b5239',
        sku: 'GAC-EM-L',
        stock: 8,
      },
    ]
  );

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Handle image upload from local computer
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        showToast(language === 'ur' ? 'تصویر اپلوڈ ہو گئی!' : 'Product image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a variant
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      size: 'Small',
      color: 'Custom Color',
      colorHex: '#c25534',
      sku: `GAC-${fabric.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 15,
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      showToast('At least one variant is required');
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  // One-Click AI Description with Gemini 4 Argon
  const handleGenerateAiCopy = async () => {
    if (!titleEn && !fabric) {
      showToast('Please type a title or choose a fabric type first.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleEn || 'Pakistani Embroidered Collection',
          category: categories.find((c) => c.id === category)?.nameEn || 'Unstitched',
          fabric,
          pieces: pieceCount,
          embroidery: 'Authentic Kashmiri resham, zari and sequins',
          season: 'Festive / Wedding Season',
          isDigital: false,
          color: variants[0]?.color || 'Royal Palette',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.titleEn) setTitleEn(data.data.titleEn);
        if (data.data.titleUr) setTitleUr(data.data.titleUr);
        if (data.data.descriptionEn) setDescriptionEn(data.data.descriptionEn);
        if (data.data.descriptionUr) setDescriptionUr(data.data.descriptionUr);
        if (data.data.washCareEn) setWashCareEn(data.data.washCareEn);
        if (data.data.washCareUr) setWashCareUr(data.data.washCareUr);
        if (data.data.features && Array.isArray(data.data.features)) {
          setFeatures(data.data.features);
        }
        showToast(
          language === 'ur'
            ? 'مصنوعی ذہانت سے تفصیل اور اردو نام تیار ہو گیا!'
            : 'AI successfully generated luxury English and Urdu copy!'
        );
      }
    } catch (err) {
      console.error('Error generating copy:', err);
      showToast('Could not reach AI copywriter. Please try again.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn) {
      showToast('English Title is required');
      return;
    }

    const totalCalculatedStock = variants.reduce((sum, v) => sum + v.stock, 0);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        titleEn,
        titleUr: titleUr || titleEn,
        category,
        subcategory,
        price,
        salePrice: salePrice && salePrice < price ? salePrice : undefined,
        isSale: Boolean(salePrice && salePrice < price),
        type: 'physical',
        fabric,
        pieceCount,
        images: [imageUrl],
        descriptionEn,
        descriptionUr,
        variants,
        totalStock: totalCalculatedStock,
        washCareEn,
        washCareUr,
        features,
      });
      setSelectedProductId(editingProduct.id);
      showToast(language === 'ur' ? 'پروڈکٹ اپ ڈیٹ ہو گئی!' : 'Product updated successfully!');
    } else {
      const created = addProduct({
        titleEn,
        titleUr: titleUr || titleEn,
        category,
        subcategory,
        price,
        salePrice: salePrice && salePrice < price ? salePrice : undefined,
        isSale: Boolean(salePrice && salePrice < price),
        isNew: true,
        isFeatured: true,
        type: 'physical',
        fabric,
        pieceCount,
        images: [imageUrl],
        descriptionEn,
        descriptionUr,
        variants,
        rating: 5.0,
        reviewsCount: 1,
        tags: [fabric, pieceCount, 'Pret'],
        totalStock: totalCalculatedStock,
        washCareEn,
        washCareUr,
        features,
      });

      setSelectedProductId(created.id);
      showToast(
        language === 'ur'
          ? `نیا پروڈکٹ شامل ہو گیا: ${created.titleUr}`
          : `New product added: ${created.titleEn}`
      );
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    setCurrentView('shop');
  };

  const discountPercent =
    salePrice && salePrice < price ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#0e111a] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#262c40] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-white">
        {/* 1. Header */}
        <div className="p-5 border-b border-[#1f2435] bg-[#080a0f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center shadow-lg font-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-serif">
                {editingProduct
                  ? language === 'ur'
                    ? 'پروڈکٹ میں ترمیم کریں'
                    : 'Edit Product'
                  : language === 'ur'
                  ? 'نیا پروڈکٹ شامل کریں'
                  : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'ur'
                  ? 'کپڑے، سائز، ورائینٹس اور AI سے تیار کردہ ڈسکرپشن'
                  : 'Pakistani luxury fabrics, sizes, inventory variants & Gemini AI copywriting'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex bg-[#161a28] p-0.5 rounded-xl text-xs font-bold border border-[#2b3145]">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'form' ? 'bg-yellow-400 text-black font-black shadow-xs' : 'text-slate-300'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-yellow-400 text-black font-black shadow-xs' : 'text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-yellow-400" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsAddProductModalOpen(false);
                setEditingProduct(null);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a1f30] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Body Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0b0c10]">
          {activeTab === 'preview' ? (
            /* Live Card & Detail Preview */
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  Website Card Preview
                </span>
                <p className="text-[11px] text-slate-400">
                  This is how customers will see your item in the GA Cloth store:
                </p>
              </div>

              <div className="bg-[#131622] rounded-2xl border border-[#24293b] overflow-hidden shadow-xl p-3.5 space-y-3">
                <div className="relative aspect-[3/4] bg-[#0c0e14] rounded-xl overflow-hidden">
                  <img src={imageUrl} alt={titleEn} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded bg-yellow-400 text-black text-[10px] font-bold uppercase">
                      New Launch
                    </span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span className="font-semibold bg-[#181d2c] text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/20">
                      {fabric} • {pieceCount}
                    </span>
                    <span className="text-emerald-400 font-bold">In Stock</span>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-snug">
                    {titleEn || 'Luxury Pakistani Suit'}
                  </h3>
                  {titleUr && <p className="font-urdu text-xs text-yellow-300 mt-0.5">{titleUr}</p>}

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-black text-yellow-400">
                      PKR {(salePrice || price).toLocaleString()}
                    </span>
                    {salePrice && salePrice < price && (
                      <span className="text-xs text-slate-400 line-through">
                        PKR {price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="text-xs font-bold text-yellow-400 hover:underline cursor-pointer"
                >
                  ← Back to Editing Form
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Product Classification Banner */}
              <div className="p-4 rounded-2xl bg-[#131622] border border-[#24293b] shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 shrink-0">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Luxury Pakistani Apparel (کپڑے اور سلے سوٹ)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Physical couture item dispatched via TCS Express courier with end-to-end tracking.
                  </p>
                </div>
              </div>

              {/* AI Auto-Writer Bar (Gemini 4 Argon High-Thinking) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/15 to-purple-500/15 border border-yellow-400/40 shadow-sm space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">
                        One-Click Gemini 4 Argon AI Copywriter
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Generates luxury English description, Urdu title & text, features & wash care using high-thinking mode.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiCopy}
                    disabled={isGeneratingAi}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 text-black rounded-xl font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-md whitespace-nowrap self-start sm:self-auto"
                  >
                    <BrainCircuit className="w-4 h-4 text-black" />
                    <span>{isGeneratingAi ? 'Reasoning & Generating...' : 'Auto-Generate Copy with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Category Row */}
              <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                  Basic Product Info
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">
                      Product Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Mehar-o-Maha Embroidered Chiffon 3-Piece"
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-medium focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">
                      Urdu Title (اردو میں نام)
                    </label>
                    <input
                      type="text"
                      value={titleUr}
                      onChange={(e) => setTitleUr(e.target.value)}
                      placeholder="مثال: مہر و ماہ کڑھائی دار شفون ۳ پیس"
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-urdu text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#181d2c] text-white">
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Fabric Type</label>
                    <select
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer"
                    >
                      <option value="Lawn" className="bg-[#181d2c] text-white">Egyptian Lawn</option>
                      <option value="Chiffon" className="bg-[#181d2c] text-white">Pure Chiffon</option>
                      <option value="Cotton" className="bg-[#181d2c] text-white">Combed Cotton / Latha</option>
                      <option value="Jacquard" className="bg-[#181d2c] text-white">Zari Jacquard</option>
                      <option value="Velvet" className="bg-[#181d2c] text-white">Micro Velvet</option>
                      <option value="Silk" className="bg-[#181d2c] text-white">Raw Silk</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Pieces / Format</label>
                    <select
                      value={pieceCount}
                      onChange={(e) => setPieceCount(e.target.value as any)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer"
                    >
                      <option value="3-Piece" className="bg-[#181d2c] text-white">3-Piece (Shirt, Dupatta, Trouser)</option>
                      <option value="2-Piece" className="bg-[#181d2c] text-white">2-Piece (Shirt & Trouser/Dupatta)</option>
                      <option value="1-Piece" className="bg-[#181d2c] text-white">1-Piece (Single Kurti / Shawl)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Financials */}
              <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                  Pricing & Discounts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">
                      Retail Price (PKR) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl p-2.5 pl-8 font-black text-white focus:ring-1 focus:ring-yellow-400"
                      />
                      <span className="absolute left-2.5 top-2.5 text-yellow-400 font-bold">Rs</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">
                      Sale Price (PKR) - Optional
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={salePrice || ''}
                        onChange={(e) =>
                          setSalePrice(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="e.g. 3990"
                        className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl p-2.5 pl-8 font-bold text-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      />
                      <span className="absolute left-2.5 top-2.5 text-yellow-400 font-bold">Rs</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#181d2c] rounded-xl border border-[#2b3145] flex flex-col justify-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Calculated Savings
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {discountPercent > 0
                        ? `${discountPercent}% Discount (Save PKR ${(price - (salePrice || 0)).toLocaleString()})`
                        : 'Regular Price (No discount)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Image & Preset Gallery */}
              <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-sm space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                  Product Photography
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Image URL</label>
                      <input
                        type="url"
                        required
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl p-2.5 text-[11px] font-mono text-white focus:ring-1 focus:ring-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-200 block mb-1">
                        Or Upload From Computer / Device
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-yellow-400 file:text-black cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="flex justify-center">
                    <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#2b3145] shadow-md bg-[#0c0e14] flex-shrink-0">
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-[#202538]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Click to use standard catalog photo preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setFabric(preset.fabric);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          imageUrl === preset.url
                            ? 'bg-yellow-400 text-black font-black border-yellow-400'
                            : 'bg-[#181d2c] text-slate-300 hover:bg-[#202538] border-[#2b3145]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Variants & Stock Matrix */}
              <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                      Product Sizes & Inventory Variants
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Each variant tracks distinct SKU, color swatch, and warehouse quantity.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 bg-[#181d2c] rounded-xl border border-[#2b3145] grid grid-cols-2 sm:grid-cols-5 gap-2 items-center"
                    >
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          Size
                        </label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleUpdateVariant(v.id, { size: e.target.value })}
                          placeholder="e.g. Unstitched / Medium"
                          className="w-full bg-[#131622] border border-[#2b3145] rounded-lg p-1.5 text-xs font-semibold text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          Color Name
                        </label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => handleUpdateVariant(v.id, { color: e.target.value })}
                          placeholder="e.g. Royal Emerald"
                          className="w-full bg-[#131622] border border-[#2b3145] rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          Color Swatch
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={v.colorHex}
                            onChange={(e) => handleUpdateVariant(v.id, { colorHex: e.target.value })}
                            className="w-7 h-7 rounded border border-slate-600 cursor-pointer p-0 bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-yellow-300">{v.colorHex}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) =>
                            handleUpdateVariant(v.id, { stock: Number(e.target.value) })
                          }
                          className="w-full bg-[#131622] border border-[#2b3145] rounded-lg p-1.5 text-xs font-bold font-mono text-yellow-400"
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                        <span className="font-mono text-[10px] text-slate-400 truncate">{v.sku}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition"
                          title="Delete variant"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions & Wash Care */}
              <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                  Detailed Description & Care
                </h3>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    English Luxury Description
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Rich description describing fabric texture, embroidery elegance, occasion wear..."
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    Urdu Description (اردو میں مکمل تفصیل)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionUr}
                    onChange={(e) => setDescriptionUr(e.target.value)}
                    placeholder="کپڑے کا معیار، کڑھائی اور سلائی کی خصوصیات..."
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs font-urdu text-right focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#080a0f] border-t border-[#1f2435] rounded-2xl flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2.5 bg-[#181d2c] hover:bg-[#202538] text-yellow-400 border border-yellow-500/20 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-yellow-400" />
                  <span>Preview Card</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-5 py-2.5 bg-[#181d2c] hover:bg-[#202538] text-slate-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl font-black shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProduct ? 'Save Changes' : 'Publish Product to Store'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
