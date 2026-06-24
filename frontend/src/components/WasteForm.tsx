import React, { useState } from 'react';
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
    { value: 'Plastic', label: '♻️ Plástico', icon: 'recyclable' },
    { value: 'Paper', label: '📄 Papel', icon: 'description' },
    { value: 'Glass', label: '🔷 Vidrio', icon: 'diamond' },
    { value: 'Aluminum', label: '⚙️ Aluminio', icon: 'settings' },
    { value: 'Cardboard', label: '📦 Cartón', icon: 'inventory_2' },
    { value: 'Wood', label: '🪵 Madera', icon: 'natural' },
    { value: 'Metal', label: '⚡ Metal', icon: 'bolt' },
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

      setSuccess('¡Entrada de residuos registrada exitosamente!');
      setType('');
      setWeight('');
      onWasteAdded();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Ocurrió un error. Por favor intenta de nuevo.'
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-xl">
        <h2 className="font-headline-lg text-primary mb-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary-fixed-dim">add_circle</span>
          Registrar Nuevo Residuo
        </h2>
        <p className="font-body-md text-on-surface-variant">
          Agrega información sobre los residuos que deseas registrar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-md max-w-2xl">
        {/* Waste Type */}
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">
            Tipo de Residuo
          </label>
          <div className="relative group transition-transform focus-within:-translate-y-[2px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
              category
            </span>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field pl-10 appearance-none"
              required
            >
              <option value="">Selecciona un tipo de residuo</option>
              {wasteTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">
            Peso (kg)
          </label>
          <div className="relative group transition-transform focus-within:-translate-y-[2px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors duration-200">
              scale
            </span>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ingresa el peso en kg"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium border border-error flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-tertiary-fixed text-on-primary-fixed p-3 rounded-lg text-sm font-medium border border-tertiary flex items-center gap-2 animate-pulse">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-md pt-md">
          <button 
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Registrar Residuo
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/30 mt-md">
          <div className="flex gap-2 items-start">
            <span className="material-symbols-outlined text-secondary text-[20px] mt-xs flex-shrink-0">info</span>
            <div>
              <p className="font-label-sm text-on-surface-variant">
                <strong>Consejo:</strong> Asegúrate de registrar el peso correcto del residuo. Esto ayuda a optimizar nuestras rutas de logística y calcular el impacto ambiental.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WasteForm;
