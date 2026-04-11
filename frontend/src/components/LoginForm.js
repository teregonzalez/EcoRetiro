import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/LoginForm.css';
import axios from 'axios';
export const LoginForm = ({ onLoginSuccess, }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const handleSubmit = async (e) => {
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
            }
            else {
                onLoginSuccess(response.data.userId, response.data.username);
            }
        }
        catch (err) {
            setError(err.response?.data?.error ||
                'An error occurred. Please try again.');
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-box", children: [_jsx("h1", { children: isRegistering ? 'Register' : 'Login' }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "Username:" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password:" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), error && _jsx("div", { className: "error", children: error }), _jsx("button", { type: "submit", children: isRegistering ? 'Create Account' : 'Login' })] }), _jsx("button", { className: "toggle-btn", onClick: () => setIsRegistering(!isRegistering), children: isRegistering
                        ? 'Already have an account? Login'
                        : "Don't have an account? Register" })] }) }));
};
export default LoginForm;
