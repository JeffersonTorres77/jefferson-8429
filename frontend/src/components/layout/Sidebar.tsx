import { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../context/ModalContext';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Trophy,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: FC = () => {
  const { logout } = useAuth();
  const { openRechargeModal } = useModal();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 h-screen max-h-screen bg-white border-r border-slate-200 flex flex-col justify-between z-40 shadow-xs overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 bg-slate-50/70 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
            <span className="text-xl">🐌</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 tracking-tight">SNAIL RACING</div>
            <div className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> SnailPay Platform
            </div>
          </div>
        </div>

        {/* Navigation links con React Router NavLink */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navegación
          </div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Panel Principal</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            onClick={openRechargeModal}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Pasarela SnailPay</span>
          </button>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <History className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Historial Recargas</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Quick Snail Info Badge */}
        <div className="mx-4 my-2 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Temporada de Carreras</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            6 caracoles compitiendo en 6 carreras diarias simuladas.
          </p>
        </div>
      </div>

      {/* Footer logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 sticky bottom-0 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
