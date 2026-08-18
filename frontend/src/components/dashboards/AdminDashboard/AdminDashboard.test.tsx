import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from './AdminDashboard';

jest.mock('../../../api/dashboard', () => ({
  fetchAdminDashboard: jest.fn().mockResolvedValue({
    metrics: {
      totalUsers: 4,
      pendingRequests: 2,
      totalWasteTon: 12.3,
    },
    users: [
      {
        id: 1,
        empresa: 'EcoRetiro Central',
        rol: 'Administrador',
        estado: 'Aprobada',
        registro: '2024-01-01',
      },
    ],
    wasteTrend: [{ type: 'Plástico', total: 50 }],
  }),
}));

describe('AdminDashboard', () => {
  it('shows the users view when the sidebar Users item is selected', async () => {
    render(
      <AdminDashboard
        userId={1}
        username="Admin"
        onLogout={jest.fn()}
      />,
    );

    expect(await screen.findByText(/usuarios totales/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /usuarios/i }));

    expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/crear nuevo usuario/i)).toBeInTheDocument();
  });
});
