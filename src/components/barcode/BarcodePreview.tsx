import { useEffect, useRef, useState } from 'react';
import bwipjs from 'bwip-js';
import type { BarcodeConfig, BarcodeType } from '../../types';

const BWIP_TYPES: Record<BarcodeType, string> = {
  qrcode: 'qrcode',
  code128: 'code128',
  ean13: 'ean13',
  upca: 'upca',
  ean8: 'ean8',
  code39: 'code39',
};

interface Props {
  config: BarcodeConfig;
}

export function BarcodePreview({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!config.value.trim()) {
      setError('');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    try {
      bwipjs.toCanvas(canvasRef.current!, {
        bcid: BWIP_TYPES[config.type],
        text: config.value,
        scale: 4,
        includetext: config.showText,
        textxalign: 'center',
        textcolor: config.color.replace('#', ''),
        barcolor: config.color.replace('#', ''),
        backgroundcolor: config.backgroundColor.replace('#', ''),
      });
      setError('');
    } catch {
      setError('Valor inválido para este tipo de código.');
    }
  }, [config]);

  const isEmpty = !config.value.trim();

  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Canvas always mounted so canvasRef is never null */}
      <div
        style={{ backgroundColor: config.backgroundColor }}
        className={`rounded-xl p-8 shadow-2xl flex flex-col items-center gap-3 ${isEmpty || error ? 'hidden' : ''}`}
      >
        <canvas ref={canvasRef} />
        {config.showText && (
          <p
            style={{ color: config.color }}
            className="text-sm font-mono tracking-widest select-all"
          >
            {config.value}
          </p>
        )}
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-20 h-20 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-zinc-600 text-sm">Ingresa un valor para ver la vista previa</p>
        </div>
      )}

      {!isEmpty && error && (
        <div className="flex items-center justify-center h-full">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4 text-red-400 text-sm text-center max-w-xs">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
