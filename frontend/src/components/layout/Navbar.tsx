import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Wallet, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenRechargeModal: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenRechargeModal }) => {
  const { user, balance, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      {/* Saludo y bienvenida */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="text-xl">🐌</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-200">
            Hola, <span className="text-white font-bold">{user?.fullName || 'Piloto'}</span>
          </h1>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Saldo y acciones rápidas */}
      <div className="flex items-center gap-4">
        {/* Card de Saldo en vivo */}
        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Saldo Disponible</div>
            <div className="text-base font-extrabold text-emerald-400 leading-tight">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Botón de Cargar Saldo SnailPay */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenRechargeModal}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="shadow-md"
        >
          Cargar Saldo
        </Button>

        {/* Avatar y Botón de Logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
