import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import '../styles/WasteInventory.css';
import axios from 'axios';
export const WasteInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchInventory();
    }, []);
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/waste/inventory');
            setInventory(response.data);
            setError('');
        }
        catch (err) {
            setError('Failed to load inventory');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "inventory-container", children: [_jsx("h2", { children: "Available Waste Inventory" }), _jsx("button", { onClick: fetchInventory, className: "refresh-btn", children: "Refresh" }), loading && _jsx("div", { className: "loading", children: "Loading..." }), error && _jsx("div", { className: "error", children: error }), !loading && inventory.length === 0 && (_jsx("div", { className: "no-data", children: "No waste entries yet" })), !loading && inventory.length > 0 && (_jsxs("table", { className: "inventory-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Waste Type" }), _jsx("th", { children: "Total Weight (kg)" }), _jsx("th", { children: "Number of Entries" })] }) }), _jsx("tbody", { children: inventory.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.type }), _jsx("td", { children: item.totalWeight.toFixed(2) }), _jsx("td", { children: item.count })] }, item.type))) })] }))] }));
};
export default WasteInventory;
