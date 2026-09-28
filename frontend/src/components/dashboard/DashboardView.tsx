import { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from './StatCard';
import { BetDonutChart } from './BetDonutChart';
import { SnailBarChart } from './SnailBarChart';
import { TransactionHistory } from './TransactionHistory';
import { Button } from '../common/Button';
import {
  Wallet,
  Trophy,
  PlusCircle,
  Flag,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  onOpenRechargeModal: () => void;
}

export const DashboardView: FC<DashboardViewProps> = ({ onOpenRechargeModal }) => {
  const { user, balance, transactions } = useAuth();

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida y Acción Rápida */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Temporada Oficial de Carreras</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido de vuelta, {user?.fullName || 'Piloto'}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Consulta las estadísticas de la jornada, analiza el rendimiento de los 6 caracoles competidores y recarga saldo en cualquier momento a través de la pasarela simulada SnailPay.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenRechargeModal}
              leftIcon={<PlusCircle className="w-5 h-5" />}
              className="shadow-xl shadow-emerald-950/50"
            >
              Cargar Saldo con SnailPay
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo Disponible"
          value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Guardado en localStorage"
          icon={<Wallet className="w-5 h-5" />}
          trend={{
            label: balance > 0 ? 'Saldo activo para apuestas' : 'Saldo inicial: $0.00',
            isPositive: balance > 0,
          }}
        />

        <StatCard
          title="Apuestas Ganadas"
          value="14"
          subtitle="Simulado: 70% de efectividad"
          icon={<Trophy className="w-5 h-5 text-amber-400" />}
          trend={{
            label: '+14 aciertos en la temporada',
            isPositive: true,
          }}
        />

        <StatCard
          title="Carreras del Día"
          value="6 / 6"
          subtitle="6 caracoles participantes"
          icon={<Flag className="w-5 h-5 text-sky-400" />}
          trend={{
            label: '100% de la jornada disputada',
            isPositive: true,
          }}
        />

        <StatCard
          title="Recargas Realizadas"
          value={transactions.length}
          subtitle="Pasarela SnailPay"
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          trend={{
            label: 'Historial activo y persistente',
            isPositive: true,
          }}
        />
      </div>

      {/* Grid de Gráficas Requeridas (Donut de Apuestas y Barras de Caracoles) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <BetDonutChart won={14} lost={6} />
        </div>
        <div className="lg:col-span-7">
          <SnailBarChart />
        </div>
      </div>

      {/* Historial de Transacciones */}
      <TransactionHistory
        transactions={transactions}
        onOpenRechargeModal={onOpenRechargeModal}
      />
    </div>
  );
};
