import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { AuthState, LoginPayload, RegisterPayload, StoredUser, User } from '../types/auth';
import { TransactionRecord } from '../types/payment';
import { hashPassword, storageService } from '../services/storage.service';

interface AuthContextType extends AuthState {
  transactions: TransactionRecord[];
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateBalance: (addedAmount: number) => void;
  recordTransaction: (transaction: TransactionRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carga inicial y recuperación de sesión desde localStorage
  useEffect(() => {
    try {
      const activeUser = storageService.getSession();
      if (activeUser) {
        setUser(activeUser);
        const currentBalance = storageService.getBalance(activeUser.id);
        const userTransactions = storageService.getTransactions(activeUser.id);
        setBalance(currentBalance);
        setTransactions(userTransactions);
      }
    } catch (err) {
      console.error('Error restaurando sesión', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Registro de un nuevo usuario con validaciones y contraseña hasheada
   */
  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message?: string }> => {
    const { fullName, email, password, confirmPassword } = payload;

    if (!fullName || fullName.trim().length < 2) {
      return { success: false, message: 'El nombre completo debe tener al menos 2 caracteres.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return { success: false, message: 'Ingrese un correo electrónico válido.' };
    }

    if (!password || password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Las contraseñas no coinciden.' };
    }

    const existing = storageService.findUserByEmail(email);
    if (existing) {
      return { success: false, message: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    try {
      const passwordHash = await hashPassword(password);
      const newUser: StoredUser = {
        id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      // Guardar usuario y fijar saldo inicial en $0.00
      storageService.saveUser(newUser);
      storageService.saveBalance(newUser.id, 0);

      const publicUser: User = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      storageService.saveSession(publicUser);
      setUser(publicUser);
      setBalance(0);
      setTransactions([]);

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Ocurrió un error inesperado al procesar el registro.' };
    }
  };

  /**
   * Inicio de sesión comparando hash seguro
   */
  const login = async (payload: LoginPayload): Promise<{ success: boolean; message?: string }> => {
    const { email, password } = payload;

    if (!email || !password) {
      return { success: false, message: 'Por favor complete todos los campos.' };
    }

    const existingUser = storageService.findUserByEmail(email);
    if (!existingUser) {
      return { success: false, message: 'Credenciales inválidas. Usuario no registrado.' };
    }

    const inputHash = await hashPassword(password);
    if (existingUser.passwordHash !== inputHash) {
      return { success: false, message: 'Credenciales inválidas. Contraseña incorrecta.' };
    }

    const publicUser: User = {
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    };

    storageService.saveSession(publicUser);
    const userBalance = storageService.getBalance(publicUser.id);
    const userTransactions = storageService.getTransactions(publicUser.id);

    setUser(publicUser);
    setBalance(userBalance);
    setTransactions(userTransactions);

    return { success: true };
  };

  /**
   * Cierre de sesión y limpieza de estado
   */
  const logout = (): void => {
    storageService.clearSession();
    setUser(null);
    setBalance(0);
    setTransactions([]);
  };

  /**
   * Actualiza el saldo en memoria y en localStorage
   */
  const updateBalance = (addedAmount: number): void => {
    if (!user) return;
    const newBalance = Number((balance + addedAmount).toFixed(2));
    setBalance(newBalance);
    storageService.saveBalance(user.id, newBalance);
  };

  /**
   * Registra una transacción y la persiste en localStorage
   */
  const recordTransaction = (transaction: TransactionRecord): void => {
    if (!user) return;
    setTransactions(prev => [transaction, ...prev]);
    storageService.saveTransaction(user.id, transaction);
  };

  const value = useMemo(() => ({
    user,
    balance,
    transactions,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
    updateBalance,
    recordTransaction,
  }), [user, balance, transactions, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};
