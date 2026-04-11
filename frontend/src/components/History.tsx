import React, { useState, useEffect } from 'react';
import '../styles/History.css';
import axios from 'axios';

interface HistoryEntry {
  id: number;
  type: string;
  weight: number;
  date: string;
}

interface HistoryProps {
  userId: number;
}

export const History: React.FC<HistoryProps> = ({ userId }) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
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
    } catch (err: any) {
      setError('Failed to load history');
    } finally {
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
        content += `<tr><td>${entry.type}</td><td>${entry.weight.toFixed(
          2
        )}</td><td>${new Date(entry.date).toLocaleDateString()}</td></tr>`;
      });

      content += '</table>';
      content +=
        `<p><strong>Total entries:</strong> ${entries.length}</p>`;
      content += '</body></html>';
      printWindow.document.write(content);
      printWindow.print();
    }
  };

  return (
    <div className="history-container">
      <h2>Waste History</h2>

      <div className="actions">
        <button onClick={fetchHistory} className="refresh-btn">
          Refresh
        </button>
        <button onClick={handlePrint} className="print-btn" disabled={entries.length === 0}>
          Print Report
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && entries.length === 0 && (
        <div className="no-data">No history entries yet</div>
      )}

      {!loading && entries.length > 0 && (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Weight (kg)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.type}</td>
                  <td>{entry.weight.toFixed(2)}</td>
                  <td>
                    {new Date(entry.date).toLocaleDateString()} -
                    {new Date(entry.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary">
            <p>
              <strong>Total Entries:</strong> {entries.length}
            </p>
            <p>
              <strong>Total Weight:</strong>{' '}
              {entries.reduce((sum, e) => sum + e.weight, 0).toFixed(2)} kg
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
