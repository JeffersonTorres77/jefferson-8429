import { useState, useEffect, FormEvent, FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { snailPayService } from '../../services/snailPay.service';
import { SnailApiException } from '../../services/api';
import { TestScenarioPreset, TransactionRecord } from '../../types/payment';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CardPreview } from './CardPreview';
import { TestPresetsBar } from './TestPresetsBar';
import {
  CreditCard,
  Calendar,
  Lock,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SnailPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnailPayModal: FC<SnailPayModalProps> = ({ isOpen, onClose }) => {
  const { user, updateBalance, recordTransaction } = useAuth();

  // Campos del formulario
  const [cardNumber, setCardNumber] = useState('1234123412341234');
  const [expirationDate, setExpirationDate] = useState('12/26');
  const [cvv, setCvv] = useState('543');
  const [fullName, setFullName] = useState(user?.fullName || 'Jefferson Torres');
  const [amount, setAmount] = useState('100');

  // Estados de control y feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    amount: number;
    authCode: string | null;
    reference: string;
  } | null>(null);
  const [activePresetName, setActivePresetName] = useState<string>('Cobro Exitoso');

  useEffect(() => {
    if (user?.fullName && (!fullName || fullName === 'Jefferson Torres')) {
      setFullName(user.fullName);
    }
  }, [user, fullName]);

  // Manejo de cambio de preset rápido
  const handleSelectPreset = (preset: TestScenarioPreset) => {
    setCardNumber(preset.cardNumber);
    setExpirationDate(preset.expirationDate);
    setCvv(preset.cvv);
    setAmount(preset.amount.toString());
    setActivePresetName(preset.name);
    setErrorMsg(null);
    setSuccessData(null);
  };

  // Formateador de tarjeta
  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(raw);
    setActivePresetName('');
  };

  // Formateador de fecha MM/YY
  const handleExpDateChange = (value: string) => {
    let clean = value.replace(/[^\d]/g, '').slice(0, 4);
    if (clean.length > 2) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    setExpirationDate(clean);
    setActivePresetName('');
  };

  // Formateador de CVV
  const handleCvvChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    setCvv(clean);
    setActivePresetName('');
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessData(null);

    if (!user) {
      setErrorMsg('Debe iniciar sesión para realizar una recarga.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('El monto debe ser una cantidad numérica mayor a 0.');
      return;
    }

    if (!cardNumber || cardNumber.length !== 16) {
      setErrorMsg('El número de tarjeta debe contener exactamente 16 dígitos.');
      return;
    }

    if (!expirationDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      setErrorMsg('La fecha de vencimiento debe tener formato MM/YY (ej: 12/26).');
      return;
    }

    if (!cvv || cvv.length < 3) {
      setErrorMsg('El código CVV debe contener 3 o 4 dígitos.');
      return;
    }

    setIsLoading(true);

    try {
      const isSystemErrorScenario = activePresetName === 'Error de Sistema';
      const response = await snailPayService.processCharge(
        {
          card_number: cardNumber,
          expiration_date: expirationDate,
          cvv,
          full_name: fullName.trim(),
          amount: numAmount,
          payer_id: user.id,
          payer_email: user.email,
        },
        isSystemErrorScenario
      );

      // Si la respuesta fue exitosa:
      if (response.status === 'approved') {
        // 1. Actualizar saldo inmediatamente
        updateBalance(response.transaction_amount);

        // 2. Registrar transacción en historial (incluyendo tarjeta ficticia y CVV según requerimiento de PDF)
        const record: TransactionRecord = {
          id: response.id,
          amount: response.transaction_amount,
          dateCreated: response.date_created,
          status: 'approved',
          statusDetail: response.status_detail,
          authorizationCode: response.authorization_code,
          reference: response.reference,
          cardNumberMasked: `•••• •••• •••• ${cardNumber.slice(-4)}`,
          rawCardNumber: response.card_number,
          rawCvv: response.cvv,
          payerEmail: response.payer_email,
        };

        recordTransaction(record);

        // 3. Mostrar feedback visual de éxito
        setSuccessData({
          id: response.id,
          amount: response.transaction_amount,
          authCode: response.authorization_code,
          reference: response.reference,
        });
      }
    } catch (err: unknown) {
      if (err instanceof SnailApiException) {
        const readableMsg = snailPayService.formatErrorMessage(err.message);
        setErrorMsg(readableMsg);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error desconocido al procesar la recarga.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recarga de Saldo con SnailPay"
      subtitle="Pasarela simulada de pagos para carreras de caracoles"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Atajos de prueba para el evaluador */}
        <TestPresetsBar
          onSelectPreset={handleSelectPreset}
          activeScenarioName={activePresetName}
        />

        {/* Visual Card Preview */}
        <CardPreview
          cardNumber={cardNumber}
          cardHolder={fullName}
          expirationDate={expirationDate}
          cvv={cvv}
        />

        {/* Banner de Éxito */}
        {successData && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>¡Recarga aprobada exitosamente!</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Se han acreditado <strong className="text-emerald-700 font-extrabold">${successData.amount.toFixed(2)}</strong> a tu saldo. Tu saldo se actualizó inmediatamente y quedó guardado en localStorage.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-[11px] font-mono text-slate-600">
              <div>ID Op: <span className="text-slate-900 font-semibold">{successData.id}</span></div>
              <div>Auth: <span className="text-emerald-700 font-bold">{successData.authCode}</span></div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetForm}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="w-full text-xs font-semibold"
              >
                Realizar otra transacción
              </Button>
            </div>
          </div>
        )}

        {/* Banner de Error */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Error en la Transacción</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              {errorMsg}
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              * Nota: Como la transacción no fue aprobada, tu saldo no se modificó.
            </p>
          </div>
        )}

        {/* Formulario de Carga */}
        {!successData && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Número de Tarjeta (16 Dígitos)"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  maxLength={16}
                  required
                />
              </div>

              <div>
                <Input
                  label="Vencimiento (MM/YY)"
                  placeholder="12/26"
                  value={expirationDate}
                  onChange={(e) => handleExpDateChange(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  maxLength={5}
                  required
                />
              </div>

              <div>
                <Input
                  label="Código CVV"
                  placeholder="543"
                  value={cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  maxLength={4}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Titular de la Tarjeta"
                  placeholder="Jefferson Torres"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Monto a Recargar ($ USD)"
                  type="number"
                  step="any"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  min="0.01"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Pagar ${parseFloat(amount || '0').toFixed(2)} con SnailPay
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
