import type { UpdateInfo } from '../../types';

interface Props {
  info: UpdateInfo;
  downloading: boolean;
  progress: number;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateModal({ info, downloading, progress, onUpdate, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-surface-700 shadow-2xl mx-4">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-brand-500/20">
            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold">Nueva versión disponible</h3>
            <p className="text-zinc-500 text-sm mt-0.5">
              {info.currentVersion} → <span className="text-brand-400 font-medium">{info.version}</span>
            </p>
          </div>
        </div>

        {info.body && (
          <div className="bg-surface-700 rounded-xl p-3 mb-5 text-sm text-zinc-300 max-h-32 overflow-y-auto border border-surface-600 whitespace-pre-wrap">
            {info.body}
          </div>
        )}

        {downloading && (
          <div className="mb-5 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Descargando actualización…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600">La app se reiniciará automáticamente al terminar</p>
          </div>
        )}

        <div className="flex gap-3">
          {!downloading && (
            <button
              onClick={onDismiss}
              className="flex-1 bg-surface-700 hover:bg-surface-600 text-zinc-300 font-medium py-2 rounded-lg text-sm transition-colors border border-surface-600"
            >
              Más tarde
            </button>
          )}
          <button
            onClick={onUpdate}
            disabled={downloading}
            className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-foreground font-medium py-2 rounded-lg text-sm transition-colors"
          >
            {downloading ? 'Instalando…' : 'Actualizar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}
