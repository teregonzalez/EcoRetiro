import { fireEvent, render, screen } from '@testing-library/react';
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

test('navega, responde al scroll y permite cerrar sesión', () => {
  const setCurrentView = jest.fn();
  const onLogout = jest.fn();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 40 });

  render(
    <Header
      currentView="about"
      setCurrentView={setCurrentView}
      userId={5}
      onLogout={onLogout}
    />,
  );

  fireEvent.scroll(window);
  expect(screen.getByText('EcoRetiro').closest('header')).toHaveClass('shadow-md');

  fireEvent.click(screen.getByRole('button', { name: 'Inicio' }));
  fireEvent.click(screen.getByRole('button', { name: 'Contacto' }));
  fireEvent.click(screen.getByText('EcoRetiro'));
  fireEvent.click(screen.getByRole('button', { name: 'Salir' }));

  expect(setCurrentView).toHaveBeenNthCalledWith(1, 'menu');
  expect(setCurrentView).toHaveBeenNthCalledWith(2, 'contact');
  expect(setCurrentView).toHaveBeenNthCalledWith(3, 'menu');
  expect(onLogout).toHaveBeenCalledTimes(1);
});