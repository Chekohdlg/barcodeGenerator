import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { load } from '@tauri-apps/plugin-store';

type Store = Awaited<ReturnType<typeof load>>;
let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await load('session.json', { defaults: {} });
  }
  return storeInstance;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initSession() {
      try {
        const store = await getStore();
        const saved = await store.get<Session>('supabase_session');
        if (saved?.access_token && saved?.refresh_token) {
          const { data } = await supabase.auth.setSession({
            access_token: saved.access_token,
            refresh_token: saved.refresh_token,
          });
          if (data.session) {
            setSession(data.session);
            await store.set('supabase_session', data.session);
          } else {
            await store.delete('supabase_session');
          }
        }
      } catch {
        // offline or store unavailable — continue without session
      } finally {
        setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      try {
        const store = await getStore();
        if (s) {
          await store.set('supabase_session', s);
        } else {
          await store.delete('supabase_session');
        }
      } catch {
        // ignore store errors
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    try {
      const store = await getStore();
      await store.delete('supabase_session');
    } catch {
      // ignore
    }
  }, []);

  return { session, loading, error, login, logout };
}
