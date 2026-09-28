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
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Tarjeta Vencida':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'CVV Incorrecto':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'Tarjeta No Autorizada':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      case 'Error de Sistema':
        return <ServerCrash className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary-600" />;
    }
  };

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          Atajos de Prueba Rápida (Evaluación)
        </span>
        <span className="text-[10px] text-slate-500 font-medium">Auto-completar formulario</span>
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
                  ? 'bg-primary-50 border-primary-300 text-primary-900 ring-2 ring-primary-500/20 shadow-xs'
                  : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                {getIcon(preset.name)}
                <span className="truncate">{preset.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate font-medium">
                {preset.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
