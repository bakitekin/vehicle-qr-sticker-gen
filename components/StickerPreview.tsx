import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { StickerData } from '../types';
import { Smartphone } from 'lucide-react';

interface StickerPreviewProps {
  data: StickerData;
  scale?: number;
}

const StickerPreview = forwardRef<HTMLDivElement, StickerPreviewProps>(({ data, scale = 1 }, ref) => {
  const { phoneNumber, bodyText, theme } = data;
  
  const qrValue = phoneNumber ? `tel:${phoneNumber}` : 'https://google.com';

  const getThemeStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          container: 'bg-black',
          content: 'text-white',
          qrContainer: 'bg-white',
          qrColor: '#000000',
          border: ''
        };
      case 'minimal':
        return {
          container: 'bg-white',
          content: 'text-neutral-900',
          qrContainer: 'bg-neutral-100',
          qrColor: '#000000',
          border: 'border-[8px] border-neutral-100'
        };
      case 'navy':
        return {
          container: 'bg-blue-600',
          content: 'text-white',
          qrContainer: 'bg-white',
          qrColor: '#2563eb',
          border: ''
        };
      case 'ultra':
        return {
          container: 'bg-orange-500', // Cam için parlak turuncu
          content: 'text-white',
          qrContainer: 'bg-white',
          qrColor: '#000000', // Siyah QR kodu en iyi okunabilirlik için
          border: ''
        };
      case 'classic':
      default:
        return {
          container: 'bg-[#FFD600]', // Taxi yellow
          content: 'text-black',
          qrContainer: 'bg-white',
          qrColor: '#000000',
          border: 'border-[8px] border-black'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div 
      ref={ref}
      className={`relative flex flex-col items-center justify-center gap-6 p-6 overflow-hidden ${styles.container} ${styles.border} rounded-[3rem]`}
      style={{
        width: `${274 * scale}px`,
        height: `${410 * scale}px`,
      }}
    >
      {/* Decorative Top Shine for 'Creative' look (only visible on dark themes) */}
      {(theme === 'modern' || theme === 'navy' || theme === 'ultra') && (
        <div className="absolute top-10 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      )}

      {/* Hero QR Section - Maximized Size */}
      <div className="relative z-10 flex-grow flex items-center justify-center  ">
        {/* The visual container for the QR */}
        <div className={`${styles.qrContainer} p-4 rounded-[2rem] shadow-sm`}>
          <QRCodeCanvas
            value={qrValue}
            size={215 * scale} // Increased size significantly
            level={"H"}
            bgColor={theme === 'minimal' ? '#f5f5f5' : '#FFFFFF'}
            fgColor={styles.qrColor}
            includeMargin={false}
          />
        </div>

        {!phoneNumber && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-black/50 backdrop-blur-[2px]">
            <Smartphone className="w-12 h-12 text-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className={`relative z-10 w-full flex items-start justify-center pb-8 h-[40%]`}>
        <p 
          className={`font-black text-center leading-tight uppercase ${styles.content} opacity-90`}
          style={{ fontSize: `${24 * scale}px` }}
        >
          {bodyText}
        </p>
      </div>
    </div>
  );
});

StickerPreview.displayName = 'StickerPreview';

export default StickerPreview;