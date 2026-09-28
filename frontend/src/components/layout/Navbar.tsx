import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../context/ModalContext';
import { Button } from '../common/Button';
import { Wallet, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: FC = () => {
  const { user, balance, logout } = useAuth();
  const { openRechargeModal } = useModal();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Saludo y bienvenida */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
          <span className="text-xl">🐌</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">
            Hola, <span className="text-indigo-700 font-extrabold">{user?.fullName || 'Piloto'}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
        </div>
      </div>

      {/* Saldo y acciones rápidas */}
      <div className="flex items-center gap-4">
        {/* Card de Saldo en vivo */}
        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Saldo Disponible</div>
            <div className="text-base font-extrabold text-slate-900 leading-tight">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Botón de Cargar Saldo SnailPay */}
        <Button
          variant="primary"
          size="sm"
          onClick={openRechargeModal}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="shadow-sm"
        >
          Cargar Saldo
        </Button>

        {/* Avatar y Botón de Logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <UserIcon className="w-4 h-4" />
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
