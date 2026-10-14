import React from 'react';
import { Select } from '../atoms/Select';
import { Input } from '../atoms/Input';

export const GeoZone = ({ geoLevel, setGeoLevel, constituency, setConstituency }) => {
  const geoOptions = [
    { value: 'DISTRICT', label: 'Local District Pool' },
    { value: 'STATE', label: 'State Championship Pool' },
    { value: 'NATIONAL', label: 'National Tournament Pool' },
    { value: 'INTERNATIONAL', label: 'Global International Base' }
  ];

  return (
    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/60 space-y-4">
      <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">🌍 Global Scope Hierarchy</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Target Horizon" value={geoLevel} onChange={(e) => setGeoLevel(e.target.value)} options={geoOptions} />
        <Input label="Regional/Constituency Code" value={constituency} onChange={(e) => setConstituency(e.target.value)} placeholder="e.g. NRT" />
      </div>
    </div>
  );
};
