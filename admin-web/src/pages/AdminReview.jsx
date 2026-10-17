// src/pages/AdminReview.jsx
import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// 🚀 1. బ్యాకెండ్ నుండి PENDING (రివ్యూ కోసం ఎదురుచూస్తున్న) ప్లేయర్ల డేటాను లాగే క్వెరీ
const GET_PENDING_PLAYERS = gql`
  query GetPendingPlayers {
    getPendingPlayers {
      id
      name
      phone
      skill
      profilePic
      idCardDocUrl  # 📄 మనం సేకరించిన ఒరిజినల్ ఆధార్/ఐడీ డాక్యుమెంట్ లింక్
      status
      geoScope {
        district
        constituency
      }
    }
  }
`;

// 🚀 2. రివ్యూ తర్వాత స్టేటస్ ని APPROVED లేదా REJECTED గా మార్చే ముటేషన్
const UPDATE_PLAYER_STATUS = gql`
  mutation UpdatePlayerStatus($playerId: ID!, $status: String!) {
    updatePlayerStatus(playerId: $playerId, status: $status)
  }
`;

export const AdminReview = () => {
  const { loading, error, data, refetch } = useQuery(GET_PENDING_PLAYERS, {
    fetchPolicy: 'network-only', // క్యాష్ కాకుండా ఎప్పుడూ డేటాబేస్ నుండి లైవ్ డేటా తెస్తుంది
  });
  
  const [updateStatus] = useMutation(UPDATE_PLAYER_STATUS);
  const [processingId, setProcessingId] = useState(null);
  const [actionMessage, setActionStatus] = useState('');

  // అడ్మిన్ క్లిక్ చేసిన కమాండ్ ని బట్టి రివ్యూ ముగించే ఫంక్షన్
  const handleReviewAction = async (playerId, reviewDecision) => {
    setProcessingId(playerId);
    setActionStatus('');
    try {
      await updateStatus({
        variables: { playerId, status: reviewDecision }
      });
      setActionStatus(`⚡ Success: Player registration has been ${reviewDecision}!`);
      refetch(); // 🔄 లిస్ట్ నుండి ఆ ప్లేయర్ ని తీసేసి టేబుల్ ని ఆటోమేటిక్ గా రీఫ్రెష్ చేస్తుంది
    } catch (err) {
      console.error(err);
      setActionStatus(`❌ Review Failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-center py-12 text-sm text-emerald-400 font-bold animate-pulse">⏳ Loading Pending Registrations Matrix...</div>;
  if (error) return <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-center text-sm">❌ Execution Failed: {error.message}</div>;

  const pendingPlayers = data?.getPendingPlayers || [];

  return (
    <div className="space-y-6">
      
      {/* 🛡️ Header Summary Section */}
      <header className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">🛡️ PSPL Application Review Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">ప్లేయర్ అప్‌లోడ్ చేసిన బయోడేటా, ఫోటో మరియు ఐడీ ప్రూఫ్ ల క్రాస్ వెరిఫికేషన్ స్క్రీన్</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300">
          Pending Reviews Queue: <span className="text-emerald-400 font-black text-sm ml-1">{pendingPlayers.length} Applicants</span>
        </div>
      </header>

      {/* లైవ్ యాక్షన్ నోటిఫికేషన్ అలర్ట్ */}
      {actionMessage && (
        <div className="p-4 bg-slate-900 border border-slate-800 text-emerald-400 text-xs text-center font-bold rounded-xl animate-fade-in shadow-inner">
          {actionMessage}
        </div>
      )}

      {pendingPlayers.length === 0 ? (
        // పెండింగ్ లో అప్లికేషన్లు ఏవీ లేనప్పుడు కనిపించే క్లీన్ వ్యూ
        <div className="bg-slate-900/40 border border-slate-800 p-16 text-center rounded-2xl border-dashed">
          <span className="text-5xl block mb-3">✓</span>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">All Applications Reviewed</h4>
          <p className="text-xs text-slate-500 mt-1">రివ్యూ కోసం ప్రస్తుతానికి ఎలాంటి కొత్త ప్లేయర్ దరఖాస్తులు లేవు. ఫైర్‌వాల్ క్లీన్ గా ఉంది!</p>
        </div>
      ) : (
        // 📋 రివ్యూ చేయాల్సిన ప్లేయర్ల లిస్ట్ టేబుల్ లేఅవుట్
        <div className="space-y-4">
          {pendingPlayers.map((player) => (
            <div 
              key={player.id} 
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-700/60 transition shadow-xl"
            >
              {/* లెఫ్ట్ ఏరియా: ప్రొఫైల్ ఫోటో & బయో డేటా */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start flex-1">
                {/* 📷 ప్రొఫైల్ ఫోటో (వెల్-ఆప్టిమైజ్డ్ వెబ్‌పీ) */}
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-750 overflow-hidden shrink-0 shadow-md">
                  <img src={player.profilePic} alt={player.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                
                {/* వివరాల టెక్స్ట్ ఏరియా */}
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-black text-white uppercase tracking-tight">{player.name}</h4>
                  <p className="text-xs text-slate-400">📞 Phone Vector: <b className="text-slate-200">{player.phone}</b></p>
                  <p className="text-xs text-slate-400">🏏 Primary Role: <span className="text-emerald-400 font-bold">{player.skill}</span></p>
                  <p className="text-xs text-slate-400">📍 constituency: <span className="text-slate-300 font-bold">{player.geoScope.constituency} ({player.geoScope.district})</span></p>
                </div>
              </div>

              {/* మిడిల్ ఏరియా: ఆధార్/ఓటర్ ఐడీ కార్డ్ ఫిజికల్ డాక్యుమెంట్ రివ్యూ ప్రూఫ్ */}
              <div className="w-full lg:max-w-xs bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Submitted Document Proof</span>
                {player.idCardDocUrl ? (
                  <a 
                    href={player.idCardDocUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-black hover:text-emerald-300 underline underline-offset-4 transition"
                  >
                    📄 Open & Review ID Card File ↗
                  </a>
                ) : (
                  <span className="text-xs text-red-400 font-bold">No Document Proof Found</span>
                )}
              </div>

              {/* రైట్ ఏరియా: అడ్మిన్ డెసిషన్ యాక్షన్ కంట్రోల్ బటన్స్ (Reject / Approve) */}
              <div className="flex sm:flex-row gap-2 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-slate-800/60 pt-4 lg:pt-0">
                <button
                  type="button"
                  disabled={processingId === player.id}
                  onClick={() => handleReviewAction(player.id, 'REJECTED')}
                  className="flex-1 lg:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl font-bold text-xs border border-red-500/20 transition disabled:opacity-40 whitespace-nowrap"
                >
                  ❌ Reject Request
                </button>
                <button
                  type="button"
                  disabled={processingId === player.id}
                  onClick={() => handleReviewAction(player.id, 'APPROVED')}
                  className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs transition disabled:opacity-40 shadow-lg whitespace-nowrap"
                >
                  {processingId === player.id ? 'Authorizing...' : '🛡️ Approve Registration'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
