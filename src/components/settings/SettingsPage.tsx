import type { Session } from '@supabase/supabase-js';
import { useAppStore } from '../../store/appStore';

interface Props {
  session: Session;
  onLogout: () => void;
}

export function SettingsPage({ session, onLogout }: Props) {
  const { isDark, toggleTheme } = useAppStore();

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Configuración</h2>
        <p className="text-zinc-500 text-sm mt-1">Administra tu cuenta y preferencias</p>
      </div>

      <div className="space-y-4 max-w-md">
        {/* Account card */}
        <div className="bg-surface-800 rounded-xl p-5 border border-surface-700">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-4">Cuenta</p>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">Usuario autenticado</p>
              <p className="text-sm font-medium text-white mt-0.5 truncate">{session.user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex-shrink-0 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Appearance card */}
        <div className="bg-surface-800 rounded-xl p-5 border border-surface-700">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-4">Apariencia</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Tema</p>
              <p className="text-xs text-zinc-500 mt-0.5">{isDark ? 'Modo oscuro activo' : 'Modo claro activo'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface-800 ${
                isDark ? 'bg-brand-500' : 'bg-zinc-400'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* About card */}
        <div className="bg-surface-800 rounded-xl p-5 border border-surface-700">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-4">Acerca de</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Aplicación</span>
              <span className="text-white font-medium">BarcodeGenerator</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Versión</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
