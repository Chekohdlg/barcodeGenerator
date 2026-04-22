import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useUpdater } from './hooks/useUpdater';
import { LoginScreen } from './components/auth/LoginScreen';
import { AppLayout } from './components/layout/AppLayout';
import { GeneratorPage } from './pages/GeneratorPage';
import { BatchPage } from './components/batch/BatchPage';
import { SequentialPage } from './components/sequential/SequentialPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { UpdateModal } from './components/updater/UpdateModal';
import { useAppStore } from './store/appStore';

function App() {
  const { session, loading, error, login, logout } = useAuth();
  const { updateInfo, downloading, downloadProgress, downloadAndInstall, dismissUpdate } = useUpdater();
  const { activePage } = useAppStore();
  useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={login} error={error} />;
  }

  return (
    <>
      <AppLayout>
        {activePage === 'generator' && <GeneratorPage />}
        {activePage === 'batch' && <BatchPage />}
        {activePage === 'sequential' && <SequentialPage />}
        {activePage === 'settings' && <SettingsPage session={session} onLogout={logout} />}
      </AppLayout>

      {updateInfo && (
        <UpdateModal
          info={updateInfo}
          downloading={downloading}
          progress={downloadProgress}
          onUpdate={downloadAndInstall}
          onDismiss={dismissUpdate}
        />
      )}
    </>
  );
}

export default App;
