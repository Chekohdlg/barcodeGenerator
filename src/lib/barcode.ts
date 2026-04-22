import bwipjs from 'bwip-js';
// bwip-js v4 exposes toSVG at runtime but @types/bwip-js hasn't caught up
const bwip = bwipjs as unknown as { toSVG: (opts: object) => string };
import type { BarcodeConfig, BarcodeType } from '../types';

const BWIP_TYPES: Record<BarcodeType, string> = {
  qrcode: 'qrcode',
  code128: 'code128',
  ean13: 'ean13',
  upca: 'upca',
  ean8: 'ean8',
  code39: 'code39',
};

export function generateBarcodeSVG(config: BarcodeConfig): string {
  const { type, value, width, height, color, backgroundColor, showText } = config;
  if (!value.trim()) return '';
  try {
    return bwip.toSVG({
      bcid: BWIP_TYPES[type],
      text: value,
      scale: 3,
      width: Math.max(10, Math.floor(width / 10)),
      height: Math.max(10, Math.floor(height / 10)),
      includetext: showText,
      textxalign: 'center',
      textcolor: color.replace('#', ''),
      barcolor: color.replace('#', ''),
      backgroundcolor: backgroundColor.replace('#', ''),
    });
  } catch {
    return '';
  }
}

export async function svgToPngBlob(svg: string, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('No se pudo convertir a PNG'));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar SVG'));
    };
    img.src = url;
  });
}
