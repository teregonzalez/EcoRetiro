import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import '../styles/History.css';
import axios from 'axios';
export const History = ({ userId }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchHistory();
    }, [userId]);
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/waste/history/${userId}`);
            setEntries(response.data);
            setError('');
        }
        catch (err) {
            setError('Failed to load history');
        }
        finally {
            setLoading(false);
        }
    };
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=500,width=800');
        if (printWindow) {
            let content = '<html><head><title>Waste History Report</title>';
            content += '<style>';
            content +=
                'table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 8px; text-align: left; }';
            content += 'th { background-color: #f2f2f2; }';
            content += '</style></head><body>';
            content += '<h2>Waste History Report</h2>';
            content += '<table>';
            content +=
                '<tr><th>Type</th><th>Weight (kg)</th><th>Date</th></tr>';
            entries.forEach((entry) => {
                content += `<tr><td>${entry.type}</td><td>${entry.weight.toFixed(2)}</td><td>${new Date(entry.date).toLocaleDateString()}</td></tr>`;
            });
            content += '</table>';
            content +=
                `<p><strong>Total entries:</strong> ${entries.length}</p>`;
            content += '</body></html>';
            printWindow.document.write(content);
            printWindow.print();
        }
    };
    return (_jsxs("div", { className: "history-container", children: [_jsx("h2", { children: "Waste History" }), _jsxs("div", { className: "actions", children: [_jsx("button", { onClick: fetchHistory, className: "refresh-btn", children: "Refresh" }), _jsx("button", { onClick: handlePrint, className: "print-btn", disabled: entries.length === 0, children: "Print Report" })] }), loading && _jsx("div", { className: "loading", children: "Loading..." }), error && _jsx("div", { className: "error", children: error }), !loading && entries.length === 0 && (_jsx("div", { className: "no-data", children: "No history entries yet" })), !loading && entries.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("table", { className: "history-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Type" }), _jsx("th", { children: "Weight (kg)" }), _jsx("th", { children: "Date" })] }) }), _jsx("tbody", { children: entries.map((entry) => (_jsxs("tr", { children: [_jsx("td", { children: entry.type }), _jsx("td", { children: entry.weight.toFixed(2) }), _jsxs("td", { children: [new Date(entry.date).toLocaleDateString(), " -", new Date(entry.date).toLocaleTimeString()] })] }, entry.id))) })] }), _jsxs("div", { className: "summary", children: [_jsxs("p", { children: [_jsx("strong", { children: "Total Entries:" }), " ", entries.length] }), _jsxs("p", { children: [_jsx("strong", { children: "Total Weight:" }), ' ', entries.reduce((sum, e) => sum + e.weight, 0).toFixed(2), " kg"] })] })] }))] }));
};
export default History;
