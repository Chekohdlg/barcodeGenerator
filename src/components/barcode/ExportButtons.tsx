import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import jsPDF from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { generateBarcodeSVG, svgToPngBlob } from '../../lib/barcode';
import type { BarcodeConfig } from '../../types';

interface Props {
  config: BarcodeConfig;
}

export function ExportButtons({ config }: Props) {
  const disabled = !config.value.trim();

  async function exportPNG() {
    const svg = generateBarcodeSVG(config);
    if (!svg) return;
    const path = await save({
      defaultPath: 'barcode.png',
      filters: [{ name: 'Imagen PNG', extensions: ['png'] }],
    });
    if (!path) return;
    const blob = await svgToPngBlob(svg, config.width, config.height);
    const buffer = await blob.arrayBuffer();
    await writeFile(path, new Uint8Array(buffer));
  }

  async function exportSVG() {
    const svg = generateBarcodeSVG(config);
    if (!svg) return;
    const path = await save({
      defaultPath: 'barcode.svg',
      filters: [{ name: 'Imagen SVG', extensions: ['svg'] }],
    });
    if (!path) return;
    await writeFile(path, new TextEncoder().encode(svg));
  }

  async function exportPDF() {
    const svgStr = generateBarcodeSVG(config);
    if (!svgStr) return;
    const path = await save({
      defaultPath: 'barcode.pdf',
      filters: [{ name: 'Documento PDF', extensions: ['pdf'] }],
    });
    if (!path) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgEl = doc.documentElement as unknown as SVGSVGElement;

    const pdf = new jsPDF({
      unit: 'px',
      format: [config.width, config.height],
      orientation: config.width >= config.height ? 'landscape' : 'portrait',
    });
    await svg2pdf(svgEl, pdf, { x: 0, y: 0, width: config.width, height: config.height });

    const blob = pdf.output('blob');
    const buffer = await blob.arrayBuffer();
    await writeFile(path, new Uint8Array(buffer));
  }

  const btnBase =
    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full';
  const btnActive =
    'bg-surface-700 hover:bg-surface-600 text-zinc-300 hover:text-foreground border border-surface-600';
  const btnDisabled = 'bg-surface-800 text-zinc-700 cursor-not-allowed border border-surface-700';

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Exportar</p>

      <button
        onClick={exportPNG}
        disabled={disabled}
        className={`${btnBase} ${disabled ? btnDisabled : btnActive}`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Exportar PNG
      </button>

      <button
        onClick={exportSVG}
        disabled={disabled}
        className={`${btnBase} ${disabled ? btnDisabled : btnActive}`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Exportar SVG
      </button>

      <button
        onClick={exportPDF}
        disabled={disabled}
        className={`${btnBase} ${disabled ? btnDisabled : btnActive}`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Exportar PDF
      </button>
    </div>
  );
}
