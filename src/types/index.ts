export type BarcodeType = 'qrcode' | 'code128' | 'ean13' | 'upca' | 'ean8' | 'code39';

export interface BarcodeConfig {
  type: BarcodeType;
  value: string;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  showText: boolean;
}

export interface SequentialConfig {
  prefix: string;
  suffix: string;
  start: number;
  count: number;
}

export type ActivePage = 'generator' | 'batch' | 'sequential' | 'settings';

export interface UpdateInfo {
  version: string;
  currentVersion: string;
  body: string | null;
}
