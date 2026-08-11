// src/hooks/useLoginForm.ts
import { useState } from "react";
import axios from "axios";
import { UserRole } from "../App";

interface UseLoginFormProps {
  onLoginSuccess: (userId: number, username: string, role: UserRole) => void;
}

interface LoginResponse {
  userId: number;
  correo: string;
  rol: string;
}

const normalizeRole = (rawRole: string): UserRole => {
  if (
    rawRole === "Administrador" ||
    rawRole === "Reciclador" ||
    rawRole === "PYME"
  ) {
    return rawRole;
  }
  return "PYME";
};

export const useLoginForm = ({ onLoginSuccess }: UseLoginFormProps) => {
  const [username, setUsername] = useState(""); // Lo trataremos como el correo
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";

      // En el backend ahora esperamos "correo" en lugar de "username"
      const payload = isRegistering
        ? { correo: username, password } // *Ver nota abajo sobre el registro
        : { correo: username, password };

      const response = await axios.post<LoginResponse>(endpoint, payload);

      if (isRegistering) {
        setError("");
        setUsername("");
        setPassword("");
        setIsRegistering(false);
        alert("¡Registro exitoso! Por favor inicia sesión.");
      } else {
        // El backend ahora devuelve response.data.correo
        onLoginSuccess(
          response.data.userId,
          response.data.correo,
          normalizeRole(response.data.rol),
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Ocurrió un error. Por favor intenta de nuevo.",
      );
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isRegistering,
    handleSubmit,
    toggleRegister,
  };
};
