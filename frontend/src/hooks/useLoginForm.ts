// src/hooks/useLoginForm.ts
import { useState } from "react";
import axios from "axios";
import { UserRole } from "../App";

const AUTH_TOKEN_KEY = "recycling_auth_token";

interface UseLoginFormProps {
  onLoginSuccess: (
    userId: number,
    username: string,
    role: UserRole,
    token?: string,
  ) => void;
}

interface LoginResponse {
  token?: string;
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
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companyRut, setCompanyRut] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";

      const payload = isRegistering
        ? {
            correo: username,
            password,
            nombreContacto: fullName,
            rol:
              role === "Generador"
                ? "Empresa_Generadora"
                : role === "Receptor"
                  ? "Empresa_Recicladora"
                  : role,
            razonSocial: company,
            rutEmpresa: companyRut,
          }
        : { correo: username, password };

      const response = await axios.post<LoginResponse>(endpoint, payload);

      if (isRegistering) {
        setError("");
        setUsername("");
        setPassword("");
        setFullName("");
        setRole("");
        setCompany("");
        setCompanyRut("");
        setIsRegistering(false);
        alert("¡Registro exitoso! Por favor inicia sesión.");
      } else {
        if (response.data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
          axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        }

        onLoginSuccess(
          response.data.userId,
          response.data.correo,
          normalizeRole(response.data.rol),
          response.data.token,
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
    fullName,
    setFullName,
    role,
    setRole,
    company,
    setCompany,
    companyRut,
    setCompanyRut,
    error,
    isRegistering,
    handleSubmit,
    toggleRegister,
  };
};
