// src/components/atoms/SimpleGeoSelect.jsx
import React from 'react';
import { useGeoScopeRegistry } from '../../hooks/useGeoScopeRegistry';
import { Loader2 } from 'lucide-react';

export const SimpleGeoSelect = ({ value, onChange, level = 'DISTRICT', target = 'CONSTITUENCY', levelIds = ['PAL'] }) => {
  // 🚀 Initialize master hook to extract our 7 segments under Guntur (GNT) database boundary
  const { geoNodes, loading, error } = useGeoScopeRegistry(
    level,
    target,
    levelIds
  );

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">
        Select Target Operational Constituency
      </label>

      <div className="relative w-full">
        <select
          required
          disabled={loading || error}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50 appearance-none cursor-pointer transition duration-150"
        >
          {loading ? (
            <option>Loading sectors matrix...</option>
          ) : error ? (
            <option>Registry load failure</option>
          ) : (
            <>
              <option value="">Choose sector destination</option>
              {geoNodes.map((node) => (
                // 🚀 Behind the scenes it maps the short code ID (NRT), but displays the clear Label name (Narasaraopeta)
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </>
          )}
        </select>

        {/* Dynamic network loader spinner integration */}
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Custom clean CSS arrow block to preserve native layout aesthetics */}
        {!loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
        )}
      </div>
    </div>
  );
};
