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

const BWIP_OPTS = (config: BarcodeConfig) => ({
  bcid: BWIP_TYPES[config.type],
  text: config.value,
  scale: 4,
  includetext: config.showText,
  textxalign: 'center' as const,
  textcolor: config.color.replace('#', ''),
  barcolor: config.color.replace('#', ''),
  backgroundcolor: config.backgroundColor.replace('#', ''),
});

export function generateBarcodeSVG(config: BarcodeConfig): string {
  if (!config.value.trim()) return '';
  try {
    return bwip.toSVG(BWIP_OPTS(config));
  } catch {
    return '';
  }
}

export async function canvasToPngBlob(config: BarcodeConfig): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    try {
      bwipjs.toCanvas(canvas, BWIP_OPTS(config));
    } catch (e) {
      reject(e);
      return;
    }
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('No se pudo convertir a PNG'));
    }, 'image/png');
  });
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
