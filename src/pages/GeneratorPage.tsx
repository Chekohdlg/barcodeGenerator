import { BarcodeControls } from '../components/barcode/BarcodeControls';
import { BarcodePreview } from '../components/barcode/BarcodePreview';
import { ExportButtons } from '../components/barcode/ExportButtons';
import { useAppStore } from '../store/appStore';

export function GeneratorPage() {
  const { barcodeConfig, setBarcodeConfig } = useAppStore();

  return (
    <div className="flex h-full">
      {/* Left controls panel */}
      <div className="w-72 bg-surface-800 border-r border-surface-700 flex flex-col overflow-y-auto flex-shrink-0">
        <div className="p-5 border-b border-surface-700">
          <h2 className="text-foreground font-semibold">Generador Individual</h2>
          <p className="text-zinc-600 text-xs mt-0.5">Vista previa en tiempo real</p>
        </div>
        <div className="p-5 flex-1">
          <BarcodeControls config={barcodeConfig} onChange={setBarcodeConfig} />
        </div>
        <div className="p-5 border-t border-surface-700">
          <ExportButtons config={barcodeConfig} />
        </div>
      </div>

      {/* Right preview panel */}
      <div className="flex-1 bg-surface-900 overflow-hidden">
        <BarcodePreview config={barcodeConfig} />
      </div>
    </div>
  );
}
