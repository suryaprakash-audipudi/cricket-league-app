// src/components/molecules/ImageUploadZone.jsx
import React, { useState } from 'react';
import { useImageCompressor } from '../../hooks/useImageCompressor';
import { ImagePreview } from '../atoms/ImagePreview';

export const ImageUploadZone = ({ 
  label, 
  shouldCompress = true, // 🚀 కంప్రెషన్ చేయాలా వద్దా అని డిసైడ్ చేసే స్విచ్ (Default: true)
  compressionConfig = {}, 
  onFileReady,
}) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const { compressImage, compressing, error } = useImageCompressor();

  const handleFileChange = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    let finalFileToUpload = rawFile;

    // 💎 యూజర్ కంప్రెషన్ కావాలి (true) అని చెప్తేనే హుక్ రన్ అవుతుంది
    if (shouldCompress) {
      const compressedBlob = await compressImage(rawFile, compressionConfig);
      if (compressedBlob) {
        finalFileToUpload = compressedBlob;
      } else {
        return; // కంప్రెషన్ ఫెయిల్ అయితే ప్రాసెస్ ఆపేస్తాం
      }
    }

    // లోకల్ బ్రౌజర్ ప్రివ్యూ క్రియేషన్ (కంప్రెస్ అయినా, అవ్వకపోయినా ప్రివ్యూ కనిపిస్తుంది)
    const localUrl = URL.createObjectURL(finalFileToUpload);
    setPreviewUrl(localUrl);
    
    // సబ్మిట్ ఫారమ్ కోసం ఫైల్ ని పేరెంట్ కి పంపిస్తున్నాం
    onFileReady(finalFileToUpload);
  };

  const handleClear = () => {
    setPreviewUrl('');
    onFileReady(null);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        {label && <label className="block text-sm font-semibold text-slate-300">{label}</label>}
        {/* అడ్మిన్ కి తెలియడానికి ఒక చిన్న బ్యాడ్జ్ */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${shouldCompress ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          {shouldCompress ? '⚡ WebP Optimization On' : '🖼️ Original Quality Mode'}
        </span>
      </div>
      
      {(previewUrl || compressing) ? (
        <ImagePreview 
          url={previewUrl} 
          isReady={!!previewUrl} 
          compressing={compressing} 
          onRemove={handleClear} 
        />
      ) : (
        <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 file:cursor-pointer" 
          />
        </div>
      )}
      
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};
