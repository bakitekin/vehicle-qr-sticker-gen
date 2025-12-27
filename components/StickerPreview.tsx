import React, { forwardRef, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { StickerData } from '../types';
import { Smartphone } from 'lucide-react';

interface StickerPreviewProps {
  data: StickerData;
  scale?: number;
}

const StickerPreview = forwardRef<HTMLDivElement, StickerPreviewProps>(({ data, scale = 1 }, ref) => {
  const { phoneNumber, bodyText, theme } = data;
  const qrContainerRef = useRef<HTMLDivElement>(null);
  
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

  // QR kod render edildikten sonra alignment pattern'ları yuvarlak yap
  useEffect(() => {
    const container = qrContainerRef.current;
    if (!container) return;

    const processCanvas = () => {
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        setTimeout(processCanvas, 100);
        return;
      }

      // Canvas'ın yüklenmesini bekle
      if (canvas.width === 0 || canvas.height === 0) {
        setTimeout(processCanvas, 100);
        return;
      }

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        console.log('Canvas context alınamadı');
        return;
      }

      const size = canvas.width;
      console.log('Canvas boyutu:', size);
      
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      
      // Modül boyutunu tespit et - finder pattern'dan
      let moduleSize = size / 25;
      for (let y = 0; y < size * 0.2; y++) {
        for (let x = 0; x < size * 0.2; x++) {
          const idx = (y * size + x) * 4;
          if (data[idx] < 128) { // Siyah piksel bulundu
            let count = 0;
            for (let i = x; i < Math.min(x + 20, size); i++) {
              const idx2 = (y * size + i) * 4;
              if (data[idx2] < 128) count++;
              else break;
            }
            if (count > 10) {
              moduleSize = count / 7;
              break;
            }
          }
        }
        if (moduleSize !== size / 25) break;
      }

      const alignmentSize = moduleSize * 7;
      const borderRadius = alignmentSize * 0.25;

      // Alignment pattern'ları bul - 7x7 pattern ara
      const findPatterns = () => {
        const patterns: Array<{ x: number; y: number }> = [];
        const finderSize = moduleSize * 7;
        
        // Arama bölgeleri (finder pattern'ların dışında)
        const regions = [
          { minX: finderSize + moduleSize * 2, maxX: size * 0.6, minY: finderSize + moduleSize * 2, maxY: size * 0.6 },
          { minX: size * 0.6, maxX: size - finderSize - moduleSize * 2, minY: finderSize + moduleSize * 2, maxY: size * 0.6 },
          { minX: finderSize + moduleSize * 2, maxX: size * 0.6, minY: size * 0.6, maxY: size - finderSize - moduleSize * 2 },
        ];

        regions.forEach(region => {
          for (let y = region.minY; y < region.maxY && patterns.length < 3; y += 3) {
            for (let x = region.minX; x < region.maxX && patterns.length < 3; x += 3) {
              // 7x7 pattern kontrolü: dış siyah, iç beyaz, merkez siyah
              let isPattern = true;
              const testSize = Math.floor(moduleSize * 3.5);
              
              // Dış çerçeve kontrolü
              for (let i = -testSize; i <= testSize && isPattern; i++) {
                const px1 = Math.floor(x + i);
                const py1 = Math.floor(y - testSize);
                const px2 = Math.floor(x + i);
                const py2 = Math.floor(y + testSize);
                const px3 = Math.floor(x - testSize);
                const py3 = Math.floor(y + i);
                const px4 = Math.floor(x + testSize);
                const py4 = Math.floor(y + i);
                
                if (px1 >= 0 && px1 < size && py1 >= 0 && py1 < size) {
                  const idx1 = (py1 * size + px1) * 4;
                  if (data[idx1] > 128) isPattern = false; // Dış çerçeve siyah olmalı
                }
                if (px2 >= 0 && px2 < size && py2 >= 0 && py2 < size) {
                  const idx2 = (py2 * size + px2) * 4;
                  if (data[idx2] > 128) isPattern = false;
                }
                if (px3 >= 0 && px3 < size && py3 >= 0 && py3 < size) {
                  const idx3 = (py3 * size + px3) * 4;
                  if (data[idx3] > 128) isPattern = false;
                }
                if (px4 >= 0 && px4 < size && py4 >= 0 && py4 < size) {
                  const idx4 = (py4 * size + px4) * 4;
                  if (data[idx4] > 128) isPattern = false;
                }
              }
              
              // Merkez beyaz kontrolü
              if (isPattern) {
                const centerIdx = (Math.floor(y) * size + Math.floor(x)) * 4;
                if (data[centerIdx] < 200) isPattern = false; // Merkez beyaz olmalı
              }
              
              if (isPattern) {
                const isDuplicate = patterns.some(p => 
                  Math.abs(p.x - x) < alignmentSize && Math.abs(p.y - y) < alignmentSize
                );
                if (!isDuplicate) {
                  patterns.push({ x, y });
                }
              }
            }
          }
        });
        
        return patterns;
      };

      const positions = findPatterns();
      console.log('Bulunan pattern sayısı:', positions.length, positions);
      
      // Eğer pattern bulunamadıysa, standart pozisyonları kullan
      const finalPositions = positions.length >= 3 ? positions : [
        { x: size * 0.35, y: size * 0.35 },
        { x: size * 0.65, y: size * 0.35 },
        { x: size * 0.35, y: size * 0.65 },
      ];
      
      console.log('Kullanılacak pozisyonlar:', finalPositions);

      // Rounded rectangle çizme fonksiyonu
      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, width, height, radius);
        } else {
          // Fallback: Manuel path
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }
      };

      // Her alignment pattern için köşeleri yuvarlatılmış kare oluştur
      console.log('Alignment size:', alignmentSize, 'Border radius:', borderRadius);
      finalPositions.forEach((pos, index) => {
        const halfSize = alignmentSize / 2;
        const x = pos.x - halfSize;
        const y = pos.y - halfSize;

        console.log(`Pattern ${index + 1} - x: ${x}, y: ${y}, size: ${alignmentSize}`);

        // Önce mevcut kareyi temizle (biraz daha geniş alan)
        ctx.clearRect(
          x - 4,
          y - 4,
          alignmentSize + 8,
          alignmentSize + 8
        );

        // Dış köşeleri yuvarlatılmış kare (QR kod rengi)
        ctx.fillStyle = styles.qrColor;
        ctx.beginPath();
        drawRoundedRect(x, y, alignmentSize, alignmentSize, borderRadius);
        ctx.fill();

        // İç köşeleri yuvarlatılmış kare (beyaz)
        const innerSize = alignmentSize * 0.57;
        const innerX = pos.x - innerSize / 2;
        const innerY = pos.y - innerSize / 2;
        const innerRadius = borderRadius * 0.6;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        drawRoundedRect(innerX, innerY, innerSize, innerSize, innerRadius);
        ctx.fill();

        // Merkez nokta (küçük yuvarlak)
        const centerSize = alignmentSize * 0.28;
        ctx.fillStyle = styles.qrColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, centerSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Canvas render'ını bekle - MutationObserver ile daha güvenilir
    const observer = new MutationObserver(() => {
      setTimeout(processCanvas, 200);
    });
    
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
    
    // İlk deneme
    const timeout = setTimeout(processCanvas, 500);
    
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [qrValue, scale, styles.qrColor, theme]);

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
        <div ref={qrContainerRef} className={`${styles.qrContainer} p-4 rounded-[2rem] shadow-sm`}>
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