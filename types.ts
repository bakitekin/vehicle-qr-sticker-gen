export type StickerTheme = 'classic' | 'modern' | 'minimal' | 'navy' | 'ultra';

export interface StickerData {
  phoneNumber: string;
  headerText: string;
  bodyText: string;
  theme: StickerTheme;
}

export const PRESET_MESSAGES = [
  "ARAÇ SAHİBİNE ULAŞMAK İÇİN OKUTUN",
  "YANLIŞ PARK ETTİYSEM LÜTFEN ARAYIN",
  "ACİL DURUMDA ULAŞMAK İÇİN OKUTUN",
  "KISA SÜRELİ PARK ETTİM, HEMEN GELİYORUM"
];

export const DEFAULT_STICKER_DATA: StickerData = {
  phoneNumber: '',
  headerText: 'İLETİŞİM',
  bodyText: 'ARAÇ SAHİBİNE ULAŞMAK İÇİN OKUTUN',
  theme: 'classic'
};