import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.defineProperty(globalThis, 'TextEncoder', {
  value: TextEncoder,
  writable: true,
});
Object.defineProperty(globalThis, 'TextDecoder', {
  value: TextDecoder,
  writable: true,
});

import App from './App';

// Mocks de los componentes dependientes para aislar las pruebas de enrutamiento y sesión
jest.mock('./components/Header', () => ({ currentView, setCurrentView }: { currentView: string; setCurrentView: (view: string) => void }) => (
  <div data-testid="mock-header">
    Header View: {currentView}
    <button onClick={() => setCurrentView('about')}>Go to About</button>
  </div>
));

jest.mock('./components/Footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('./components/LandingPage', () => ({ onLoginSuccess }: { onLoginSuccess: (id: number, username: string, role: string) => void }) => (
  <div data-testid="mock-landing">
    Landing Page
    <button onClick={() => onLoginSuccess(1, 'Test Admin', 'Administrador')}>
      Login as Admin
    </button>
    <button onClick={() => onLoginSuccess(2, 'Test Pyme', 'PYME')}>
      Login as Pyme
    </button>
  </div>
));

jest.mock('./components/About', () => () => <div data-testid="mock-about">About Page</div>);
jest.mock('./components/Contact', () => () => <div data-testid="mock-contact">Contact Page</div>);
jest.mock('./components/dashboards/AdminDashboard/AdminDashboard', () => ({ username, onLogout }: { username: string; onLogout: () => void }) => (
  <div data-testid="mock-admin-dashboard">
    Admin Dashboard - {username}
    <button onClick={onLogout}>Logout</button>
  </div>
));
jest.mock('./components/dashboards/PymeDashboard/PymeDashboard', () => ({ username, onCreateWaste }: { username: string; onCreateWaste: () => void }) => (
  <div data-testid="mock-pyme-dashboard">
    Pyme Dashboard - {username}
    <button onClick={onCreateWaste}>Create Waste</button>
  </div>
));
jest.mock('./components/dashboards/RecyclerDashboard/RecyclerDashboard', () => () => <div data-testid="mock-recycler-dashboard">Recycler Dashboard</div>);
jest.mock('./components/dashboards/PymeDashboard/PymeWasteEntryForm', () => () => <div data-testid="mock-pyme-waste-form">Pyme Waste Form</div>);
jest.mock('./components/dashboards/PymeDashboard/PymeWasteEntrySuccess', () => () => <div data-testid="mock-pyme-waste-success">Success View</div>);
jest.mock('./components/dashboards/PymeDashboard/PymeWasteEntryError', () => () => <div data-testid="mock-pyme-waste-error">Error View</div>);
jest.mock('./components/dashboards/RecyclerDashboard/RecyclerNearbyWasteView', () => () => <div data-testid="mock-recycler-waste-view">Recycler Waste View</div>);
jest.mock('./components/dashboards/RecyclerDashboard/RecyclerEditProfileView', () => () => <div data-testid="mock-recycler-edit-profile">Edit Profile View</div>);

describe('App Component - Routing and Sessions', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, 'Test page', '/');
  });

  test('muestra la LandingPage y el Header en la ruta raíz por defecto', () => {
    render(<App />);
    expect(screen.getByTestId('mock-landing')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('permite navegar a la página de "About" usando el Header', () => {
    render(<App />);
    const aboutButton = screen.getByText('Go to About');
    fireEvent.click(aboutButton);

    expect(screen.getByTestId('mock-about')).toBeInTheDocument();
  });

  test('permite iniciar sesión como Administrador y redirige al dashboard protegido', async () => {
    render(<App />);
    
    // Hace clic en el botón de login simulado en la landing page
    const loginButton = screen.getByText('Login as Admin');
    fireEvent.click(loginButton);

    // Valida que renderice el Admin Dashboard y que el Header desaparezca (por la ruta /dashboard)
    await waitFor(() => {
      expect(screen.getByTestId('mock-admin-dashboard')).toHaveTextContent('Admin Dashboard - Test Admin');
    });
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
  });

  test('permite cerrar sesión y redirige de vuelta a la página principal', async () => {
    render(<App />);

    // Inicia sesión primero
    fireEvent.click(screen.getByText('Login as Admin'));
    await waitFor(() => {
      expect(screen.getByTestId('mock-admin-dashboard')).toBeInTheDocument();
    });

    // Cierra sesión
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Valida que vuelva a la landing page y aparezca el header
    await waitFor(() => {
      expect(screen.getByTestId('mock-landing')).toBeInTheDocument();
    });
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  test('restringe rutas protegidas de PYME si el usuario no tiene el rol adecuado o no está logueado', async () => {
    window.history.pushState({}, 'Test page', '/dashboard/pyme/residuos/nuevo');
    render(<App />);

    // Al no estar autenticado, redirige al home (LandingPage)
    await waitFor(() => {
      expect(screen.getByTestId('mock-landing')).toBeInTheDocument();
    });
  });

  test('permite acceder al formulario de residuos si el usuario logueado es PYME', async () => {
    render(<App />);

    // Loguearse como Pyme
    fireEvent.click(screen.getByText('Login as Pyme'));
    await waitFor(() => {
      expect(screen.getByTestId('mock-pyme-dashboard')).toBeInTheDocument();
    });

    // Simular acción de crear residuo que cambia la ruta
    fireEvent.click(screen.getByText('Create Waste'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-pyme-waste-form')).toBeInTheDocument();
    });
  });

  test('redirige a la ruta principal (404 catch-all) ante una URL desconocida', () => {
    window.history.pushState({}, 'Test page', '/ruta-inexistente');
    render(<App />);

    expect(screen.getByTestId('mock-landing')).toBeInTheDocument();
  });
});