import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden min-w-0">{children}</main>
    </div>
  );
}
