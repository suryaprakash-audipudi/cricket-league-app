// src/components/organisms/PlayerForm.jsx
import React from 'react';
import { usePlayerRegistration } from '../../hooks/usePlayerRegistration'; // 🚀 మన కొత్త కస్టమ్ లాజిక్ హుక్
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { GeoZone } from '../molecules/GeoZone';
import { ImageUploadZone } from '../molecules/ImageUploadZone';
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'; // 🚀 ప్యూర్ వెెక్టర్ ఐకాన్స్

export const PlayerForm = () => {
  const {
    username, usernameStatus, name, phone, idNumber, otp, skill, geoLevel, constituency, isOtpSent, actionStatus,
    setName, setPhone, setIdNumber, setOtp, setSkill, setSelectedFile, setIdDocFile, setGeoLevel, setConstituency,
    handleUsernameChange, handleSendOtp, handleVerifyAndRegister, setIsOtpSent
  } = usePlayerRegistration();

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>

      {!isOtpSent ? (
        // --- ఫేజ్ 1: ప్రొఫైల్ వివరాలు మరియు ఐడీ ఎంట్రీ స్క్రీన్ ---
        <form onSubmit={handleSendOtp} className="space-y-6">
          
          {/* 🛡️ మోడ్రన్ యూజర్ నేమ్ వాలిడేషన్ జోన్ (0% Emojis - Vector Base) */}
          <div>
            <Input 
              label="Create Exclusive PSPL Username" 
              required 
              value={username} 
              onChange={(e) => handleUsernameChange(e.target.value)} 
              placeholder="abc123" 
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
                  {usernameStatus === 'INVALID_CHARS' && 'Only lower case alphanumeric letters and underscores (_) allowed.'}
                  {usernameStatus === 'CHECKING' && 'Scanning pool registry for availability...'}
                  {usernameStatus === 'AVAILABLE' && 'Username is available.'}
                  {usernameStatus === 'TAKEN' && 'This username is already secured by another player.'}
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
        // --- ఫేజ్ 2: ఓటీపీ వెరిఫికేషన్ స్క్రీన్ ---
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
