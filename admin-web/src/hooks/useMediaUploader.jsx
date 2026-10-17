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
  return `https://psplcricket.in/${folderName}/${uniqueFileName}`;
};


  // 🚀 ఏ ఫైల్ అయినా ఏ ఫోల్డర్ లోకైనా అప్‌లోడ్ చేయగల పవర్ ఫుల్ ఫంక్షన్
  const uploadToCloud = async (file, folderName = 'uploads', customPrefix = 'profile') => {
    if (!file) return null;

    setUploading(true);
    setUploadError('');

    try {
      
      const fullHexTimestamp = Date.now().toString(16).toLowerCase(); 

      const cryptoBuffer = new Uint32Array(1);
      crypto.getRandomValues(cryptoBuffer);

        // 🚀 🔒 0% Substrings & 100% Fixed Length (7 Characters Guaranteed!)
        // క్రిప్టో నెంబర్ ని నేరుగా వాడకుండా... (cryptoBuffer[0] % 1500000000) చేసి దానికి కనీస ఆఫ్‌సెట్ 2200000000 ని కలుపుతున్నాం.
        // దీనివల్ల వచ్చే అంతిమ సంఖ్య ఎప్పుడూ 220 కోట్ల నుండి 370 కోట్ల మధ్యలోనే ఉంటుంది.
        // ఈ పరిధిలో ఉన్న ఏ నెంబర్ ని toString(36) చేసినా... ప్రపంచంలో ఎక్కడా, ఏ క్షణంలోనూ 
        // కటింగ్స్ లేదా ప్యాడింగ్స్ లేకుండా బై-డీఫాల్ట్ గా కచ్చితంగా "7 అక్షరాల" స్థిరమైన టోకెన్ వస్తుంది!
        const secureRandomToken = ((cryptoBuffer[0] % 1500000000) + 2200000000).toString(36).toLowerCase();     

      // 💎 మీ మాస్టర్ ప్లాన్ పక్కా ప్యాటర్న్: pspl-profile-1a84f326e7a-x9f2.webp
        const uniqueFileName = `pspl-${customPrefix.toLowerCase()}-${fullHexTimestamp}-${secureRandomToken}.webp`;
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
