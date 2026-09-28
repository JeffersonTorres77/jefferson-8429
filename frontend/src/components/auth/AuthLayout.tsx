import { ReactNode, FC } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden text-slate-900">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white mb-4 shadow-lg shadow-primary-500/25">
            <span className="text-3xl">🐌</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            Snail Racing & SnailPay
          </h1>
          <p className="text-xs font-bold text-primary-700 mt-1 flex items-center justify-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-secondary-500" /> Plataforma de Apuestas y Pagos
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xl shadow-slate-200/50">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          </div>

          {children}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-primary-600" />
          <span>Autenticación local segura con SHA-256</span>
        </div>
      </div>
    </div>
  );
};
