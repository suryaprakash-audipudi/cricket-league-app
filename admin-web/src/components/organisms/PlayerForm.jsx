// src/components/organisms/PlayerForm.jsx
import React, { useState } from 'react';
import { gql } from '@apollo/client/core';
import { useMutation } from '@apollo/client/react'; 
import { useMediaUploader } from '../../hooks/useMediaUploader'; // 🚀 మన కొత్త కస్టమ్ హుక్ ఇంపోర్ట్ చేసాం
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';
import { ImageUploadZone } from '../molecules/ImageUploadZone';

const REGISTER_PLAYER = gql`
  mutation RegisterGlobalPlayer($name: String!, $phone: String!, $skill: String!, $profilePic: String!, $geoScope: GeoScopeInput!) {
    registerGlobalPlayer(name: $name, phone: $phone, skill: $skill, profilePic: $profilePic, geoScope: $geoScope) {
      id
      name
    }
  }
`;

export const PlayerForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('BATSMAN');
  const [selectedFile, setSelectedFile] = useState(null);
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  
  const [actionStatus, setActionStatus] = useState('');
  const [registerPlayer] = useMutation(REGISTER_PLAYER);
  
  // 💎 కరియర్-గ్రేడ్ అప్‌లోడర్ హుక్ ని ఇక్కడ డిఫైన్ చేసాం
  const { uploadToCloud, uploadError } = useMediaUploader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionStatus('');

    if (!selectedFile) {
      setActionStatus('❌ Please select a profile photo.');
      return;
    }

    try {
      // --- స్టెప్ 1: కస్టమ్ హుక్ ద్వారా క్లౌడ్‌ఫ్లేర్ CDN అప్‌లోడ్ రన్ చేయడం ---
      setActionStatus('☁️ Injecting asset into Cloudflare CDN Proxy & Google Cloud...');
      const cdnUrl = await uploadToCloud(selectedFile, 'player_profiles');

      if (!cdnUrl) {
        setActionStatus(`❌ Cloud Upload Failed: ${uploadError}`);
        return;
      }

      // --- స్టెప్ 2: GraphQL Mutation ద్వారా Firestore లో సేవ్ ---
      setActionStatus('🔄 Running GraphQL engine to persist player database...');
      const res = await registerPlayer({
        variables: {
          name,
          phone,
          skill,
          profilePic: cdnUrl, // హుక్ ఇచ్చిన పక్కా CDN యుఆర్ఎల్
          geoScope: { level: geoLevel, country: 'IN', state: 'AP', district: 'GNT', constituency: constituency.toUpperCase() }
        }
      });

      setActionStatus(`🎉 Success! Player ${res.data.registerGlobalPlayer.name} deployed to talent pool.`);
      // ఫారమ్ స్టేట్స్ క్లియర్ చేయడం
      setName('');
      setPhone('');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setActionStatus(`❌ Execution Failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Player Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sachin" />
      <Input label="Phone Number" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+9199..." />
      
      <ImageUploadZone 
        label="Player Profile Photo" 
        folderName="player_profiles"
        compressionConfig={{ maxSizeMB: 0.08, maxWidthOrHeight: 600 }} 
        onFileReady={(file) => setSelectedFile(file)} 
      />
      
      <Select label="Player Primary Skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={[{value:'BATSMAN', label:'🏏 Batsman'}, {value:'BOWLER', label:'🥎 Bowler'}]} />
      <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />

      <button type="submit" className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 transition">
        Deploy Player to Pool
      </button>

      {actionStatus && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-center font-semibold text-slate-200">
          {actionStatus}
        </div>
      )}
    </form>
  );
};
