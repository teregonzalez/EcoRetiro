import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";
import axios from "axios";

jest.mock("axios", () => ({
  post: jest.fn(),
  defaults: { headers: { common: {} } },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  test("muestra y cierra el modal de recuperación de contraseña", () => {
    render(<LoginForm onLoginSuccess={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "¿Olvidó su clave?" }));
    expect(
      screen.getByRole("dialog", { name: "Recuperar contraseña" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Cerrar recuperación de contraseña" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("inicia sesión y guarda el token recibido", async () => {
    const onLoginSuccess = jest.fn();
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: "token-prueba", userId: 5, correo: "admin@test.com", rol: "Administrador" },
    });

    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    fireEvent.change(screen.getByLabelText("Usuario / Correo"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secreto123" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/login", {
        correo: "admin@test.com",
        password: "secreto123",
      });
      expect(onLoginSuccess).toHaveBeenCalledWith(5, "admin@test.com", "Administrador", "token-prueba");
    });
    expect(localStorage.getItem("recycling_auth_token")).toBe("token-prueba");
  });

  test("registra una cuenta y muestra el mensaje de recuperación solicitado", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    render(<LoginForm onLoginSuccess={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Solicitar Registro" }));
    fireEvent.change(screen.getByLabelText("Nombre Completo"), { target: { value: "Ana Pérez" } });
    fireEvent.change(screen.getByLabelText("Correo Electrónico"), { target: { value: "ana@test.com" } });
    fireEvent.change(screen.getByLabelText("Rol"), { target: { value: "Administrador" } });
    fireEvent.change(screen.getByLabelText("Contraseña", { selector: "#register-password" }), { target: { value: "clave123" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear Cuenta" }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/register", expect.objectContaining({
        correo: "ana@test.com",
        nombreContacto: "Ana Pérez",
        rol: "Administrador",
      }));
    });
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  test("muestra errores de autenticación y confirma una solicitud de recuperación", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: "Credenciales inválidas" } } });
    render(<LoginForm onLoginSuccess={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Usuario / Correo"), { target: { value: "usuario@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "incorrecta" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar Sesión" }));
    expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "¿Olvidó su clave?" }));
    fireEvent.click(screen.getByRole("button", { name: "Enviar instrucciones" }));
    expect(screen.getByText(/Si el correo está registrado/i)).toBeInTheDocument();
  });
});