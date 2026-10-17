// src/hooks/useImageCompressor.js
import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export const useImageCompressor = () => {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');

  // defaultOptions ని ఇక్కడే ఉంచి, బయట నుండి వచ్చే డైనమిక్ కన్ఫిగరేషన్ ని విలీనం (merge) చేస్తాం
  const compressImage = async (file, customOptions = {}) => {
    if (!file) return null;
    
    setError('');
    setCompressing(true);

    const defaultOptions = {
      maxSizeMB: 0.1,        // 100KB లోపలికి లాగుతుంది
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    const finalOptions = { ...defaultOptions, ...customOptions };

    try {
      const compressedBlob = await imageCompression(file, finalOptions);
      setCompressing(false);
      return compressedBlob;
    } catch (err) {
      console.error("Compression Hook Error:", err);
      setError('Image optimization failed.');
      setCompressing(false);
      return null;
    }
  };

  return { compressImage, compressing, error };
};
