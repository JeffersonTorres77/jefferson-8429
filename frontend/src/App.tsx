import React from 'react';

export const App: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
          <span className="text-3xl">🐌</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Snail Racing & SnailPay
        </h1>
        <p className="text-slate-400 text-sm">
          Entorno base configurado correctamente.
        </p>
      </div>
    </main>
  );
};

export default App;
