// src/components/organisms/PlayerForm.jsx
import React from 'react';
import { usePlayerRegistration } from '../../hooks/usePlayerRegistration';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';
import { ImageUploadZone } from '../molecules/ImageUploadZone';
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const PlayerForm = () => {
  const {
    username, usernameStatus, name, phone, idNumber, skill, geoLevel, constituency, actionStatus,
    setName, setPhone, setIdNumber, setSkill, setSelectedFile, setIdDocFile, setGeoLevel, setConstituency,
    handleUsernameChange, handleVerifyAndRegister
  } = usePlayerRegistration();

  return (
    <div className="space-y-6">
      <form onSubmit={handleVerifyAndRegister} className="space-y-6">
        
        {/* Username Validation Field Component */}
        <div>
          <Input 
            label="Create Exclusive PSPL Username (Optional)" 
            value={username} 
            onChange={(e) => handleUsernameChange(e.target.value)} 
            placeholder="e.g. surya4256 or leave blank" 
          />
          {usernameStatus && (
            <div className={`flex items-center gap-2 text-[11px] font-bold mt-1.5 px-1 tracking-wide transition duration-150 ${
              usernameStatus === 'AVAILABLE' ? 'text-emerald-400' : 
              usernameStatus === 'TAKEN' || usernameStatus === 'INVALID_CHARS' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {usernameStatus === 'MIN_LENGTH' && <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
              {usernameStatus === 'INVALID_CHARS' && <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
              {usernameStatus === 'CHECKING' && <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />}
              {usernameStatus === 'AVAILABLE' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
              {usernameStatus === 'TAKEN' && <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
              {usernameStatus === 'SERVER_ERROR' && <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />}

              <span>
                {usernameStatus === 'MIN_LENGTH' && 'Minimum 3 characters required.'}
                {usernameStatus === 'INVALID_CHARS' && 'Only lowercase alphanumeric characters allowed.'}
                {usernameStatus === 'CHECKING' && 'Scanning pool registry for availability...'}
                {usernameStatus === 'AVAILABLE' && 'Certified Success! Unique Username Available.'}
                {usernameStatus === 'TAKEN' && 'Error: This username is already secured by another athlete.'}
                {usernameStatus === 'SERVER_ERROR' && 'Server validation skipped.'}
              </span>
            </div>
          )}
        </div>

        <Input label="Player Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sachin" />
        <Input label="Mobile (With Country Code)" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +919000403288" />
        <Input label="Government ID Card Number (Aadhaar / Voter ID)" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter ID number for duplicate screening" />
        
        <ImageUploadZone label="Player Profile Photo" onFileReady={(file) => setSelectedFile(file)} />
        <ImageUploadZone label="Player ID Card" shouldCompress={false} type={"ID"} onFileReady={(file) => setIdDocFile(file)} />
        
        <Select label="Player Primary Skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={[{value:'BATSMAN', label:'Batsman'}, {value:'BOWLER', label:'Bowler'}]} />
        <GeoZone geoLevel={geoLevel} setGeoLevel={setGeoLevel} constituency={constituency} setConstituency={setConstituency} />
        
        {/* Legal Consent Checkbox */}
        <div className="flex items-start gap-3 bg-slate-800/20 p-4 rounded-xl border border-slate-800 my-2">
          <input type="checkbox" required id="legalConsent" className="mt-1 w-4 h-4 text-emerald-500 bg-slate-900 border-slate-750 rounded focus:ring-emerald-500 cursor-pointer" />
          <label htmlFor="legalConsent" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
            I voluntary agree to let PSPL encrypt and verify my identity credentials for duplicate prevention.
          </label>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 transition">
          Submit Registration Application
        </button>
      </form>

      {actionStatus && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-center font-semibold text-slate-200">
          {actionStatus}
        </div>
      )}
    </div>
  );
};
