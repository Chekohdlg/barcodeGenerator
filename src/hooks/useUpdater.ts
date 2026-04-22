import { useState, useEffect, useCallback } from 'react';
import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { getVersion } from '@tauri-apps/api/app';
import type { UpdateInfo } from '../types';

const FOUR_HOURS = 4 * 60 * 60 * 1000;

export function useUpdater() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const checkForUpdates = useCallback(async () => {
    try {
      const currentVersion = await getVersion();
      const u = await check();
      if (u?.available) {
        setPendingUpdate(u);
        setUpdateInfo({
          version: u.version,
          currentVersion,
          body: u.body ?? null,
        });
      }
    } catch {
      // No internet or check failed — silently skip
    }
  }, []);

  useEffect(() => {
    checkForUpdates();
    const timer = setInterval(checkForUpdates, FOUR_HOURS);
    return () => clearInterval(timer);
  }, [checkForUpdates]);

  const downloadAndInstall = useCallback(async () => {
    if (!pendingUpdate) return;
    setDownloading(true);
    let downloaded = 0;
    let total = 0;

    await pendingUpdate.downloadAndInstall((event) => {
      if (event.event === 'Started') {
        total = event.data.contentLength ?? 0;
      } else if (event.event === 'Progress') {
        downloaded += event.data.chunkLength;
        if (total > 0) {
          setDownloadProgress(Math.round((downloaded / total) * 100));
        }
      } else if (event.event === 'Finished') {
        setDownloadProgress(100);
      }
    });

    await relaunch();
  }, [pendingUpdate]);

  const dismissUpdate = useCallback(() => {
    setUpdateInfo(null);
    setPendingUpdate(null);
  }, []);

  return { updateInfo, downloading, downloadProgress, downloadAndInstall, dismissUpdate };
}
