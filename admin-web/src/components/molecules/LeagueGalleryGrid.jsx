// src/components/molecules/LeagueGalleryGrid.jsx
import React from 'react';

export const LeagueGalleryGrid = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="h-48 overflow-hidden relative">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <span className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">
              {item.category}
            </span>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-bold text-white">{item.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};
