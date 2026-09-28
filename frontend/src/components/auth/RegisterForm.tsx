import { useState, FormEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Error al registrar el usuario.');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setErrorMsg('Ocurrió un error inesperado al procesar el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Input
        label="Nombre Completo"
        type="text"
        placeholder="Juan Pérez"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        leftIcon={<User className="w-4 h-4" />}
        required
      />

      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="juan@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-4 h-4" />}
        required
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        placeholder="Repita su contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<CheckCircle2 className="w-4 h-4" />}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        Crear Cuenta y Comenzar ($0.00)
      </Button>

      <div className="pt-3.5 text-center border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          ¿Ya tienes una cuenta registrada?{' '}
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
            >
              Iniciar sesión
            </button>
          ) : (
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
            >
              Iniciar sesión
            </Link>
          )}
        </p>
      </div>
    </form>
  );
};
