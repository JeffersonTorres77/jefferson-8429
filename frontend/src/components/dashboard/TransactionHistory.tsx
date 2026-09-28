import { FC } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TransactionRecord } from '../../types/payment';
import { useModal } from '../../context/ModalContext';
import { History, ShieldCheck, ArrowDownLeft, Clock } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  onOpenRechargeModal?: () => void;
}

export const TransactionHistory: FC<TransactionHistoryProps> = ({
  transactions,
  onOpenRechargeModal,
}) => {
  const { openRechargeModal } = useModal();
  const handleOpen = onOpenRechargeModal || openRechargeModal;

  return (
    <Card
      title="Historial de Transacciones SnailPay"
      subtitle="Registro de recargas aprobadas y guardadas en localStorage"
      className="w-full bg-white"
      action={
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          {transactions.length} operaciones registradas
        </span>
      }
    >
      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No hay transacciones registradas</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 font-medium">
            Tu saldo inicial es $0.00. Realiza una recarga con la pasarela simulada SnailPay para comenzar a apostar.
          </p>
          <button
            onClick={handleOpen}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
          >
            Realizar mi primera recarga →
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 pr-4 pl-2">ID Transacción</th>
                <th className="py-2.5 px-4">Fecha</th>
                <th className="py-2.5 px-4">Tarjeta Ficticia / CVV</th>
                <th className="py-2.5 px-4">Código Auth</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 pl-4 pr-2 text-right">Monto Acreditado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pr-4 pl-2 font-mono text-slate-900 font-semibold">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {new Date(tx.dateCreated).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <span className="text-indigo-700 font-semibold">{tx.cardNumberMasked}</span>
                    <span className="text-slate-400 text-[10px] ml-2 font-normal">(CVV: {tx.rawCvv})</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                    {tx.authorizationCode || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Aprobada
                    </Badge>
                  </td>
                  <td className="py-3.5 pl-4 pr-2 text-right font-bold text-emerald-700 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
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
