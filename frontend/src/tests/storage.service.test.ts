import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, hashPassword } from '../services/storage.service';
import { StoredUser, User } from '../types/auth';
import { TransactionRecord } from '../types/payment';

describe('Storage Service & Security Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe hashear contraseñas consistentemente sin almacenarlas en texto plano', async () => {
    const password = 'SecretPassword123!';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).toBeDefined();
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(password);
  });

  it('debe guardar y recuperar usuarios registrados en localStorage', () => {
    const mockUser: StoredUser = {
      id: 'usr_test123',
      fullName: 'Jefferson Torres',
      email: 'jefferson@example.com',
      passwordHash: 'hash_abc123',
      createdAt: new Date().toISOString(),
    };

    storageService.saveUser(mockUser);
    const users = storageService.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('jefferson@example.com');

    const found = storageService.findUserByEmail('JEFFERSON@example.com');
    expect(found).not.toBeNull();
    expect(found?.fullName).toBe('Jefferson Torres');
  });

  it('debe guardar, obtener y limpiar la sesión activa', () => {
    const activeUser: User = {
      id: 'usr_active',
      fullName: 'Piloto Activo',
      email: 'piloto@example.com',
      createdAt: new Date().toISOString(),
    };

    expect(storageService.getSession()).toBeNull();

    storageService.saveSession(activeUser);
    expect(storageService.getSession()?.id).toBe('usr_active');

    storageService.clearSession();
    expect(storageService.getSession()).toBeNull();
  });

  it('debe inicializar el saldo en 0 y persistir actualizaciones de saldo', () => {
    const userId = 'usr_balance_test';
    expect(storageService.getBalance(userId)).toBe(0);

    storageService.saveBalance(userId, 150.5);
    expect(storageService.getBalance(userId)).toBe(150.5);
  });

  it('debe persistir el historial de transacciones incluyendo tarjeta ficticia y CVV', () => {
    const userId = 'usr_tx_test';
    const tx: TransactionRecord = {
      id: 'txn_12345',
      amount: 100,
      dateCreated: new Date().toISOString(),
      status: 'approved',
      statusDetail: 'Accredited successfully',
      authorizationCode: 'AUTH_9999',
      reference: 'REF_9999',
      cardNumberMasked: '•••• •••• •••• 1234',
      rawCardNumber: '1234123412341234',
      rawCvv: '543',
      payerEmail: 'usuario@example.com',
    };

    storageService.saveTransaction(userId, tx);
    const history = storageService.getTransactions(userId);
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('txn_12345');
    expect(history[0].amount).toBe(100);
    expect(history[0].rawCardNumber).toBe('1234123412341234');
    expect(history[0].rawCvv).toBe('543');
  });
});
