// src/components/molecules/PoolFilterTabs.jsx
import React from 'react';

export const PoolFilterTabs = ({ pools = [], activePoolTab, onSelectPool }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-900">
      {pools.map((poolCode) => {
        const isActive = activePoolTab === String(poolCode);
        return (
          <button
            type="button"
            key={poolCode}
            onClick={() => onSelectPool(String(poolCode))}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition border whitespace-nowrap ${
              isActive
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            Pool {poolCode}
          </button>
        );
      })}
    </div>
  );
};
