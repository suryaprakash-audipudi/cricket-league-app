// src/components/atoms/ImagePreview.jsx
import React from 'react';

export const ImagePreview = ({ url, isReady, onRemove, compressing }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
      {/* 📷 Dynamic Image Thumbnail Preview */}
      <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
        {url ? (
          <img src={url} alt="Optimized Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl text-slate-600">{compressing ? '⏳' : '📷'}</span>
        )}
      </div>

      {/* ✨ Custom Content controls */}
      <div className="flex-1">
        {compressing && (
          <p className="text-emerald-400 text-[11px] font-semibold animate-pulse">
            ⚡ Running Custom Hook Engine to optimize into WebP...
          </p>
        )}
        
        {url && isReady && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              ✓ Optimized WebP Ready
            </span>
            <button 
              type="button" 
              onClick={onRemove}
              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition duration-150"
            >
              🔄 Change Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
