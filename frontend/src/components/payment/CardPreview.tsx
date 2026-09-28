import { FC } from 'react';
import { CreditCard, Sparkles } from 'lucide-react';

interface CardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  isFlipped?: boolean;
}

export const CardPreview: FC<CardPreviewProps> = ({
  cardNumber,
  cardHolder,
  expirationDate,
  cvv,
}) => {
  // Formatea el número de tarjeta en bloques de 4 dígitos
  const formattedNumber = cardNumber
    ? cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••';

  return (
    <div className="relative w-full h-44 rounded-2xl p-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 shadow-2xl overflow-hidden text-white flex flex-col justify-between">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Card Header: Chip & SnailPay Logo */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {/* Virtual EMV Chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-500/40 flex items-center justify-center shadow-inner">
            <div className="w-6 h-4 border-t border-b border-amber-600/30 rounded-sm" />
          </div>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-emerald-400">
          <span>🐌</span> SNAILPAY
        </div>
      </div>

      {/* Card Number */}
      <div className="relative z-10 my-auto">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Número de Tarjeta</p>
        <p className="font-mono text-base sm:text-lg tracking-widest font-semibold text-slate-100 drop-shadow">
          {formattedNumber || '•••• •••• •••• ••••'}
        </p>
      </div>

      {/* Card Footer: Holder, Expiration & CVV */}
      <div className="flex items-end justify-between relative z-10 text-xs">
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Titular</p>
          <p className="font-semibold text-slate-200 uppercase tracking-wide truncate max-w-[140px]">
            {cardHolder || 'NOMBRE DEL TITULAR'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Vence</p>
            <p className="font-mono font-semibold text-slate-200">
              {expirationDate || 'MM/YY'}
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">CVV</p>
            <p className="font-mono font-semibold text-slate-200">
              {cvv ? '•••' : '•••'}
            </p>
          </div>

          <div className="pl-1">
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
