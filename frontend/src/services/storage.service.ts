import { StoredUser, User } from '../types/auth';
import { TransactionRecord } from '../types/payment';

const STORAGE_KEYS = {
  USERS: 'snail_app_users',
  SESSION: 'snail_app_session',
  BALANCES: 'snail_app_balances',
  TRANSACTIONS: 'snail_app_transactions',
};

/**
 * Hashea una contraseña usando SHA-256 a través de la Web Crypto API.
 * Garantiza un almacenamiento responsable y no en texto plano en localStorage.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Fallback simple para entornos sin crypto.subtle
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
}

export const storageService = {
  /**
   * Obtiene todos los usuarios registrados
   */
  getUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Busca un usuario por correo electrónico
   */
  findUserByEmail(email: string): StoredUser | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  /**
   * Registra un nuevo usuario en localStorage
   */
  saveUser(user: StoredUser): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  /**
   * Obtiene la sesión del usuario actualmente activo
   */
  getSession(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Guarda la sesión del usuario activo
   */
  saveSession(user: User): void {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  /**
   * Elimina la sesión activa (logout)
   */
  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Obtiene el saldo del usuario (inicia en $0 por defecto)
   */
  getBalance(userId: string): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BALANCES);
      const balances: Record<string, number> = data ? JSON.parse(data) : {};
      return typeof balances[userId] === 'number' ? balances[userId] : 0;
    } catch {
      return 0;
    }
  },

  /**
   * Guarda y actualiza el saldo del usuario en localStorage
   */
  saveBalance(userId: string, balance: number): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BALANCES);
      const balances: Record<string, number> = data ? JSON.parse(data) : {};
      balances[userId] = Math.max(0, balance);
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(balances));
    } catch (err) {
      console.error('Error guardando saldo en localStorage', err);
    }
  },

  /**
   * Obtiene el historial de transacciones de recarga del usuario
   */
  getTransactions(userId: string): TransactionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const transactions: Record<string, TransactionRecord[]> = data ? JSON.parse(data) : {};
      return transactions[userId] || [];
    } catch {
      return [];
    }
  },

  /**
   * Guarda una nueva transacción en el historial del usuario
   */
  saveTransaction(userId: string, transaction: TransactionRecord): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const transactions: Record<string, TransactionRecord[]> = data ? JSON.parse(data) : {};
      if (!transactions[userId]) {
        transactions[userId] = [];
      }
      transactions[userId].unshift(transaction);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error('Error guardando transacción en localStorage', err);
    }
  }
};
