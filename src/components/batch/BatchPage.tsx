import { useState, useRef } from 'react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { generateBarcodeSVG, svgToPngBlob } from '../../lib/barcode';
import type { BarcodeConfig } from '../../types';
import { useAppStore } from '../../store/appStore';

export function BatchPage() {
  const { barcodeConfig } = useAppStore();
  const [values, setValues] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleCSV(file: File) {
    Papa.parse<string[]>(file, {
      complete: (result) => {
        const vals = result.data
          .flat()
          .map((v) => String(v).trim())
          .filter(Boolean);
        setValues(vals);
        setStatusMsg(`${vals.length} valores cargados`);
        setProgress(0);
      },
      skipEmptyLines: true,
    });
  }

  async function generateBatch() {
    if (!values.length) return;
    const path = await save({
      defaultPath: 'barcodes_lote.zip',
      filters: [{ name: 'Archivo ZIP', extensions: ['zip'] }],
    });
    if (!path) return;

    setIsGenerating(true);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder('barcodes')!;

    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      const cfg: BarcodeConfig = { ...barcodeConfig, value: val };
      const svg = generateBarcodeSVG(cfg);
      if (svg) {
        try {
          const blob = await svgToPngBlob(svg, barcodeConfig.width, barcodeConfig.height);
          const buffer = await blob.arrayBuffer();
          const safeName = val.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
          folder.file(`${String(i + 1).padStart(4, '0')}_${safeName}.png`, buffer);
        } catch {
          // skip invalid values silently
        }
      }
      setProgress(Math.round(((i + 1) / values.length) * 100));
    }

    const zipData = await zip.generateAsync({ type: 'uint8array' });
    await writeFile(path, zipData);
    setIsGenerating(false);
    setStatusMsg(`¡${values.length} códigos exportados correctamente!`);
  }

  return (
    <div className="h-full flex flex-col p-6 gap-5 overflow-y-auto">
      <div>
        <h2 className="text-white font-semibold text-lg">Modo Lote</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Importa un CSV y genera un código de barras por cada fila
        </p>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-surface-600 rounded-xl p-10 text-center hover:border-brand-500/50 transition-colors cursor-pointer max-w-xl"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleCSV(f);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleCSV(f);
          }}
        />
        <svg
          className="w-10 h-10 mx-auto mb-3 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-zinc-400 text-sm font-medium">
          Arrastra tu CSV aquí o haz clic para seleccionar
        </p>
        <p className="text-zinc-600 text-xs mt-1">Una columna por valor de código</p>
      </div>

      {/* Values preview */}
      {values.length > 0 && (
        <div className="bg-surface-800 rounded-xl p-4 border border-surface-700 max-w-xl">
          <p className="text-sm font-medium text-zinc-300 mb-2">{statusMsg}</p>
          <div className="max-h-36 overflow-y-auto space-y-1">
            {values.slice(0, 12).map((v, i) => (
              <div key={i} className="text-xs text-zinc-500 font-mono bg-surface-700 rounded px-2 py-0.5">
                {v}
              </div>
            ))}
            {values.length > 12 && (
              <div className="text-xs text-zinc-600 text-center pt-1">
                … y {values.length - 12} más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress */}
      {isGenerating && (
        <div className="space-y-2 max-w-xl">
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

      {!isGenerating && statusMsg.includes('exportados') && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm max-w-xl">
          {statusMsg}
        </div>
      )}

      <button
        onClick={generateBatch}
        disabled={!values.length || isGenerating}
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
        {isGenerating ? 'Generando…' : `Exportar ${values.length || ''} códigos como ZIP`}
      </button>
    </div>
  );
}
