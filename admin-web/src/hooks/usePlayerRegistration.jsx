// src/hooks/usePlayerRegistration.js
import { useState } from 'react';
import { gql } from '@apollo/client/core';
import { useMutation, useApolloClient } from '@apollo/client/react'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase"; 
import { useMediaUploader } from './useMediaUploader';

const REGISTER_PLAYER = gql`
  mutation RegisterGlobalPlayer($name: String!, $phone: String!, $skill: String!, $geoScope: GeoScopeInput!, $profilePic: String!, $idHash: String!, $idCardDocUrl: String!, $username: String !) {
    registerGlobalPlayer(username:$username, name: $name, phone: $phone, skill: $skill, geoScope: $geoScope, profilePic: $profilePic, idHash: $idHash, idCardDocUrl: $idCardDocUrl) { id name }
  }
`;

const CHECK_USERNAME = gql`
  query CheckUsernameAvailability($username: String!) { checkUsernameAvailability(username: $username) }
`;

export const usePlayerRegistration = () => {
  const client = useApolloClient();
  const [registerPlayer] = useMutation(REGISTER_PLAYER);
  const { uploadToCloud } = useMediaUploader();

  // Form Fields & Status States
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(''); 
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState(''); 
  const [otp, setOtp] = useState('');
  const [skill, setSkill] = useState('BATSMAN');
  const [selectedFile, setSelectedFile] = useState(null);
  const [idDocFile, setIdDocFile] = useState(null);
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');

  // Process States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [actionStatus, setActionStatus] = useState('');

  const generateSHA256 = async (text) => {
    const msgBuffer = new TextEncoder().encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) {}
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'normal' });
  };

  const handleUsernameChange = async (val) => {
    const inputVal = val.trim();
    setUsername(inputVal);
    
    
    if (inputVal.length < 3) {
      setUsernameStatus('MIN_LENGTH');
      setIsUsernameValid(false);
      return;
    }

    const usernameRegex = /^[a-z]{3}[a-z0-9]*$/;
    if (!usernameRegex.test(inputVal)) {
      setUsernameStatus('INVALID_CHARS');
      setIsUsernameValid(false);
      return;
    }

    try {
      setUsernameStatus('CHECKING');
      const { data } = await client.query({
        query: CHECK_USERNAME,
        variables: { username: inputVal.toLowerCase() },
        fetchPolicy: 'network-only'
      });

      if (data.checkUsernameAvailability) {
        setUsernameStatus('AVAILABLE');
        setIsUsernameValid(true);
      } else {
        setUsernameStatus('TAKEN');
        setIsUsernameValid(false);
      }
    } catch (err) {
      setUsernameStatus('SERVER_ERROR');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setActionStatus('');

    if (!isUsernameValid) return setActionStatus('Registration Blocked: Secure a unique username first.');
    if (!phone.startsWith('+91')) return setActionStatus('Error: Mobile number must include +91 code.');
    if (idNumber.trim().length < 5) return setActionStatus('Error: Enter a valid ID Card Number.');
    if (!selectedFile || !idDocFile) return setActionStatus('Photo check required: Both files are mandatory.');

    try {
      setActionStatus('Dispatching Firebase Secure Verification Token...');
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      setActionStatus('6-Digit OTP Token transmitted successfully!');
    } catch (err) {
      setActionStatus(`Auth Core Interrupted: ${err.message}`);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setActionStatus('');

    try {
      setActionStatus('Validating Token Code with Firebase Node...');
      await confirmationResult.confirm(otp); 

      setActionStatus('Hashing Identity Vector...');
      const computedHash = await generateSHA256(idNumber); 

      setActionStatus('Encrypting profile image canvas...');
      const cdnUrl = await uploadToCloud(selectedFile, 'player_profiles', 'profile');

      setActionStatus('Uploading identity card document...');
      const idCardDocUrl = await uploadToCloud(idDocFile, 'identity_documents', 'id-card');

      setActionStatus('Transferring encrypted payload to GraphQL firewall layer...');
      await registerPlayer({
        variables: {
          username, name, phone, skill, profilePic: cdnUrl, idHash: computedHash, idCardDocUrl,
          geoScope: { level: geoLevel, country: 'IN', state: 'AP', district: 'GNT', constituency: constituency.toUpperCase() }
        }
      });

      setActionStatus(`🎉 Applied Successfully! Profile secured under contract. Awaiting PSPL Admin approval.`);
      setIsOtpSent(false); setUsername(''); setUsernameStatus(''); setName(''); setPhone(''); setIdNumber(''); setOtp(''); setSelectedFile(null); setIdDocFile(null);
    } catch (err) {
      if (err.message.includes("DUPLICATE_ENTRY") || err.message.includes("IDENTITY_EXISTS")) {
        setActionStatus('❌ Registration Aborted: Identity Card or Mobile Number already registered!');
      } else {
        setActionStatus('❌ Authentication Failure: Invalid or expired OTP token.');
      }
    }
  };

  return {
    username, usernameStatus, name, phone, idNumber, otp, skill, geoLevel, constituency, isOtpSent, actionStatus,
    setName, setPhone, setIdNumber, setOtp, setSkill, setSelectedFile, setIdDocFile, setGeoLevel, setConstituency,
    handleUsernameChange, handleSendOtp, handleVerifyAndRegister, setIsOtpSent
  };
};
