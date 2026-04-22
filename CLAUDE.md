# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Instalar dependencias (solo la primera vez o después de cambiar package.json)
npm install

# Iniciar en modo desarrollo (abre la ventana Tauri con hot-reload)
npm run tauri dev

# Build de producción (genera instalador en src-tauri/target/release/bundle/)
npm run tauri build

# Solo frontend (sin Tauri, para desarrollo rápido de UI)
npm run dev

# Compilar TypeScript y verificar tipos
npm run build

# Generar íconos de Tauri desde una imagen (requiere tener la imagen en src-tauri/icons/app-icon.png)
npm run tauri icon
```

## Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS v3
- **Desktop**: Tauri v2 (Rust backend)
- **Estado global**: Zustand (`src/store/appStore.ts`)
- **Auth**: Supabase JS (`@supabase/supabase-js`) — solo autenticación, sin tablas extra
- **Barcodes**: bwip-js v4
- **Export**: jsPDF + svg2pdf.js + JSZip (para ZIP en lote)
- **CSV parsing**: PapaParse

## Arquitectura

```
src/
├── components/
│   ├── auth/          # LoginForm
│   ├── barcode/       # BarcodePreview, BarcodeControls
│   ├── batch/         # BatchMode (import CSV, export ZIP)
│   ├── layout/        # Sidebar, MainLayout
│   ├── sequential/    # SequentialMode (prefijo/sufijo/serie)
│   ├── settings/      # SettingsPanel
│   └── updater/       # UpdaterModal (auto-update UI)
├── hooks/
│   ├── useAuth.ts     # Maneja sesión Supabase + persistencia con plugin-store
│   ├── useTheme.ts    # Tema oscuro/claro, persiste preferencia
│   └── useUpdater.ts  # Verifica GitHub releases, polling cada 4h
├── lib/
│   ├── barcode.ts     # Wrapper de bwip-js: renderiza SVG/PNG en canvas
│   └── supabase.ts    # Cliente Supabase (lee VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
├── pages/
│   └── GeneratorPage.tsx  # Pantalla principal del generador individual
├── store/
│   └── appStore.ts    # Store Zustand: tema, usuario, configuración de barcode
└── types/
    └── index.ts       # Tipos compartidos: BarcodeType, BarcodeConfig, etc.

src-tauri/
├── src/
│   ├── lib.rs         # Punto de entrada de la app Tauri (run())
│   └── main.rs        # Binario principal
├── capabilities/
│   └── default.json   # Permisos Tauri v2 (dialog, fs, store, updater, etc.)
└── tauri.conf.json    # Configuración de la app, ventana, updater endpoint
```

## Variables de entorno

Crear `.env` en la raíz (hay un `.env.example` de referencia):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Las variables `VITE_*` son expuestas al frontend por Vite. Nunca usar la service key en el frontend.

## Autenticación

- Solo login con email/password — **no hay pantalla de registro**
- Los usuarios se crean manualmente desde el dashboard de Supabase
- La sesión se persiste con `@tauri-apps/plugin-store` (no localStorage)
- `useAuth.ts` maneja: login, logout, restaurar sesión al inicio, redirigir si expiró
- Si no hay internet pero hay sesión guardada válida → permitir uso offline

## Tipos de barcode soportados

| Tipo | Código bwip-js |
|---|---|
| QR Code | `qrcode` |
| Code 128 | `code128` |
| EAN-13 | `ean13` |
| UPC-A | `upca` |
| EAN-8 | `ean8` |
| Code 39 | `code39` |

La generación ocurre en `src/lib/barcode.ts` usando `bwip-js.toCanvas()`. El SVG se obtiene renderizando en canvas y exportando con `canvas.toBlob()`.

## Exportación

Usa Tauri APIs exclusivamente — nunca `<a download>` ni APIs de browser:
- **PNG/SVG/PDF**: `@tauri-apps/plugin-dialog` para elegir ruta, `@tauri-apps/plugin-fs` para escribir
- **ZIP (lote/secuencial)**: JSZip genera el blob, luego plugin-fs escribe el archivo

## Auto-update

- Plugin: `@tauri-apps/plugin-updater`
- Endpoint configurado en `tauri.conf.json` → `plugins.updater.endpoints`
- La URL apunta al `latest.json` del release de GitHub (actualizar `YOUR_GITHUB_USERNAME`)
- `useUpdater.ts` verifica al inicio y cada 4 horas; falla silenciosamente sin internet
- `UpdaterModal` muestra versión actual vs nueva, barra de progreso de descarga

### Formato latest.json (subir a cada GitHub Release)

```json
{
  "version": "1.0.1",
  "notes": "Descripción de cambios",
  "pub_date": "2026-04-22T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "url": "https://github.com/TU_USUARIO/BarcodeGenerator/releases/download/v1.0.1/barcode-generator_1.0.1_x64-setup.exe",
      "signature": "FIRMA_GENERADA_POR_TAURI"
    }
  }
}
```

## CI/CD (GitHub Actions)

Workflow en `.github/workflows/release.yml`. Se dispara con push de tags `v*.*.*`:

```bash
git tag v1.0.1
git push origin v1.0.1
```

El workflow buildea el instalador `.exe`, lo firma con las keys del updater, publica el GitHub Release y sube el `latest.json`.

**Secrets de GitHub requeridos:**
- `TAURI_SIGNING_PRIVATE_KEY` — clave privada generada con `npm run tauri signer generate`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` — contraseña de la clave

## Permisos Tauri v2

Los permisos están en `src-tauri/capabilities/default.json`. Si se agrega funcionalidad nueva que requiera acceso a filesystem, diálogos, etc., agregar el permiso correspondiente ahí. Tauri v2 usa un sistema de capabilities — sin el permiso declarado, la API falla en producción aunque funcione en dev.

## Notas técnicas

- Usar **siempre Tauri v2 APIs** — la v1 tiene APIs distintas e incompatibles
- El updater requiere que `bundle.createUpdaterArtifacts = true` en `tauri.conf.json` (ya configurado)
- La `pubkey` del updater en `tauri.conf.json` debe ser la clave pública correspondiente a `TAURI_SIGNING_PRIVATE_KEY`
- Zustand store no persiste por defecto — la persistencia de sesión va por `plugin-store`

## Git workflow

Siempre branch → trabajo → merge a main:

```bash
git checkout -b feature/<nombre>
# cambios...
git add -A && git commit -m "feat: ..."
git checkout main && git merge feature/<nombre>
```
