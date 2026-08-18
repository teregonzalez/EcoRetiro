import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  test("muestra y cierra el modal al solicitar un registro", () => {
    render(<LoginForm onLoginSuccess={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Solicitar Registro" }));
    expect(screen.getByRole("dialog", { name: "Crear Cuenta" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo Electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Rol")).toBeInTheDocument();
    expect(screen.getByLabelText("Empresa / Organización")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar registro" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});