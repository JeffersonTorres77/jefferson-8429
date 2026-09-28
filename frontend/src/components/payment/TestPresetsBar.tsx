import { FC } from 'react';
import { TEST_SCENARIOS } from '../../services/snailPay.service';
import { TestScenarioPreset } from '../../types/payment';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ServerCrash } from 'lucide-react';

interface TestPresetsBarProps {
  onSelectPreset: (preset: TestScenarioPreset) => void;
  activeScenarioName?: string;
}

export const TestPresetsBar: FC<TestPresetsBarProps> = ({
  onSelectPreset,
  activeScenarioName,
}) => {
  const getIcon = (scenarioName: string) => {
    switch (scenarioName) {
      case 'Cobro Exitoso':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Tarjeta Vencida':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'CVV Incorrecto':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Tarjeta No Autorizada':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'Error de Sistema':
        return <ServerCrash className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Atajos de Prueba Rápida (Evaluación)
        </span>
        <span className="text-[10px] text-slate-500">Auto-completar formulario</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TEST_SCENARIOS.map((preset) => {
          const isSelected = activeScenarioName === preset.name;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs mb-0.5">
                {getIcon(preset.name)}
                <span className="truncate">{preset.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
