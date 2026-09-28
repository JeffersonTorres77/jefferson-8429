import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionHistory } from './components/dashboard/TransactionHistory';

// Componente para la página del Dashboard
const DashboardPage: FC = () => {
  return (
    <DashboardLayout>
      <DashboardView />
    </DashboardLayout>
  );
};

// Componente para la página de Historial de Transacciones
const HistoryPage: FC = () => {
  const { transactions } = useAuth();
  return (
    <DashboardLayout>
      <TransactionHistory transactions={transactions} />
    </DashboardLayout>
  );
};

export const App: FC = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas (Solo accesibles si no hay sesión) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthLayout
                    title="Iniciar Sesión"
                    subtitle="Ingresa tus credenciales para acceder al panel de carreras"
                  >
                    <LoginForm />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AuthLayout
                    title="Crear Cuenta"
                    subtitle="Regístrate para comenzar a gestionar tu saldo y apuestas"
                  >
                    <RegisterForm />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            {/* Rutas Protegidas (Solo accesibles con sesión activa) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto / Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
