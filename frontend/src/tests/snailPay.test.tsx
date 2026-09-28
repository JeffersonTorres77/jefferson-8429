import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SnailPayModal } from '../components/payment/SnailPayModal';
import { storageService } from '../services/storage.service';
import { StoredUser } from '../types/auth';

const TestAuthHeader = () => {
  const { balance } = useAuth();
  return <div data-testid="live-balance">{balance}</div>;
};

describe('SnailPay Gateway Modal & Balance Updates', () => {
  const mockUser: StoredUser = {
    id: 'usr_snail_tester',
    fullName: 'Tester Snail',
    email: 'tester@snailpay.com',
    passwordHash: 'hash_test',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    localStorage.clear();
    storageService.saveUser(mockUser);
    storageService.saveSession(mockUser);
    storageService.saveBalance(mockUser.id, 0);
    vi.restoreAllMocks();
  });

  it('debe procesar un cobro exitoso, actualizar el saldo y guardarlo en localStorage', async () => {
    const mockSuccessResponse = {
      id: 'txn_mock_123',
      status: 'approved',
      status_detail: 'Accredited: Transaction approved successfully',
      transaction_amount: 150,
      date_created: new Date().toISOString(),
      authorization_code: 'AUTH_888999',
      reference: 'REF_MOCK_123',
      payer_id: mockUser.id,
      payer_email: mockUser.email,
      card_number: '1234123412341234',
      cvv: '543',
    };

    // Mock del fetch global
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: (h: string) => (h === 'content-type' ? 'application/json' : null),
      },
      json: async () => mockSuccessResponse,
    });

    render(
      <AuthProvider>
        <TestAuthHeader />
        <SnailPayModal isOpen={true} onClose={() => {}} />
      </AuthProvider>
    );

    // Cambiamos el monto a 150
    fireEvent.change(screen.getByLabelText(/monto a recargar/i), {
      target: { value: '150' },
    });

    // Clic en Pagar
    fireEvent.click(screen.getByRole('button', { name: /pagar.*con snailpay/i }));

    await waitFor(() => {
      expect(screen.getByText(/¡recarga aprobada exitosamente!/i)).toBeInTheDocument();
      expect(screen.getByTestId('live-balance')).toHaveTextContent('150');
    });

    // Validar persistencia en localStorage
    expect(storageService.getBalance(mockUser.id)).toBe(150);
    const transactions = storageService.getTransactions(mockUser.id);
    expect(transactions).toHaveLength(1);
    expect(transactions[0].id).toBe('txn_mock_123');
    expect(transactions[0].rawCardNumber).toBe('1234123412341234');
    expect(transactions[0].rawCvv).toBe('543');
  });

  it('no debe modificar el saldo si la tarjeta es rechazada (Error 422)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: {
        get: (h: string) => (h === 'content-type' ? 'application/json' : null),
      },
      json: async () => ({
        error: true,
        msg: 'cc_rejected_card_disabled: Número de tarjeta rechazado por la entidad emisora',
      }),
    });

    render(
      <AuthProvider>
        <TestAuthHeader />
        <SnailPayModal isOpen={true} onClose={() => {}} />
      </AuthProvider>
    );

    // Seleccionamos el preset "Tarjeta No Autorizada"
    fireEvent.click(screen.getByRole('button', { name: /tarjeta no autorizada/i }));

    // Clic en Pagar
    fireEvent.click(screen.getByRole('button', { name: /pagar.*con snailpay/i }));

    await waitFor(() => {
      expect(screen.getByText(/error en la transacción/i)).toBeInTheDocument();
      expect(screen.getByText(/tarjeta ha sido rechazada por el banco emisor/i)).toBeInTheDocument();
      // El saldo debe seguir intacto en 0
      expect(screen.getByTestId('live-balance')).toHaveTextContent('0');
    });

    expect(storageService.getBalance(mockUser.id)).toBe(0);
  });
});
