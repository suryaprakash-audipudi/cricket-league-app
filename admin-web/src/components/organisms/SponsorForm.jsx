// src/components/organisms/SponsorForm.jsx
import React, { useState } from 'react';
import { gql } from '@apollo/client/core';
import { useMutation } from '@apollo/client/react'; 
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';

// నిన్న రాత్రి మనం బ్యాకెండ్ లో రాసిన Mutation ని ఇక్కడ లింక్ చేస్తున్నాం
const CREATE_SPONSOR_AD = gql`
  mutation CreateGlobalSponsorAd(
    $sponsorName: String!
    $mediaUrl: String!
    $mediaType: String!
    $placement: String!
    $sponsorLevel: String!
    $targetId: String
    $geoScope: GeoScopeInput!
  ) {
    createGlobalSponsorAd(
      sponsorName: $sponsorName
      mediaUrl: $mediaUrl
      mediaType: $mediaType
      placement: $placement
      sponsorLevel: $sponsorLevel
      targetId: $targetId
      geoScope: $geoScope
    ) {
      id
      sponsorName
    }
  }
`;

export const SponsorForm = () => {
  // Form States
  const [sponsorName, setSponsorName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('IMAGE');
  const [placement, setPlacement] = useState('HOME_BANNER');
  const [sponsorLevel, setSponsorLevel] = useState('LEAGUE');
  const [targetId, setTargetId] = useState('');
  
  // GeoScope States
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [successMsg, setSuccessMsg] = useState('');

  // Apollo Hook for Mutation
  const [createAd, { loading, error }] = useMutation(CREATE_SPONSOR_AD);

  // Options Array (ఆటమ్ సెలెక్ట్ కాంపోనెంట్ కోసం)
  const mediaTypeOptions = [
    { value: 'IMAGE', label: 'Static Image (Banner)' },
    { value: 'VIDEO', label: 'Dynamic Video (.mp4 Clip)' },
    { value: 'INTERACTIVE', label: 'Interactive Component' }
  ];

  const placementOptions = [
    { value: 'HOME_BANNER', label: 'App Home Screen Slider' },
    { value: 'SCORE_BOTTOM', label: 'Live Scorecard Footer Banner' },
    { value: 'LIVE_STREAM_OVERLAY', label: 'OBS Broadcast Stream Overlay' }
  ];

  const tierOptions = [
    { value: 'LEAGUE', label: 'League Wide Sponsor' },
    { value: 'APP', label: 'App Maintenance Sponsor' },
    { value: 'TEAM', label: 'Specific Franchise/Team Sponsor' },
    { value: 'PLAYER', label: 'Individual Icon Player Sponsor' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const res = await createAd({
        variables: {
          sponsorName,
          mediaUrl,
          mediaType,
          placement,
          sponsorLevel,
          targetId: targetId || null,
          isActive: true,
          geoScope: {
            level: geoLevel,
            country: 'IN',
            state: 'AP',
            district: 'GNT',
            constituency: constituency.toUpperCase()
          }
        }
      });
      setSuccessMsg(`Sponsor Asset "${res.data.createGlobalSponsorAd.sponsorName}" Deployed Successfully!`);
      setSponsorName('');
      setMediaUrl('');
      setTargetId('');
    } catch (err) {
      console.error("Mutation Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* మనం ముందే రాసి ఉంచిన Atoms ని ఇక్కడ రీ-యూజ్ చేస్తున్నాం */}
      <Input label="Sponsor Brand Name" required value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="e.g. Tata, Dream11" />
      <Input label="Media CDN Asset URL" type="url" required value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://example.com" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Media Type" value={mediaType} onChange={(e) => setMediaType(e.target.value)} options={mediaTypeOptions} />
        <Select label="Ad Placement Slot" value={placement} onChange={(e) => setPlacement(e.target.value)} options={placementOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Sponsorship Tier" value={sponsorLevel} onChange={(e) => setSponsorLevel(e.target.value)} options={tierOptions} />
        <Input 
          label="Target ID (Team/Player Token)" value={targetId} onChange={(e) => setTargetId(e.target.value)} 
          placeholder="Paste Token ID" disabled={sponsorLevel === 'LEAGUE' || sponsorLevel === 'APP'} 
        />
      </div>

      {/* మనం రాసిన Molecules ని ఇక్కడ రీ-యూజ్ చేస్తున్నాం */}
      <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 active:scale-[0.99] transition duration-150 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
      >
        {loading ? 'Processing GraphQL Payload...' : 'Deploy Sponsor Asset'}
      </button>

      {successMsg && <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center font-semibold">{successMsg}</div>}
      {error && <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">❌ Deployment Failed: {error.message}</div>}
    </form>
  );
};
