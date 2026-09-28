import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { DashboardView } from '../components/dashboard/DashboardView';
import { BetDonutChart } from '../components/dashboard/BetDonutChart';
import { SnailBarChart } from '../components/dashboard/SnailBarChart';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import { storageService } from '../services/storage.service';
import { StoredUser } from '../types/auth';

describe('Dashboard & Chart Components', () => {
  const mockUser: StoredUser = {
    id: 'usr_dashboard_tester',
    fullName: 'Piloto Dashboard',
    email: 'dashboard@snailpay.com',
    passwordHash: 'hash_test',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    localStorage.clear();
    storageService.saveUser(mockUser);
    storageService.saveSession(mockUser);
    storageService.saveBalance(mockUser.id, 250);
  });

  it('debe renderizar el Dashboard con el nombre del usuario y saldo actual', () => {
    render(
      <AuthProvider>
        <DashboardView onOpenRechargeModal={() => {}} />
      </AuthProvider>
    );

    expect(screen.getByText(/bienvenido de vuelta, piloto dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/\$250\.00/i)).toBeInTheDocument();
    expect(screen.getAllByText(/apuestas ganadas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/carreras del día/i)).toBeInTheDocument();
  });

  it('debe renderizar la gráfica donut de apuestas ganadas y perdidas', () => {
    render(<BetDonutChart won={14} lost={6} />);
    expect(screen.getByText(/rendimiento de apuestas/i)).toBeInTheDocument();
    expect(screen.getByText(/70%/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ganadas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/perdidas/i).length).toBeGreaterThanOrEqual(1);
  });

  it('debe renderizar la gráfica de barras con las 6 victorias de los 6 caracoles', () => {
    render(<SnailBarChart />);
    expect(screen.getByText(/victorias del día \(6 carreras simuladas\)/i)).toBeInTheDocument();
    expect(screen.getByText(/6 de 6 carreras finalizadas hoy/i)).toBeInTheDocument();
  });

  it('debe mostrar mensaje amigable cuando no hay transacciones en el historial', () => {
    render(
      <TransactionHistory
        transactions={[]}
        onOpenRechargeModal={() => {}}
      />
    );

    expect(screen.getByText(/no hay transacciones registradas/i)).toBeInTheDocument();
    expect(screen.getByText(/realizar mi primera recarga/i)).toBeInTheDocument();
  });
});
