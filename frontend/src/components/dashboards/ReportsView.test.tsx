import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportsView from './ReportsView';

describe('ReportsView', () => {
  it('does nothing when the export window cannot be opened', () => {
    const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);
    render(<ReportsView title="Reporte" subtitle="Resumen" roleLabel="Administrador" />);

    fireEvent.click(screen.getByRole('button', { name: /exportar reporte/i }));
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('exports the report as a PDF when the button is clicked', () => {
    jest.useFakeTimers();

    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {
      const popup = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
        },
        focus: jest.fn(),
        print: jest.fn(),
      } as unknown as Window;

      return popup;
    });

    render(
      <ReportsView
        title="Reportes de generación"
        subtitle="Consulta indicadores de impacto"
        roleLabel="Generador PYME"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /exportar reporte/i }));

    act(() => {
      jest.runAllTimers();
    });

    expect(openSpy).toHaveBeenCalled();
    const popup = openSpy.mock.results[0]?.value as any;
    expect(popup.print).toHaveBeenCalledTimes(1);

    openSpy.mockRestore();
    jest.useRealTimers();
  });
});
