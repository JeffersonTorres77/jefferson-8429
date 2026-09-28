import { ReactNode, useState, FC } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: (props: {
    currentTab: 'dashboard' | 'recharge' | 'history';
    onOpenRechargeModal: () => void;
    isRechargeModalOpen: boolean;
    onCloseRechargeModal: () => void;
  }) => ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'recharge' | 'history'>('dashboard');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);

  const handleOpenRechargeModal = () => setIsRechargeModalOpen(true);
  const handleCloseRechargeModal = () => setIsRechargeModalOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar fijo */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenRechargeModal={handleOpenRechargeModal}
      />

      {/* Área de contenido y header */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenRechargeModal={handleOpenRechargeModal} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children({
              currentTab,
              onOpenRechargeModal: handleOpenRechargeModal,
              isRechargeModalOpen,
              onCloseRechargeModal: handleCloseRechargeModal,
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
