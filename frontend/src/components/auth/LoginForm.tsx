import { useState, FormEvent, FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (!res.success) {
        setErrorMsg(res.message || 'Error al iniciar sesión.');
      }
    } catch {
      setErrorMsg('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="usuario@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-4 h-4" />}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="w-full mt-2"
      >
        Iniciar Sesión
      </Button>

      <div className="pt-4 text-center border-t border-slate-800">
        <p className="text-xs text-slate-400">
          ¿No tienes una cuenta registrada?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline cursor-pointer"
          >
            Registrarse aquí
          </button>
        </p>
      </div>
    </form>
  );
};
