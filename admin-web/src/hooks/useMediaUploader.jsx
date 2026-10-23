// src/hooks/useMediaUploader.js
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const useMediaUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // 💎 Mapped strictly under your personal domain layout configuration routing matrix
  const convertToCdnUrl = (folderName, uniqueFileName, downloadUrl) => {
    try {
      // Isolate the firebase authentication token parameter securely from the original google URL string
      const urlInstance = new URL(downloadUrl);
      const secureToken = urlInstance.searchParams.get("token") || "";
      
      // Inject token parameters cleanly onto your own white-labeled proxy URL link mapping format
      return `https://psplcricket.in/${folderName}/${uniqueFileName}?token=${secureToken}`;
    } catch (e) {
      return `https://psplcricket.in/${folderName}/${uniqueFileName}`;
    }
  };

  const uploadToCloud = async (file, folderName = 'uploads', customPrefix = 'profile') => {
    if (!file) return null;

    setUploading(true);
    setUploadError('');

    try {
      const fullHexTimestamp = Date.now().toString(16).toLowerCase(); 

      const cryptoBuffer = new Uint32Array(1);
      crypto.getRandomValues(cryptoBuffer);
      const secureRandomToken = ((cryptoBuffer % 1500000000) + 2200000000).toString(36).toLowerCase();

      const uniqueFileName = `pspl-${customPrefix.toLowerCase()}-${fullHexTimestamp}-${secureRandomToken}.webp`;
      const storageRef = ref(storage, `${folderName}/${uniqueFileName}`);
      
      const metadata = { contentType: 'image/webp' };
      const uploadSnapshot = await uploadBytesResumable(storageRef, file, metadata);
      
      // 🚀 Fetch the authentic verified google metadata link payload string containing secure token footprint
      const rawGoogleDownloadUrl = await getDownloadURL(uploadSnapshot.ref);
      
      setUploading(false);
      return convertToCdnUrl(folderName, uniqueFileName, rawGoogleDownloadUrl);
    } catch (err) {
      console.error("Media Uploader Hook Error:", err);
      setUploadError('Cloud upload failed.');
      setUploading(false);
      return null;
    }
  };

  return { uploadToCloud, uploading, uploadError };
};
