import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock matchMedia para pruebas en jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock react-chartjs-2 para renderizado sin errores de canvas en jsdom
vi.mock('react-chartjs-2', () => ({
  Doughnut: () => React.createElement('div', { 'data-testid': 'mock-doughnut-chart' }, 'Mock Doughnut'),
  Bar: () => React.createElement('div', { 'data-testid': 'mock-bar-chart' }, 'Mock Bar'),
}));
