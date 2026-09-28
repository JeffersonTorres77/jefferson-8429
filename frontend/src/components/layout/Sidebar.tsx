import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Trophy,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'recharge' | 'history';
  onSelectTab: (tab: 'dashboard' | 'recharge' | 'history') => void;
  onOpenRechargeModal: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenRechargeModal
}) => {
  const { logout } = useAuth();

  const navigation = [
    {
      id: 'dashboard',
      name: 'Panel Principal',
      icon: LayoutDashboard,
      onClick: () => onSelectTab('dashboard'),
    },
    {
      id: 'recharge',
      name: 'Pasarela SnailPay',
      icon: CreditCard,
      onClick: () => onOpenRechargeModal(),
    },
    {
      id: 'history',
      name: 'Historial Recargas',
      icon: History,
      onClick: () => onSelectTab('history'),
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="text-2xl">🐌</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-wide">SNAIL RACING</div>
            <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> SnailPay Platform
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Navegación
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Snail Info Badge */}
        <div className="mx-4 my-2 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Temporada de Carreras</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            6 caracoles compitiendo en 6 carreras diarias simuladas.
          </p>
        </div>
      </div>

      {/* Footer logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
