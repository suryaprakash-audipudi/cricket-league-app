import React from 'react';

export const Input = ({ label, type = 'text', required = false, value, onChange, placeholder, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition duration-150"
        {...props}
      />
    </div>
  );
};
