import React from 'react';
import { StickerData, PRESET_MESSAGES, StickerTheme } from '../types';
import { Download, Palette, Type, Smartphone, Check } from 'lucide-react';

interface ControlPanelProps {
  data: StickerData;
  onChange: (key: keyof StickerData, value: string) => void;
  onDownload: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ data, onChange, onDownload }) => {
  
  const themes: { id: StickerTheme; name: string; color: string }[] = [
    { id: 'classic', name: 'Klasik', color: 'bg-yellow-400' },
    { id: 'modern', name: 'Koyu', color: 'bg-neutral-800' },
    { id: 'navy', name: 'Mavi', color: 'bg-blue-800' },
    { id: 'minimal', name: 'Beyaz', color: 'bg-white border border-gray-200' },
    { id: 'ultra', name: 'Ultra', color: 'bg-orange-500' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 w-full max-w-lg mx-auto">
      
      {/* Phone Number Input - The most important part */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
          <Smartphone className="w-4 h-4 text-blue-600" />
          TELEFON NUMARASI
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl select-none group-focus-within:text-blue-600 transition-colors">+</span>
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              +90
              if (val.length > 10) {
                return;
              }
              onChange('phoneNumber', val);
            }}
            placeholder="905551234567"
            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-xl font-medium tracking-wide placeholder:text-gray-300"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">Örn: 905321234567 (Başında 90 kullanın)</p>
      </div>

      <div className="space-y-8">
        
        {/* Theme Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Palette className="w-4 h-4 text-purple-600" />
            TASARIM SEÇ
          </label>
          <div className="grid grid-cols-5 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange('theme', t.id)}
                className={`relative h-14 rounded-xl transition-all hover:scale-105 active:scale-95 ${t.color} ${
                  data.theme === t.id 
                    ? 'ring-4 ring-offset-2 ring-blue-500 shadow-lg' 
                    : 'shadow-sm hover:shadow-md'
                }`}
                title={t.name}
              >
                {data.theme === t.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className={`w-6 h-6 ${t.id === 'minimal' || t.id === 'classic' ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Type className="w-4 h-4 text-green-600" />
            İÇERİK
          </label>
          
          <div className="space-y-4">
            {/* Header Input Removed */}
            
            <div className="space-y-2">
               <textarea
                value={data.bodyText}
                onChange={(e) => onChange('bodyText', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none font-medium uppercase text-sm resize-none"
                placeholder="ALT AÇIKLAMA YAZISI"
              />
              
              {/* Quick Messages */}
              <div className="flex flex-wrap gap-2">
                {PRESET_MESSAGES.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onChange('bodyText', msg)}
                    className="text-[10px] font-bold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors truncate max-w-full"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
            <button
              onClick={onDownload}
              className="w-full group relative flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Download className="w-6 h-6" />
              <span className="text-lg">STICKER'I İNDİR</span>
            </button>
            <p className="text-center text-gray-400 text-xs mt-4 font-medium">
              Yüksek kaliteli .PNG formatında indirilir.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;