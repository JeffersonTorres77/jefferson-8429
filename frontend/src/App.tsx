import { useState, FC } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionHistory } from './components/dashboard/TransactionHistory';
import { SnailPayModal } from './components/payment/SnailPayModal';
import { Loader2 } from 'lucide-react';

const MainContent: FC = () => {
  const { isAuthenticated, isLoading, transactions } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Loader de inicialización y recuperación de sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Cargando Snail Racing Platform...
        </p>
      </div>
    );
  }

  // Vista de Autenticación (Login / Registro) si no hay sesión
  if (!isAuthenticated) {
    return (
      <AuthLayout
        title={authView === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        subtitle={
          authView === 'login'
            ? 'Ingresa tus credenciales para acceder al panel de carreras'
            : 'Regístrate para comenzar a gestionar tu saldo y apuestas'
        }
      >
        {authView === 'login' ? (
          <LoginForm onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
        )}
      </AuthLayout>
    );
  }

  // Vista de Dashboard Protegido (Usuario Autenticado)
  return (
    <DashboardLayout>
      {({ currentTab, onOpenRechargeModal, isRechargeModalOpen, onCloseRechargeModal }) => (
        <>
          {currentTab === 'dashboard' && (
            <DashboardView onOpenRechargeModal={onOpenRechargeModal} />
          )}

          {currentTab === 'recharge' && (
            <div className="space-y-6">
              <DashboardView onOpenRechargeModal={onOpenRechargeModal} />
            </div>
          )}

          {currentTab === 'history' && (
            <div className="space-y-6">
              <TransactionHistory
                transactions={transactions}
                onOpenRechargeModal={onOpenRechargeModal}
              />
            </div>
          )}

          {/* Modal de Recarga SnailPay */}
          <SnailPayModal
            isOpen={isRechargeModalOpen}
            onClose={onCloseRechargeModal}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export const App: FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
