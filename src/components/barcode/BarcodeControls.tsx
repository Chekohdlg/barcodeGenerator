import type { BarcodeConfig, BarcodeType } from '../../types';

const BARCODE_TYPES: { value: BarcodeType; label: string }[] = [
  { value: 'qrcode', label: 'QR Code' },
  { value: 'code128', label: 'Code 128' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'upca', label: 'UPC-A' },
  { value: 'ean8', label: 'EAN-8' },
  { value: 'code39', label: 'Code 39' },
];

interface Props {
  config: BarcodeConfig;
  onChange: (partial: Partial<BarcodeConfig>) => void;
}

const labelClass = 'block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide';
const inputClass =
  'w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-zinc-600';

export function BarcodeControls({ config, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Contenido</label>
        <input
          type="text"
          value={config.value}
          onChange={(e) => onChange({ value: e.target.value })}
          className={inputClass}
          placeholder="Ingresa el contenido del código..."
        />
      </div>

      <div>
        <label className={labelClass}>Tipo de código</label>
        <select
          value={config.type}
          onChange={(e) => onChange({ type: e.target.value as BarcodeType })}
          className={inputClass}
        >
          {BARCODE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Ancho (px)</label>
          <input
            type="number"
            min={100}
            max={800}
            step={10}
            value={config.width}
            onChange={(e) => onChange({ width: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Alto (px)</label>
          <input
            type="number"
            min={100}
            max={800}
            step={10}
            value={config.height}
            onChange={(e) => onChange({ height: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Color barcode</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="h-9 w-10 rounded-lg cursor-pointer border border-surface-600 bg-surface-700 p-0.5"
            />
            <input
              type="text"
              value={config.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="flex-1 bg-surface-700 border border-surface-600 text-white rounded-lg px-2 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Color fondo</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="h-9 w-10 rounded-lg cursor-pointer border border-surface-600 bg-surface-700 p-0.5"
            />
            <input
              type="text"
              value={config.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="flex-1 bg-surface-700 border border-surface-600 text-white rounded-lg px-2 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-medium text-zinc-300">Mostrar texto</p>
          <p className="text-xs text-zinc-600 mt-0.5">Texto debajo del código</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ showText: !config.showText })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-800 ${
            config.showText ? 'bg-brand-500' : 'bg-surface-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              config.showText ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
