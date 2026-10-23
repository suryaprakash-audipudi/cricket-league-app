// src/hooks/usePlayerRegistration.js
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { useMediaUploader } from './useMediaUploader';

const REGISTER_PLAYER = gql`
  mutation RegisterGlobalPlayer(
    $username: String!
    $name: String!
    $phone: String!
    $skill: String!
    $geoScope: GeoScopeInput!
    $profilePic: String!
    $idHash: String!
    $idCardDocUrl: String!
  ) {
    registerGlobalPlayer(
      username: $username
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

const CHECK_USERNAME = gql`
  query CheckUsernameAvailability($username: String!) { 
    checkUsernameAvailability(username: $username) 
  }
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
  const [skill, setSkill] = useState('BATSMAN');
  const [selectedFile, setSelectedFile] = useState(null);
  const [idDocFile, setIdDocFile] = useState(null);
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [actionStatus, setActionStatus] = useState('');

  const generateSHA256 = async (text) => {
    const msgBuffer = new TextEncoder().encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleUsernameChange = async (val) => {
    const inputVal = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    setUsername(inputVal);
    
    if (inputVal.length === 0) {
      setUsernameStatus('');
      setIsUsernameValid(true);
      return;
    }

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
        variables: { username: inputVal },
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

  // Direct 1-Click Submission Bypass for Development Speed
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setActionStatus('');

    let finalUsername = username.trim();
    if (finalUsername.length === 0) {
      const cleanSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const cryptoBuffer = new Uint32Array(1);
      crypto.getRandomValues(cryptoBuffer);
      const secureRandomToken = ((cryptoBuffer % 1500000000) + 2200000000).toString(36).toLowerCase();
      finalUsername = `${cleanSlug}${secureRandomToken}`;
      setIsUsernameValid(true);
    } else if (!isUsernameValid) {
      return setActionStatus('Registration Blocked: Secure a unique username first.');
    }

    if (!phone.startsWith('+91') || phone.trim().length < 13) {
      return setActionStatus('Error: Mobile number must include +91 code.');
    }
    if (idNumber.trim().length < 5) return setActionStatus('Error: Enter a valid ID Card Number.');
    if (!selectedFile || !idDocFile) return setActionStatus('Photo check required: Both files are mandatory.');

    try {
      setActionStatus('Executing Security Handshake and Hashing Identity Vectors...');
      const computedHash = await generateSHA256(idNumber); 

      setActionStatus('Encrypting and uploading profile image canvas...');
      const cdnUrl = await uploadToCloud(selectedFile, 'player_profiles', 'profile');

      setActionStatus('Uploading identity card document archive...');
      const idCardDocUrl = await uploadToCloud(idDocFile, 'identity_documents', 'id-card');

      setActionStatus('Routing payload matrix directly to GraphQL firewall layer...');
      await registerPlayer({
        variables: {
          username: finalUsername, 
          name, 
          phone, 
          skill, 
          profilePic: cdnUrl, 
          idHash: computedHash, 
          idCardDocUrl,
          geoScope: { level: geoLevel, country: 'IN', state: 'AP', district: 'PAL', constituency: constituency.toUpperCase() }
        }
      });

      setActionStatus('Applied Successfully! Profile secured under contract. Awaiting PSPL Admin approval.');
      setUsername(''); setUsernameStatus(''); setName(''); setPhone(''); setIdNumber(''); setSelectedFile(null); setIdDocFile(null);
    } catch (err) {
      if (err.message.includes("DUPLICATE_ENTRY") || err.message.includes("IDENTITY_EXISTS")) {
        setActionStatus('Registration Aborted: This Identity Card or Mobile Number is already registered!');
      } else {
        setActionStatus(`Server Refusal: ${err.message}`);
      }
    }
  };

  return {
    username, usernameStatus, name, phone, idNumber, skill, geoLevel, constituency, actionStatus,
    setName, setPhone, setIdNumber, setSkill, setSelectedFile, setIdDocFile, setGeoLevel, setConstituency,
    handleUsernameChange, handleVerifyAndRegister
  };
};
