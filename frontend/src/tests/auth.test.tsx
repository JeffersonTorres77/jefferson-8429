import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { storageService } from '../services/storage.service';

const TestAuthConsumer = () => {
  const { user, balance, isAuthenticated, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
      <div data-testid="user-name">{user?.fullName}</div>
      <div data-testid="user-balance">{balance}</div>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
};

describe('Authentication & Session Flows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe registrar un usuario nuevo con saldo inicial $0.00 y establecer la sesión', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterForm onSwitchToLogin={() => {}} />
          <TestAuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Nuevo Piloto' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'piloto@carreras.com' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Nuevo Piloto');
      expect(screen.getByTestId('user-balance')).toHaveTextContent('0');
    });

    // Validar que se guardó en localStorage
    const savedUser = storageService.findUserByEmail('piloto@carreras.com');
    expect(savedUser).not.toBeNull();
    expect(savedUser?.fullName).toBe('Nuevo Piloto');
  });

  it('debe mostrar error si las contraseñas no coinciden en el registro', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterForm onSwitchToLogin={() => {}} />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('debe permitir iniciar sesión con credenciales correctas y luego cerrar sesión', async () => {
    // 1. Registramos primero un usuario
    const { unmount } = render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterForm onSwitchToLogin={() => {}} />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Usuario Login' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'login@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña/i), {
      target: { value: 'pass1234' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'pass1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(storageService.findUserByEmail('login@test.com')).not.toBeNull();
    });

    unmount();
    storageService.clearSession();

    // 2. Renderizamos el LoginForm
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm onSwitchToRegister={() => {}} />
          <TestAuthConsumer />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'login@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'pass1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Usuario Login');
    });

    // 3. Cerrar sesión
    fireEvent.click(screen.getByTestId('logout-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    });
  });
});
