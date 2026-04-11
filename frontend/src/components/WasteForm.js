import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/WasteForm.css';
import axios from 'axios';
export const WasteForm = ({ userId, onWasteAdded, }) => {
    const [type, setType] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const wasteTypes = [
        'Plastic',
        'Paper',
        'Glass',
        'Aluminum',
        'Cardboard',
        'Wood',
        'Metal',
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('/api/waste/add', {
                userId,
                type,
                weight: parseFloat(weight),
            });
            setSuccess('Waste entry added successfully!');
            setType('');
            setWeight('');
            onWasteAdded();
            setTimeout(() => setSuccess(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        }
    };
    return (_jsxs("div", { className: "waste-form-container", children: [_jsx("h2", { children: "Add Waste Entry" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "type", children: "Waste Type:" }), _jsxs("select", { id: "type", value: type, onChange: (e) => setType(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Select a type" }), wasteTypes.map((t) => (_jsx("option", { value: t, children: t }, t)))] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "weight", children: "Weight (kg):" }), _jsx("input", { id: "weight", type: "number", step: "0.1", value: weight, onChange: (e) => setWeight(e.target.value), required: true })] }), error && _jsx("div", { className: "error", children: error }), success && _jsx("div", { className: "success", children: success }), _jsx("button", { type: "submit", children: "Add Waste" })] })] }));
};
export default WasteForm;
