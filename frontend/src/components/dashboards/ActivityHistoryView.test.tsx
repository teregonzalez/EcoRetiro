import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityHistoryView from "./ActivityHistoryView";

describe("ActivityHistoryView", () => {
  test("filtra las actividades por tipo", () => {
    render(<ActivityHistoryView />);

    expect(screen.getByText("Residuo ingresado")).toBeInTheDocument();
    expect(screen.getByText("Ruta completada")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Tipo de actividad"), {
      target: { value: "ruta" },
    });

    expect(screen.getByText("Ruta completada")).toBeInTheDocument();
    expect(screen.queryByText("Residuo ingresado")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filtrar por actor"), {
      target: { value: "sin coincidencias" },
    });
    expect(screen.getByText("No hay actividades que coincidan con los filtros.")).toBeInTheDocument();
  });
});