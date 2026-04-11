import React, { useState, useEffect } from 'react';
import '../styles/WasteInventory.css';
import axios from 'axios';

interface InventoryItem {
  type: string;
  totalWeight: number;
  count: number;
}

export const WasteInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
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
    } catch (err: any) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Available Waste Inventory</h2>
      <button onClick={fetchInventory} className="refresh-btn">
        Refresh
      </button>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && inventory.length === 0 && (
        <div className="no-data">No waste entries yet</div>
      )}

      {!loading && inventory.length > 0 && (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Waste Type</th>
              <th>Total Weight (kg)</th>
              <th>Number of Entries</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.type}>
                <td>{item.type}</td>
                <td>{item.totalWeight.toFixed(2)}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WasteInventory;
