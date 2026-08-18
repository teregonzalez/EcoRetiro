import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardShell from "./DashboardShell";

test("renderiza navegación, pestañas, CTA y cierre de sesión", () => {
  const onNavClick = jest.fn();
  const onTopTabChange = jest.fn();
  const onLogout = jest.fn();

  render(
    <DashboardShell
      appName="EcoRetiro"
      panelTitle="Panel de prueba"
      subtitle="Resumen operativo"
      username="Carmen"
      roleLabel="Administrador"
      navItems={[{ label: "Inicio", icon: "dashboard", active: true, onClick: onNavClick }]}
      topTabs={["Resumen", "Detalle"]}
      activeTopTab="Resumen"
      ctaLabel="Crear solicitud"
      onTopTabChange={onTopTabChange}
      onLogout={onLogout}
    >
      <p>Contenido de prueba</p>
    </DashboardShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: /Inicio/ }));
  fireEvent.click(screen.getByRole("button", { name: "Detalle" }));
  fireEvent.click(screen.getByRole("button", { name: /Cerrar Sesion/ }));

  expect(onNavClick).toHaveBeenCalledTimes(1);
  expect(onTopTabChange).toHaveBeenCalledWith("Detalle");
  expect(onLogout).toHaveBeenCalledTimes(1);
  expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
});