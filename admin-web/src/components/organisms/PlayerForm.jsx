import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';

const REGISTER_PLAYER = gql`
  mutation RegisterGlobalPlayer($name: String!, $phone: String!, $skill: String!, $geoScope: GeoScopeInput!) {
    registerGlobalPlayer(name: $name, phone: $phone, skill: $skill, geoScope: $geoScope) {
      id
      name
    }
  }
`;

export const PlayerForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('BATSMAN');
  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [successMsg, setSuccessMsg] = useState('');

  const [registerPlayer, { loading, error }] = useMutation(REGISTER_PLAYER);

  const skillOptions = [
    { value: 'BATSMAN', label: '🏏 Batsman' },
    { value: 'BOWLER', label: '🥎 Bowler' },
    { value: 'ALL_ROUNDER', label: '⚡ All-Rounder' },
    { value: 'WICKET_KEEPER', label: '🧤 Wicket Keeper' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const res = await registerPlayer({
        variables: {
          name,
          phone,
          skill,
          geoScope: { level: geoLevel, country: 'IN', state: 'AP', district: 'GNT', constituency: constituency.toUpperCase() }
        }
      });
      setSuccessMsg(`Player ${res.data.registerGlobalPlayer.name} Registered Successfully!`);
      setName('');
      setPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Player Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sachin Tendulkar" />
      <Input label="Phone Number" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +919988776655" />
      <Select label="Player Primary Skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={skillOptions} />
      
      <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 active:scale-[0.99] transition duration-150 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
      >
        {loading ? 'Registering Pool Asset...' : 'Deploy Player to Pool'}
      </button>

      {successMsg && <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center font-semibold">{successMsg}</div>}
      {error && <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">❌ Deployment Failed: {error.message}</div>}
    </form>
  );
};
