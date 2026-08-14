import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

test('renders Header component', () => {
  render(
    <Header
      currentView="login"
      setCurrentView={jest.fn()}
      userId={null}
      onLogout={jest.fn()}
    />,
  );

  expect(screen.getByText('EcoRetiro')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sobre nosotros' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Contacto' })).toBeInTheDocument();
});