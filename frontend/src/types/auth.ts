/**
 * Tipos e interfaces relacionados con la autenticación de usuarios.
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  balance: number;
  isAuthenticated: boolean;
  isLoading: boolean;
}
