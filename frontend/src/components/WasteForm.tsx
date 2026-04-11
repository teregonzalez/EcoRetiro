import React, { useState } from 'react';
import '../styles/WasteForm.css';
import axios from 'axios';

interface WasteFormProps {
  userId: number;
  onWasteAdded: () => void;
}

export const WasteForm: React.FC<WasteFormProps> = ({
  userId,
  onWasteAdded,
}) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="waste-form-container">
      <h2>Add Waste Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Waste Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select a type</option>
            {wasteTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit">Add Waste</button>
      </form>
    </div>
  );
};

export default WasteForm;
