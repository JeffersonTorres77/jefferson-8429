import { ReactNode, FC } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-xl shadow-emerald-950/40">
            <span className="text-3xl">🐌</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Snail Racing & SnailPay
          </h1>
          <p className="text-xs font-medium text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Plataforma de Apuestas y Pagos
          </p>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          </div>

          {children}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Autenticación local segura con SHA-256</span>
        </div>
      </div>
    </div>
  );
};
