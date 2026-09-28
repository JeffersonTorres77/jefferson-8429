import { ReactNode, FC } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Área de contenido y navbar con offset para el sidebar fijo */}
      <div className="flex flex-col min-w-0 pl-64 min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
