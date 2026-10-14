import React from 'react';

export const Select = ({ label, value, onChange, options = [] }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none transition duration-150"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
