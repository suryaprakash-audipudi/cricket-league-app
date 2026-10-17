// src/hooks/useMediaUploader.js
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const useMediaUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // 💎 ఫైర్‌బేస్ యుఆర్ఎల్ ని మన క్లౌడ్‌ఫ్లేర్ డొమైన్ ప్రాక్సీ కిందకి మార్చే లాజిక్
  // src/hooks/useMediaUploader.js (ఈ ఫంక్షన్ ని మాత్రం అప్‌డేట్ చేయండి)

const convertToCdnUrl = (firebaseUrl, folderName, uniqueFileName) => {
  if (!firebaseUrl) return '';
  
  // 🚀 గూగుల్ ఇచ్చిన గజిబిజి యుఆర్ఎల్ ని పూర్తిగా పక్కన పెట్టేసి, 
  // నేరుగా మన క్లౌడ్‌ఫ్లేర్ ప్రాక్సీ కింద క్లీన్ స్ట్రక్చర్ ని బిల్డ్ చేస్తున్నాం!
  return `https://psplcricket.in${folderName}/${uniqueFileName}`;
};


  // 🚀 ఏ ఫైల్ అయినా ఏ ఫోల్డర్ లోకైనా అప్‌లోడ్ చేయగల పవర్ ఫుల్ ఫంక్షన్
  const uploadToCloud = async (file, folderName = 'uploads') => {
    if (!file) return null;

    setUploading(true);
    setUploadError('');

    try {
      const uniqueFileName = `${Date.now()}_player.webp`;
        const storageRef = ref(storage, `${folderName}/${uniqueFileName}`);
        
        const uploadSnapshot = await uploadBytesResumable(storageRef, file);
        const rawFirebaseUrl = await getDownloadURL(uploadSnapshot.ref);
        
        setUploading(false);
        
        // 🔗 ఇక్కడ మనం ఫోల్డర్ నేమ్, ఫైల్ నేమ్ రెండింటినీ పంపి క్లీన్ యుఆర్ఎల్ తెచ్చుకుంటున్నాం
        return convertToCdnUrl(rawFirebaseUrl, folderName, uniqueFileName);

    } catch (err) {
      console.error("Media Uploader Hook Error:", err);
      setUploadError('Cloud upload execution failed.');
      setUploading(false);
      return null;
    }
  };

  return { uploadToCloud, uploading, uploadError };
};
