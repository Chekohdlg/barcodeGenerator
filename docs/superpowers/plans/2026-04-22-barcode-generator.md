# BarcodeGenerator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Tauri v2 + React + TypeScript desktop app for barcode generation with Supabase auth, batch/sequential modes, and auto-update.

**Architecture:** Single-window Tauri v2 app with React SPA inside. Auth gating at App.tsx level — no router, just conditional rendering. Zustand for global UI state. Tauri plugins for file I/O, store, dialog, updater.

**Tech Stack:** Tauri v2, React 18, TypeScript, Tailwind CSS v3, Zustand, Supabase JS v2, bwip-js, jsPDF, svg2pdf.js, JSZip, PapaParse, @tauri-apps/plugin-{dialog,fs,store,updater}

---

## File Map

```
BarcodeGenerator/
├── .github/workflows/release.yml
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/index.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── barcode.ts
│   ├── store/
│   │   └── appStore.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useUpdater.ts
│   ├── components/
│   │   ├── auth/LoginScreen.tsx
│   │   ├── layout/AppLayout.tsx
│   │   ├── layout/Sidebar.tsx
│   │   ├── barcode/BarcodeControls.tsx
│   │   ├── barcode/BarcodePreview.tsx
│   │   ├── barcode/ExportButtons.tsx
│   │   ├── batch/BatchPage.tsx
│   │   ├── sequential/SequentialPage.tsx
│   │   ├── settings/SettingsPage.tsx
│   │   └── updater/UpdateModal.tsx
│   └── pages/GeneratorPage.tsx
└── src-tauri/
    ├── src/main.rs
    ├── src/lib.rs
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    └── capabilities/default.json
```

---

### Task 1: Project scaffold — package.json, configs, index.html

**Files:** Create all root config files

- [ ] Create `package.json`
- [ ] Create `vite.config.ts`
- [ ] Create `tsconfig.json`
- [ ] Create `tailwind.config.js` + `postcss.config.js`
- [ ] Create `index.html`
- [ ] Create `.env.example`

### Task 2: Tauri v2 backend config

**Files:** `src-tauri/Cargo.toml`, `src-tauri/build.rs`, `src-tauri/src/main.rs`, `src-tauri/src/lib.rs`, `src-tauri/tauri.conf.json`, `src-tauri/capabilities/default.json`

- [ ] Create all Tauri backend files

### Task 3: TypeScript types + Zustand store + Supabase client + Barcode lib

**Files:** `src/types/index.ts`, `src/store/appStore.ts`, `src/lib/supabase.ts`, `src/lib/barcode.ts`

- [ ] Create all lib/store/type files

### Task 4: Auth hook + Login screen

**Files:** `src/hooks/useAuth.ts`, `src/components/auth/LoginScreen.tsx`

- [ ] Create useAuth hook with session persistence via Tauri store
- [ ] Create LoginScreen component

### Task 5: Theme hook + App layout + Sidebar

**Files:** `src/hooks/useTheme.ts`, `src/components/layout/AppLayout.tsx`, `src/components/layout/Sidebar.tsx`

- [ ] Create theme system and layout shell

### Task 6: App.tsx + main.tsx + index.css

**Files:** `src/App.tsx`, `src/main.tsx`, `src/index.css`

- [ ] Create entry points

### Task 7: Generator page — controls, preview, export

**Files:** `src/pages/GeneratorPage.tsx`, `src/components/barcode/BarcodeControls.tsx`, `src/components/barcode/BarcodePreview.tsx`, `src/components/barcode/ExportButtons.tsx`

- [ ] Create individual barcode generator with real-time preview and PNG/SVG/PDF export

### Task 8: Batch mode

**Files:** `src/components/batch/BatchPage.tsx`

- [ ] CSV import, batch generation, ZIP export with progress bar

### Task 9: Sequential mode

**Files:** `src/components/sequential/SequentialPage.tsx`

- [ ] Prefix/suffix/start/count inputs, preview first 3, ZIP export

### Task 10: Settings page + Auto-updater

**Files:** `src/components/settings/SettingsPage.tsx`, `src/hooks/useUpdater.ts`, `src/components/updater/UpdateModal.tsx`

- [ ] Settings (theme, logout, user email) + updater modal

### Task 11: npm install

- [ ] Run `npm install` in BarcodeGenerator directory

### Task 12: GitHub Actions CI/CD

**Files:** `.github/workflows/release.yml`

- [ ] Create release workflow for Tauri Windows build + auto-sign + publish

### Task 13: Git init + initial commit

- [ ] `git init`, configure user, add all files, commit
