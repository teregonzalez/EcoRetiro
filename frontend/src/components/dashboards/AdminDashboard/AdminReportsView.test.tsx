import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminReportsView from "./AdminReportsView";
import {
  fetchAdminManagedWasteReport,
  fetchAdminManagedWasteReports,
} from "../../../api/dashboard";

jest.mock("../../../api/dashboard", () => ({
  fetchAdminManagedWasteReports: jest.fn(),
  fetchAdminManagedWasteReport: jest.fn(),
}));

const mockedFetchReports = fetchAdminManagedWasteReports as jest.MockedFunction<
  typeof fetchAdminManagedWasteReports
>;
const mockedFetchReport = fetchAdminManagedWasteReport as jest.MockedFunction<
  typeof fetchAdminManagedWasteReport
>;

describe("AdminReportsView", () => {
  test("muestra el detalle del residuo gestionado seleccionado", async () => {
    mockedFetchReports.mockResolvedValueOnce([
      {
        id: 8,
        tipo: "Metal",
        cantidad: 125,
        unidad: "kg",
        empresaGeneradora: "Pyme Norte",
        empresaRecicladora: "Recicla Sur",
        fechaGestion: "2026-08-15",
      },
    ]);
    mockedFetchReport.mockResolvedValueOnce({
      id: 8,
      tipo: "Metal",
      cantidad: 125,
      unidad: "kg",
      estado: "Gestionado",
      empresaGeneradora: "Pyme Norte",
      empresaRecicladora: "Recicla Sur",
      fechaGestion: "2026-08-15",
      fechaPublicacion: "2026-08-10",
      fechaRecoleccion: "2026-08-14",
      fechaProcesamiento: "2026-08-15",
      certificado: null,
    });

    render(<AdminReportsView />);

    const reportButton = await screen.findByRole("button", { name: /Metal/i });
    fireEvent.click(reportButton);

    await waitFor(() => {
      expect(screen.getByText("Reporte #8")).toBeInTheDocument();
      expect(screen.getByText("Pyme Norte")).toBeInTheDocument();
      expect(screen.getByText("Recicla Sur")).toBeInTheDocument();
    });
  });
});