import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { StickerData, DEFAULT_STICKER_DATA } from './types';
import StickerPreview from './components/StickerPreview';
import ControlPanel from './components/ControlPanel';
import { Car, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [stickerData, setStickerData] = useState<StickerData>(DEFAULT_STICKER_DATA);
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (key: keyof StickerData, value: string) => {
    setStickerData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = useCallback(() => {
    if (stickerRef.current === null) {
      return;
    }

    // Generate high quality image
    // pixelRatio 4 ensures it prints sharply
    toPng(stickerRef.current, { cacheBust: true, pixelRatio: 4 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `arac-qr-sticker-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Hata:', err);
        alert('Görsel oluşturulurken bir hata oluştu.');
      });
  }, [stickerRef]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-800 font-sans selection:bg-blue-200">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">QR Oto Sticker</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span>Ücretsiz Araç İletişim Aracı</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left: Design Controls */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative z-10">
             <div className="mb-6 lg:hidden text-center">
                <p className="text-gray-500 text-sm">Aşağıdan düzenlemeleri yapın</p>
             </div>
             <ControlPanel 
                data={stickerData} 
                onChange={handleDataChange} 
                onDownload={handleDownload}
              />
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center sticky top-28 relative z-0">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                Aracın İçin <span className="text-blue-600">Akıllı Etiket</span>
              </h1>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Telefon numaranı gizli tutmana gerek yok, sadece QR kodu oluştur ve aracına yapıştır.
              </p>
            </div>

            {/* Visual Stage */}
            <div className="relative group">
               {/* Decorative Background Glows */}
               <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 pointer-events-none"></div>
               
               {/* Wrapper for the shadow that shouldn't be in the download */}
               <div className="relative transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1 drop-shadow-2xl">
                 <StickerPreview ref={stickerRef} data={stickerData} scale={1.1} />
               </div>

               {/* Reflection effect for realism */}
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none rounded-r-lg opacity-50"></div>
            </div>

            <div className="mt-12 flex items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl">📷</span>
                </div>
                <span className="text-xs font-bold mt-1">iOS & Android</span>
              </div>
              <div className="h-px w-12 bg-gray-300"></div>
              <div className="flex flex-col items-center gap-1">
                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <span className="text-xs font-bold mt-1">Tek Tıkla Ara</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;