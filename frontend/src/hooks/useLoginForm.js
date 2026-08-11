// src/hooks/useLoginForm.ts
import { useState } from "react";
import axios from "axios";
const normalizeRole = (rawRole) => {
    if (rawRole === "Administrador" ||
        rawRole === "Reciclador" ||
        rawRole === "PYME") {
        return rawRole;
    }
    return "PYME";
};
export const useLoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState(""); // Lo trataremos como el correo
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
            // En el backend ahora esperamos "correo" en lugar de "username"
            const payload = isRegistering
                ? { correo: username, password } // *Ver nota abajo sobre el registro
                : { correo: username, password };
            const response = await axios.post(endpoint, payload);
            if (isRegistering) {
                setError("");
                setUsername("");
                setPassword("");
                setIsRegistering(false);
                alert("¡Registro exitoso! Por favor inicia sesión.");
            }
            else {
                // El backend ahora devuelve response.data.correo
                onLoginSuccess(response.data.userId, response.data.correo, normalizeRole(response.data.rol));
            }
        }
        catch (err) {
            setError(err.response?.data?.error ||
                "Ocurrió un error. Por favor intenta de nuevo.");
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
