// src/hooks/useLoginForm.ts
import { useState } from 'react';
import axios from 'axios';

interface UseLoginFormProps {
  onLoginSuccess: (userId: number, username: string) => void;
}

export const useLoginForm = ({ onLoginSuccess }: UseLoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(endpoint, { username, password });

      if (isRegistering) {
        setError('');
        setUsername('');
        setPassword('');
        setIsRegistering(false);
        alert('¡Registro exitoso! Por favor inicia sesión.');
      } else {
        onLoginSuccess(response.data.userId, response.data.username);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Ocurrió un error. Por favor intenta de nuevo.'
      );
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isRegistering,
    handleSubmit,
    toggleRegister
  };
};