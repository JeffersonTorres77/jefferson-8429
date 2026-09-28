import { FC } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TransactionRecord } from '../../types/payment';
import { History, ShieldCheck, ArrowDownLeft, Clock } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  onOpenRechargeModal: () => void;
}

export const TransactionHistory: FC<TransactionHistoryProps> = ({
  transactions,
  onOpenRechargeModal,
}) => {
  return (
    <Card
      title="Historial de Transacciones SnailPay"
      subtitle="Registro de recargas aprobadas y guardadas en localStorage"
      className="w-full"
      action={
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          {transactions.length} operaciones registradas
        </span>
      }
    >
      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">No hay transacciones registradas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Tu saldo inicial es $0.00. Realiza una recarga con la pasarela simulada SnailPay para comenzar a apostar.
          </p>
          <button
            onClick={onOpenRechargeModal}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
          >
            Realizar mi primera recarga →
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">ID Transacción</th>
                <th className="pb-3 px-4">Fecha</th>
                <th className="pb-3 px-4">Tarjeta Ficticia / CVV</th>
                <th className="pb-3 px-4">Código Auth</th>
                <th className="pb-3 px-4">Estado</th>
                <th className="pb-3 pl-4 text-right">Monto Acreditado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-4 font-mono text-slate-200 font-medium">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(tx.dateCreated).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <span className="text-emerald-400/90">{tx.cardNumberMasked}</span>
                    <span className="text-slate-500 text-[10px] ml-2">(CVV: {tx.rawCvv})</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {tx.authorizationCode || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Aprobada
                    </Badge>
                  </td>
                  <td className="py-3.5 pl-4 text-right font-bold text-emerald-400 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                      +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
