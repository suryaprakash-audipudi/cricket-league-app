// src/components/atoms/ImageUpload.jsx
import React, { useState } from 'react';

export const ImageUpload = ({ label, onFileSelect }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // కేవలం బ్రౌజర్ లోనే ప్రివ్యూ చూపించడానికి URL క్రియేట్ చేస్తున్నాం (₹0 Cost)
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setError('');

    // ఈ Raw File ని పేరెంట్ ఫారమ్ (PlayerForm) స్టేట్ కి పంపిస్తున్నాం
    onFileSelect(file);
  };

  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <div className="flex items-center gap-4">
        {/* బ్రౌజర్ లోకల్ ప్రివ్యూ సర్కిల్ */}
        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl ? (
            <img src={previewUrl} alt="Local Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl text-slate-600">📷</span>
          )}
        </div>
        <div className="flex-1">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 file:cursor-pointer" 
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};
