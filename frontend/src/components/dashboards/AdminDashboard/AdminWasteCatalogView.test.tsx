import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminWasteCatalogView from "./AdminWasteCatalogView";
import { createWasteCategory, fetchWasteCategories } from "../../../api/dashboard";

jest.mock("../../../api/dashboard", () => ({
  createWasteCategory: jest.fn(),
  fetchWasteCategories: jest.fn(),
}));

const mockedFetchWasteCategories = fetchWasteCategories as jest.MockedFunction<
  typeof fetchWasteCategories
>;
const mockedCreateWasteCategory = createWasteCategory as jest.MockedFunction<
  typeof createWasteCategory
>;

describe("AdminWasteCatalogView", () => {
  test("muestra y filtra las categorías disponibles", async () => {
    mockedFetchWasteCategories.mockResolvedValueOnce([
      { id: 1, name: "Metal", unit: "kg" },
      { id: 2, name: "Plástico PET", unit: "kg" },
    ]);

    render(<AdminWasteCatalogView />);

    expect(await screen.findByRole("heading", { name: "Metal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plástico PET" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "metal" } });

    expect(screen.getByRole("heading", { name: "Metal" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Plástico PET" })).not.toBeInTheDocument();
  });

  test("despliega el formulario y agrega una nueva categoría", async () => {
    mockedFetchWasteCategories.mockResolvedValueOnce([]);
    mockedCreateWasteCategory.mockResolvedValueOnce({ id: 7, name: "Vidrio", unit: "kg" });

    render(<AdminWasteCatalogView />);

    await screen.findByText("No se encontraron categorías.");
    fireEvent.click(screen.getByRole("button", { name: /Agregar Nueva Categoría/i }));
    fireEvent.change(screen.getByLabelText("Nombre de categoría"), { target: { value: "Vidrio" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(await screen.findByRole("heading", { name: "Vidrio" })).toBeInTheDocument();
    expect(mockedCreateWasteCategory).toHaveBeenCalledWith({ name: "Vidrio", unit: "kg" });
  });
});