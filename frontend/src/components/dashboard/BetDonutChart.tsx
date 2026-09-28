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
          '#4f46e5', // Primary indigo
          '#f43f5e', // Rose accent
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#475569',
          font: {
            family: 'Plus Jakarta Sans, Inter',
            size: 12,
            weight: 600,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
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
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{winRate}%</span>
          <span className="text-[11px] font-bold text-primary-700 uppercase tracking-wider">Efectividad</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
        <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-primary-700 font-bold mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ganadas</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900">{won}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-700 font-bold mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 rotate-180" />
            <span>Perdidas</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900">{lost}</div>
        </div>
      </div>
    </Card>
  );
};
