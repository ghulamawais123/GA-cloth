import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, Scissors, Info } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, language } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [tab, setTab] = useState<'pret' | 'unstitched'>('pret');

  if (!isSizeGuideOpen) return null;

  const pretData = [
    { size: 'XS (Extra Small)', bust: '34"', waist: '28"', hip: '38"', length: '38"', trouserLength: '36"' },
    { size: 'S (Small)', bust: '36"', waist: '30"', hip: '40"', length: '39"', trouserLength: '37"' },
    { size: 'M (Medium)', bust: '39"', waist: '33"', hip: '43"', length: '40"', trouserLength: '38"' },
    { size: 'L (Large)', bust: '42"', waist: '36"', hip: '46"', length: '41"', trouserLength: '39"' },
    { size: 'XL (Extra Large)', bust: '45"', waist: '39"', hip: '49"', length: '42"', trouserLength: '40"' },
  ];

  const yardageData = [
    {
      silhouette: 'Standard Straight Kurta & Straight Trouser',
      yardage: '3.0 - 3.25 Meters (or standard 2.5m shirt + 2.5m trouser)',
      notes: 'Sufficient for standard length up to 42 inches and normal sleeve width.',
    },
    {
      silhouette: 'Flared A-Line or Panel Kurti (Kaliyan)',
      yardage: '3.5 - 4.0 Meters for shirt only',
      notes: 'Recommended for 8 to 12 kaliyan with a wide hem border circumference.',
    },
    {
      silhouette: 'Anarkali 16-Kali Floor Length Gown',
      yardage: '5.0 - 6.0 Meters + 2.5m lining (Malai crepe/silk)',
      notes: 'Requires continuous length for high flair drape and double borders.',
    },
    {
      silhouette: 'Traditional Wide Shalwar / Patiala',
      yardage: '3.0 - 3.5 Meters for bottom',
      notes: 'Allows deep pleats and traditional heavy Pakistani fall.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e111a] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#262c40] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#24293c] flex items-center justify-between bg-[#131622]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg border border-yellow-400/20">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                {language === 'ur' ? 'ناپ اور درزی گائیڈ' : 'GA Cloth Tailoring & Size Guide'}
              </h3>
              <p className="text-xs text-yellow-400/80">
                {language === 'ur'
                  ? 'سلے سلائے ملبوسات اور ان سلے کپڑوں کی کٹنگ کی رہنمائی'
                  : 'Standard ready-to-wear charts & master tailor unstitched yardage advice'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#181d2c] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#24293c] bg-[#111420] px-4 pt-2">
          <button
            onClick={() => setTab('pret')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              tab === 'pret'
                ? 'border-yellow-400 text-yellow-400 bg-[#181d2c] rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ur' ? 'سلے سلائے کُرتے (پریٹ سائز)' : 'Ready-to-Wear (Pret Sizes)'}
          </button>
          <button
            onClick={() => setTab('unstitched')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              tab === 'unstitched'
                ? 'border-yellow-400 text-yellow-400 bg-[#181d2c] rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              {language === 'ur' ? 'ان سلے کپڑے کا تخمینہ' : 'Unstitched Yardage Estimator'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {tab === 'pret' ? (
            <div>
              <div className="overflow-x-auto border border-[#24293c] rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#24293c]">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Bust</th>
                      <th className="p-3">Waist</th>
                      <th className="p-3">Hip</th>
                      <th className="p-3">Shirt Length</th>
                      <th className="p-3">Trouser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2335]">
                    {pretData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-[#0e111a]' : 'bg-[#131622]'}>
                        <td className="p-3 font-bold text-white">{row.size}</td>
                        <td className="p-3 text-slate-200">{row.bust}</td>
                        <td className="p-3 text-slate-200">{row.waist}</td>
                        <td className="p-3 text-slate-200">{row.hip}</td>
                        <td className="p-3 text-slate-200">{row.length}</td>
                        <td className="p-3 text-slate-200">{row.trouserLength}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3.5 bg-yellow-950/30 rounded-xl border border-yellow-500/30 text-xs text-yellow-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'ur'
                    ? 'نوٹ: تمام پیمائشیں انچوں میں ہیں۔ اگر آپ کا ناپ دو سائزوں کے درمیان آتا ہے تو بہتر فٹنگ کے لیے بڑا سائز منتخب کرنے کی سفارش کی جاتی ہے۔'
                    : 'Fit Note: All measurements represent standard finished garment specs. If between sizes, we recommend choosing the larger size for a relaxed Pakistani silhouette.'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-yellow-300/90 font-medium">
                {language === 'ur'
                  ? 'ان سلے کپڑے سلوانے کے لیے درزی کو درکار پیمائش کا تخمینہ:'
                  : 'Tailoring guidelines for master dressmakers and home seamstresses:'}
              </p>

              <div className="space-y-2.5">
                {yardageData.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#24293c] bg-[#131622]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                      <span className="font-bold text-xs text-white">{item.silhouette}</span>
                      <span className="font-mono text-xs font-bold text-yellow-400 bg-[#181d2c] px-2.5 py-0.5 rounded border border-yellow-400/20">
                        {item.yardage}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{item.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#24293c] bg-[#131622] flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl text-xs font-black hover:from-amber-300 hover:to-yellow-400 transition cursor-pointer shadow-md"
          >
            {language === 'ur' ? 'بند کریں' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
