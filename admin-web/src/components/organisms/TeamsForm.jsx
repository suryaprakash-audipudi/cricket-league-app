// src/components/organisms/GlobalTeamsForm.jsx
import React from 'react';
import { useGlobalTeamRegistration } from '../../hooks/useGlobalTeamRegistration'; // 🚀 Direct connection gateway to our clean hook
//import { useGeoScopeRegistry } from '../../hooks/useGeoScopeRegistry';
import { Input } from '../atoms/Input';
import { GeoZone } from '../molecules/GeoZone';
import { ImageUploadZone } from '../molecules/ImageUploadZone';
import { PlayerSelector } from '../molecules/PlayerSelector';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { SimpleGeoSelect } from '../atoms/SimpleGeoSelect';

export const GlobalTeamsForm = () => {
  const {
    teamName, ownerName, ownerPhone, ownerEmail, playerIds, geoLevel, constituency, actionStatus, statusType, loading,
    setTeamName, setOwnerName, setOwnerPhone, setOwnerEmail, setPlayerIds, setGeoLevel, setConstituency, setLogoFile,
    handleRegisterTeam
  } = useGlobalTeamRegistration();
 // const { geoNodes } = useGeoScopeRegistry('DISTRICT', 'CONSTITUENCY', ['PAL']);

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white tracking-tight">Onboard a Global Team</h2>
        <p className="text-xs text-slate-400 mt-1">Establish sovereign profile credentials inside the global token asset network</p>
      </div>

      <form onSubmit={handleRegisterTeam} className="space-y-6">
        <Input 
          label="Sovereign Team / Club Name" 
          required 
          value={teamName} 
          onChange={(e) => setTeamName(e.target.value)} 
          placeholder="e.g. Narasaraopeta Super Kings" 
        />
        
        <Input 
          label="Franchise Owner Full Name" 
          required 
          value={ownerName} 
          onChange={(e) => setOwnerName(e.target.value)} 
          placeholder="e.g. Siva Prakash" 
        />
        
        <Input 
          label="Owner Mobile (With Country Code)" 
          type="tel" 
          required 
          value={ownerPhone} 
          onChange={(e) => setOwnerPhone(e.target.value)} 
          placeholder="e.g. +919000403288" 
        />
        
        <Input 
          label="Owner Email Address (Optional)" 
          type="email" 
          value={ownerEmail} 
          onChange={(e) => setOwnerEmail(e.target.value)} 
          placeholder="e.g. owner@club.com" 
        />
        
        <ImageUploadZone 
          label="Official Team Logo / Insignia" 
          onFileReady={(file) => setLogoFile(file)} 
        />

        {/* Global Talent Pool auto-complete selection draft board */}
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-slate-200 tracking-wide">Draft Base Team Squad (Optional)</h4>
          <PlayerSelector selectedPlayers={playerIds} setSelectedPlayers={setPlayerIds} />
        </div>

        
        <SimpleGeoSelect value={constituency} onChange={setConstituency}/>

        <button
          type="submit"
          disabled={loading || statusType === 'PENDING'}
          className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 active:scale-[0.99] transition duration-150 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          {loading || statusType === 'PENDING' ? 'Securing Fleet Node...' : 'Register Independent Club'}
        </button>
      </form>

      {actionStatus && (
        <div className={'flex items-center gap-2.5 p-4 border rounded-xl text-sm font-semibold tracking-wide transition duration-150 ' + (
          statusType === 'SUCCESS' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' :
          statusType === 'ERROR' ? 'bg-red-950/40 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-200'
        )}>
          {statusType === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />}
          {statusType === 'ERROR' && <XCircle className="w-4 h-4 stroke-[2.5] shrink-0" />}
          {statusType === 'PENDING' && <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />}
          <span>{actionStatus}</span>
        </div>
      )}
    </div>
  );
};
