import { useState } from 'react';
import JSZip from 'jszip';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { generateBarcodeSVG, svgToPngBlob } from '../../lib/barcode';
import type { BarcodeConfig } from '../../types';
import { useAppStore } from '../../store/appStore';

export function SequentialPage() {
  const { barcodeConfig } = useAppStore();
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [start, setStart] = useState(1);
  const [count, setCount] = useState(10);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function buildValues(total: number) {
    return Array.from({ length: total }, (_, i) => `${prefix}${start + i}${suffix}`);
  }

  const previews = buildValues(3);

  async function exportZip() {
    const path = await save({
      defaultPath: 'barcodes_secuencial.zip',
      filters: [{ name: 'Archivo ZIP', extensions: ['zip'] }],
    });
    if (!path) return;

    setIsGenerating(true);
    setDone(false);
    setProgress(0);

    const vals = buildValues(count);
    const zip = new JSZip();
    const folder = zip.folder('barcodes')!;

    for (let i = 0; i < vals.length; i++) {
      const cfg: BarcodeConfig = { ...barcodeConfig, value: vals[i] };
      const svg = generateBarcodeSVG(cfg);
      if (svg) {
        try {
          const blob = await svgToPngBlob(svg, barcodeConfig.width, barcodeConfig.height);
          const buffer = await blob.arrayBuffer();
          const safeName = vals[i].replace(/[^a-zA-Z0-9-_]/g, '_');
          folder.file(`${safeName}.png`, buffer);
        } catch {
          // skip
        }
      }
      setProgress(Math.round(((i + 1) / vals.length) * 100));
    }

    const zipData = await zip.generateAsync({ type: 'uint8array' });
    await writeFile(path, zipData);
    setIsGenerating(false);
    setDone(true);
  }

  const inputClass =
    'w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide';

  return (
    <div className="h-full flex flex-col p-6 gap-5 overflow-y-auto">
      <div>
        <h2 className="text-white font-semibold text-lg">Numeración Secuencial</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Genera automáticamente una serie de códigos numerados
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div>
          <label className={labelClass}>Prefijo</label>
          <input
            value={prefix}
            onChange={(e) => { setPrefix(e.target.value); setDone(false); }}
            placeholder="Ej: PROD-"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sufijo</label>
          <input
            value={suffix}
            onChange={(e) => { setSuffix(e.target.value); setDone(false); }}
            placeholder="Ej: -2026"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Número inicial</label>
          <input
            type="number"
            value={start}
            min={0}
            onChange={(e) => { setStart(Number(e.target.value)); setDone(false); }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cantidad</label>
          <input
            type="number"
            value={count}
            min={1}
            max={10000}
            onChange={(e) => { setCount(Number(e.target.value)); setDone(false); }}
            className={inputClass}
          />
        </div>
      </div>

      {/* Preview first 3 */}
      <div className="bg-surface-800 rounded-xl p-4 border border-surface-700 max-w-lg">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Vista previa (primeros 3)
        </p>
        <div className="flex gap-3">
          {previews.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-surface-700 rounded-lg px-3 py-2.5 text-center border border-surface-600"
            >
              <p className="text-white text-sm font-mono truncate">{v || <span className="text-zinc-600">—</span>}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      {isGenerating && (
        <div className="space-y-2 max-w-lg">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Generando códigos…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {done && !isGenerating && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm max-w-lg">
          ¡{count} códigos exportados correctamente!
        </div>
      )}

      <button
        onClick={exportZip}
        disabled={count < 1 || isGenerating}
        className="self-start flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {isGenerating ? 'Generando…' : `Exportar ${count} códigos como ZIP`}
      </button>
    </div>
  );
}
