import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { SnailPayModal } from '../components/payment/SnailPayModal';

interface ModalContextType {
  openRechargeModal: () => void;
  closeRechargeModal: () => void;
  isRechargeModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  const openRechargeModal = () => setIsRechargeModalOpen(true);
  const closeRechargeModal = () => setIsRechargeModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        openRechargeModal,
        closeRechargeModal,
        isRechargeModalOpen,
      }}
    >
      {children}
      <SnailPayModal
        isOpen={isRechargeModalOpen}
        onClose={closeRechargeModal}
      />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal debe usarse dentro de un ModalProvider');
  }
  return context;
};
