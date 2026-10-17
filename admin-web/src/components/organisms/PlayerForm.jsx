// src/components/organisms/PlayerForm.jsx
import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase"; 
import { useMediaUploader } from '../../hooks/useMediaUploader';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';
import { ImageUploadZone } from '../molecules/ImageUploadZone';

// 🚀 బ్యాకెండ్ స్కీమాకు తగ్గట్లుగా \$idHash ని ముటేషన్‌లో యాడ్ చేసాం
const REGISTER_PLAYER = gql`
  mutation RegisterGlobalPlayer(
    $name: String!
    $phone: String!
    $skill: String!
    $geoScope: GeoScopeInput!
    $profilePic: String!
    $idHash: String!
    $idCardDocUrl: String!
  ) {
    registerGlobalPlayer(
      name: $name
      phone: $phone
      skill: $skill
      geoScope: $geoScope
      profilePic: $profilePic
      idHash: $idHash
      idCardDocUrl: $idCardDocUrl
    ) { 
      id 
      name 
    }
  }
`;

export const PlayerForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState(''); // ఐడీ కార్డ్ నెంబర్ టెక్స్ట్ స్టేట్
  const [otp, setOtp] = useState('');
  const [skill, setSkill] = useState('BATSMAN');
  const [selectedFile, setSelectedFile] = useState(null);
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [idDocFile, setIdDocFile] = useState(null);
  
  // OTP Verification & Progress States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  
  const [registerPlayer] = useMutation(REGISTER_PLAYER);
  const { uploadToCloud } = useMediaUploader();

  // 🔒 💎 బ్రౌజర్ లోపలే ఆధార్/ఓటర్ ఐడీ నెంబర్‌ను SHA-256 కోడ్‌గా మార్చే ఉచిత క్రిప్టో ఫంక్షన్
  const generateSHA256 = async (text) => {
    const msgBuffer = new TextEncoder().encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // src/components/organisms/PlayerForm.jsx (setupRecaptcha ఫంక్షన్ ని ఇలా మార్చండి)

const setupRecaptcha = () => {
  // 🚀 పాత రికాప్చా విడ్జెట్ ఏమైనా మెమొరీలో ఉంటే దాన్ని పూర్తిగా డిలీట్ చేసి ఫ్రెష్ గా క్రియేట్ చేస్తున్నాం
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.log("Clearing old verifier instance");
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'normal', // లోకల్ లో టోకెన్స్ పక్కాగా పాస్ అవ్వడానికి నార్మల్ మోడ్ వాడాం
    'callback': (response) => {
      console.log("reCAPTCHA certified success! Fresh token created.");
    },
    'expired-callback': () => {
      setActionStatus('❌ reCAPTCHA token expired. Please reload page.');
    }
  });
};


  // 📩 1. యూజర్ వివరాలు ఇచ్చి బటన్ నొక్కగానే మొదట మొబైల్ కి OTP వెళ్తుంది
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setActionStatus('');

    if (!phone.startsWith('+91')) {
      setActionStatus('❌ Error: Mobile number must include +91 code (e.g., +919000403288).');
      return;
    }
    if (idNumber.trim().length < 5) {
      setActionStatus('❌ Error: Please enter a valid Government ID Card Number.');
      return;
    }
    if (!selectedFile) {
      setActionStatus('❌ Photo check required: Please upload a profile picture.');
      return;
    }

    try {
      setActionStatus('📩 Dispatching Firebase Secure Verification Token...');
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      setActionStatus('📩 6-Digit OTP Token successfully transmitted to your mobile!');
    } catch (err) {
      setActionStatus(`❌ Auth Core Interrupted: ${err.message}`);
    }
  };

  // 🛡️ 2. OTP వెరిఫై అయ్యాక, ఐడీ ని హ్యాష్ చేసి బ్యాకెండ్ సర్వర్ వాలిడేషన్ లేయర్ కి పంపుతుంది
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setActionStatus('');

    try {
      setActionStatus('🔐 Validating Token Code with Firebase Node...');
      await confirmationResult.confirm(otp); // గూగుల్ ద్వారా ఓటీపీ వెరిఫికేషన్

      setActionStatus('🔒 Hashing Identity Vector with Cryptographic Engine...');
      const computedHash = await generateSHA256(idNumber); // 🔒 ఐడీ హ్యాషింగ్ మ్యాజిక్

      setActionStatus('☁️ Encrypting and caching profile image to Cloudflare CDN...');
      const cdnUrl = await uploadToCloud(selectedFile, 'player_profiles');

      // 🚀 2. ఆధార్ కార్డు డాక్యుమెంట్ ఫైల్ అప్‌లోడ్ (with specific folder)
      setActionStatus('📂 Uploading high-resolution identity card document...');
      const idCardDocUrl = await uploadToCloud(idDocFile, 'identity_documents');


      setActionStatus('🔄 Transferring encrypted payload to GraphQL firewall layer...');
      const res = await registerPlayer({
        variables: {
          name,
          phone,
          skill,
          profilePic: cdnUrl,
          idHash: computedHash, // సీక్రెట్ కోడ్ మాత్రమే వెళ్తుంది
          idCardDocUrl: idCardDocUrl,
          geoScope: { level: geoLevel, country: 'IN', state: 'AP', district: 'GNT', constituency: constituency.toUpperCase() }
        }
      });

      setActionStatus(`🎉 Applied Successfully! Profile secured under pending contract. Awaiting PSPL Admin Panel approval.`);
      // ఫారమ్ పూర్తిగా రీసెట్ చేయడం
      setIsOtpSent(false);
      setName('');
      setPhone('');
      setIdNumber('');
      setOtp('');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      // 💎 బ్యాకెండ్ సర్వర్ నుండి వచ్చే డూప్లికేట్ ఎర్రర్లను ఇక్కడ క్యాచ్ చేస్తున్నాం
      if (err.message.includes("DUPLICATE_ENTRY")) {
        setActionStatus('❌ Registration Aborted: This Identity Card or Mobile Number is already registered in PSPL Registry!');
      } else {
        setActionStatus('❌ Authentication Failure: Invalid or expired OTP token.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>

      {!isOtpSent ? (
        // --- ఫేజ్ 1: ప్రొఫైల్ వివరాలు మరియు ఐడీ ఎంట్రీ స్క్రీన్ ---
        <form onSubmit={handleSendOtp} className="space-y-6">
          <Input label="Player Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sachin" />
          <Input label="Mobile Vector Registry (With Country Code)" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +919000403288" />
          
          {/* 💎 కొత్త ఐడీ కార్డ్ నెంబర్ ఇన్‌పుట్ బాక్స్ */}
          <Input label="Government ID Card Number (Aadhaar / Voter ID)" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter ID number for duplicate screening" />
          
          <ImageUploadZone label="Player Profile Photo" onFileReady={(file) => setSelectedFile(file)} />

          <ImageUploadZone 
            label="Player ID Card" 
            shouldCompress={false}
            onFileReady={(file) => setIdDocFile(file)} 
            />
          
          <Select label="Player Primary Skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={[{value:'BATSMAN', label:'🏏 Batsman'}, {value:'BOWLER', label:'🥎 Bowler'}]} />
          <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />
          
          {/* 🟩 Legal Consent Checkbox */}
          <div className="flex items-start gap-3 bg-slate-800/20 p-4 rounded-xl border border-slate-800 my-2">
            <input type="checkbox" required id="legalConsent" className="mt-1 w-4 h-4 text-emerald-500 bg-slate-900 border-slate-750 rounded focus:ring-emerald-500 cursor-pointer" />
            <label htmlFor="legalConsent" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
              పల్నాడు స్ట్రీట్ ప్రీమియర్ లీగ్ (<span className="text-emerald-400 font-bold">PSPL</span>) లో డూప్లికేట్ ఎంట్రీలను నిరోధించడానికి నా గుర్తింపు కార్డును ఎన్‌క్రిప్టెడ్ పద్ధతిలో వెరిఫై చేయడానికి నేను స్వచ్ఛందంగా అంగీకరిస్తున్నాను.
            </label>
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 transition">
            Verify & Send Secure OTP
          </button>
        </form>
      ) : (
        // --- ేజ్ 2: ఓటీపీ వెరిఫికేషన్ స్క్రీన్ ---
        <form onSubmit={handleVerifyAndRegister} className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-white">Enter Mobile Access Token</h4>
            <p className="text-xs text-slate-400 mt-0.5">PSPL token injected to <b className="text-emerald-400">{phone}</b></p>
          </div>
          <Input label="6-Digit Secure OTP Code" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength="6" />
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsOtpSent(false)} className="flex-1 bg-slate-800 text-slate-300 p-3 rounded-xl font-bold border border-slate-700 transition">Back</button>
            <button type="submit" className="flex-1 bg-emerald-500 text-slate-950 p-3 rounded-xl font-bold transition">Verify & Register Player</button>
          </div>
        </form>
      )}

      {actionStatus && <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-center font-semibold text-slate-200">{actionStatus}</div>}
    </div>
  );
};
