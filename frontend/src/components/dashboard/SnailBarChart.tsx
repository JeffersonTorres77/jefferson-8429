import { FC } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../common/Card';
import { SnailParticipant } from '../../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DEFAULT_SNAILS: SnailParticipant[] = [
  { id: '1', name: 'Turbo', victories: 2, color: '#4f46e5', avatar: '⚡' },
  { id: '2', name: 'Speedy', victories: 1, color: '#0284c7', avatar: '🚀' },
  { id: '3', name: 'Gary', victories: 1, color: '#7c3aed', avatar: '🐚' },
  { id: '4', name: 'Flash', victories: 1, color: '#d97706', avatar: '✨' },
  { id: '5', name: 'Sheldon', victories: 1, color: '#059669', avatar: '👑' },
  { id: '6', name: 'Zoomer', victories: 0, color: '#94a3b8', avatar: '🌀' },
];

interface SnailBarChartProps {
  snails?: SnailParticipant[];
}

export const SnailBarChart: FC<SnailBarChartProps> = ({
  snails = DEFAULT_SNAILS,
}) => {
  const data = {
    labels: snails.map((s) => `${s.avatar} ${s.name}`),
    datasets: [
      {
        label: 'Victorias en el Día (Total: 6 carreras)',
        data: snails.map((s) => s.victories),
        backgroundColor: snails.map((s) => s.color),
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: { family: 'Plus Jakarta Sans, Inter', size: 11, weight: 600 },
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.8)',
        },
        border: {
          dash: [4, 4],
        },
      },
      x: {
        ticks: {
          color: '#334155',
          font: { family: 'Plus Jakarta Sans, Inter', size: 11, weight: 700 },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `Victorias: ${context.parsed.y} carrera(s)`,
        },
      },
    },
  };

  return (
    <Card
      title="Victorias del Día (6 Carreras Simuladas)"
      subtitle="Distribución oficial de victorias entre los 6 caracoles competidores"
      className="flex flex-col h-full"
    >
      <div className="flex-1 min-h-[240px]">
        <Bar data={data} options={options} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          6 de 6 carreras finalizadas hoy
        </span>
        <span className="font-bold text-slate-700">
          Líder de la jornada: Turbo (2 victorias)
        </span>
      </div>
    </Card>
  );
};
