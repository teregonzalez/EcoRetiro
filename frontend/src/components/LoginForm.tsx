import React, { useState } from 'react';
import '../styles/LoginForm.css';
import axios from 'axios';

interface LoginFormProps {
  onLoginSuccess: (userId: number, username: string) => void;
  onRegisterClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
}) => {
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
        alert('Registration successful! Please log in.');
      } else {
        onLoginSuccess(response.data.userId, response.data.username);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">
            {isRegistering ? 'Create Account' : 'Login'}
          </button>
        </form>
        <button
          className="toggle-btn"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
