// src/components/organisms/TeamForm.jsx
import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Input } from '../atoms/Input';
import { GeoZone } from '../molecules/GeoZone';
import { PlayerSelector } from '../molecules/PlayerSelector'; // ఆటో-కంప్లీట్ మాలిక్యూల్

const CREATE_GLOBAL_TEAM = gql`
    mutation CreateGlobalTeam(
    $teamName: String!
    $logoUrl: String!
    $ownerId: String!
    $playerIds: [String]!     # అరే ఇన్‌పుట్ వేరియబుల్
    $geoScope: GeoScopeInput!
  ) {
    createGlobalTeam(
      teamName: $teamName
      logoUrl: $logoUrl
      ownerId: $ownerId
      playerIds: $playerIds
      geoScope: $geoScope
    ) {
      id
      teamName
    }
  }
`;

export const TeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [playerIds, setPlayerIds] = useState([]); // ఇక్కడికి ఆటో-కంప్లీట్ ఐడిలు వస్తాయి
  
  // GeoScope States
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [successMsg, setSuccessMsg] = useState('');

  const [createTeam, { loading, error }] = useMutation(CREATE_GLOBAL_TEAM);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const res = await createTeam({
        variables: {
          teamName,
          logoUrl,
          ownerId,
          playerIds, // ఆటో-కంప్లీట్ లో సెలెక్ట్ అయిన ఐడిల అరే
          geoScope: {
            level: geoLevel,
            country: 'IN',
            state: 'AP',
            district: 'GNT',
            constituency: constituency.toUpperCase()
          }
        }
      });
      setSuccessMsg(`Franchise Team "${res.data.createGlobalTeam.teamName}" Registered Successfully! 🛡️`);
      setTeamName('');
      setLogoUrl('');
      setOwnerId('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Franchise Team Name" required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Narasaraopeta Warriors" />
      <Input label="Team Logo CDN URL" type="url" required value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com" />
      <Input label="Team Franchise Owner ID" required value={ownerId} onChange={(e) => setOwnerId(e.target.value)} placeholder="Paste Owner User Token/ID" />
      
      {/* 🚀 మన పవర్‌ఫుల్ ఆటో-కంప్లీట్ మాలిక్యూల్ ఇక్కడ యాడ్ అయింది */}
      <PlayerSelector selectedPlayers={playerIds} setSelectedPlayers={setPlayerIds} />

      <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 active:scale-[0.99] transition duration-150 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
      >
        {loading ? 'Registering Franchise Fleet...' : 'Deploy Team to League'}
      </button>

      {successMsg && <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center font-semibold">{successMsg}</div>}
      {error && <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">❌ Team Creation Failed: {error.message}</div>}
    </form>
  );
};
