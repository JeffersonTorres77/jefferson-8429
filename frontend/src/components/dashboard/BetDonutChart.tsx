import { FC } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '../common/Card';
import { Trophy, TrendingUp } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BetDonutChartProps {
  won?: number;
  lost?: number;
}

export const BetDonutChart: FC<BetDonutChartProps> = ({
  won = 14,
  lost = 6,
}) => {
  const total = won + lost;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const data = {
    labels: ['Apuestas Ganadas', 'Apuestas Perdidas'],
    datasets: [
      {
        label: 'Cantidad de Apuestas',
        data: [won, lost],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // emerald-500
          'rgba(244, 63, 94, 0.85)',  // rose-500
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(244, 63, 94, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 12,
            weight: 500,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
  };

  return (
    <Card
      title="Rendimiento de Apuestas"
      subtitle="Distribución simulada de apuestas ganadas vs. perdidas"
      className="flex flex-col h-full"
    >
      <div className="relative flex-1 min-h-[240px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-extrabold text-white tracking-tight">{winRate}%</span>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Efectividad</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ganadas</span>
          </div>
          <div className="text-lg font-bold text-white">{won}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-semibold mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 rotate-180" />
            <span>Perdidas</span>
          </div>
          <div className="text-lg font-bold text-white">{lost}</div>
        </div>
      </div>
    </Card>
  );
};
