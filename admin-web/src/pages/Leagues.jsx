import React, { useMemo, useState } from 'react';
//import { gql, useQuery } from '@apollo/client';

export const Leagues = () => {
  const [selectedConstituency, setSelectedConstituency] = useState('NRT');

  // నియోజకవర్గాల లిస్ట్ (డమ్మీ డేటా - భవిష్యత్తులో డేటాబేస్ నుండి వస్తుంది)
  const constituencies = [
    { code: 'NRT', name: 'Narasaraopeta', teams:  [
    { id: "t1", teamName: "Maruthi Sports XI", owner: "Anil Kumar", logo: "🛡️" },
    { id: "t2", teamName: "Akhil XI", owner: "Hari Prasad", logo: "🐯" }
  ]},
    { code: 'CPT', name: 'Chilakaluripeta', teams:  [
    { id: "t3", teamName: "Manoj Cricket Club(MCC)", owner: "Manoj", logo: "🛡️" },
  ] },
    { code: 'VNK', name: 'Vinukonda', teams:  [
    { id: "t4", teamName: "Vinkonda royals", owner: "Jani Basha", logo: "🛡️" }
  ] },
    { code: 'SAT', name: 'Sattenapalle', teams:  [
    { id: "t5", teamName: "Hanuman Royals", owner: "Gampa Srinu", logo: "🛡️" }
  ] },
    { code: 'MCL', name: 'Macherla', teams:  [
    { id: "t6", teamName: "Maruthi Youth", owner: "Maruthi Reddy", logo: "🛡️" },
  ]},
    { code: 'PKPD', name: 'Pedakurapadu', teams:  [
    { id: "t7", teamName: "Praveen CC", owner: "Praveen", logo: "🛡️" },
  ] },
    { code: 'GZL', name: 'Gurazala', teams:  [
    { id: "t8", teamName: "Gurazala XI", owner: "Raj Kumar", logo: "🛡️" },
  ] },

  ];

  // ఇక్కడ భవిష్యత్తులో మనం రాసిన getGlobalTeams క్వెరీ రన్ అవుతుంది
  const teamsInConstituency = useMemo(()=>{
    const constituency =  constituencies.filter(({code})=>code === selectedConstituency);
    if(constituency.length) return constituency[0]?.teams;
    return [];
},[selectedConstituency]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-black text-emerald-400">🏆 Regional League Center</h2>
        <p className="text-xs text-slate-400 mt-1">నియోజకవర్గాల వారీగా రిజిస్టర్ అయిన జట్ల వివరాలు</p>
      </header>

      {/* 🌍 Constituency Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {constituencies.map((con) => (
          <button
            key={con.code}
            onClick={() => setSelectedConstituency(con.code)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-150 whitespace-nowrap ${
              selectedConstituency === con.code 
                ? 'bg-emerald-500 text-slate-950 font-black' 
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {con.name} ({con.code})
          </button>
        ))}
      </div>


{/* 📊 ప్రధాన గ్రిడ్ కంటైనర్ - ఐటమ్స్ సర్దుబాటు కోసం flex-col మరియు lg:grid ని కలిపి వాడుతున్నాం */}
<div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 items-start">
  
  {/* 📢 1. స్పాన్సర్ యాడ్స్ ప్యానెల్ (మొబైల్‌లో ఇది మొదట వస్తుంది, పెద్ద స్క్రీన్స్‌లో 3వ కాలమ్ కి వెళ్తుంది) */}
  <div className="w-full order-first lg:order-last lg:col-span-1 space-y-4">
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center shadow-xl">
      <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase tracking-widest">
        Constituency Sponsor
      </span>
      
      {/* 💎 వర్టికల్ బ్యానర్ స్లాట్ (మొబైల్ లో నీట్‌గా ఫిట్ అవ్వడానికి w-full ఇచ్చాం) */}
      <div className="h-48 lg:h-64 bg-gradient-to-r lg:bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg flex flex-col items-center justify-center border border-slate-700/50 p-4 gap-2">
        <span className="text-2xl animate-bounce">📢</span>
        <span className="text-xs font-black tracking-wider text-slate-400 italic">
          PSPL OFFICAL PREMIUM SPONSOR AD
        </span>
        <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto hidden sm:block lg:block">
          Contact PSPL Admin to place your business banner here.
        </p>
      </div>
    </div>
  </div>

  {/* 🛡️ 2. రిజిస్టర్డ్ జట్ల గ్రిడ్ (మొబైల్‌లో యాడ్ కింద వస్తుంది, పెద్ద స్క్రీన్స్‌లో 2 కాలమ్స్ స్పేస్ తీసుకుంటుంది) */}
  <div className="w-full lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {teamsInConstituency?.map((team) => (
      <div 
        key={team.id} 
        className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-emerald-500/40 transition group cursor-pointer shadow-lg"
      >
        {/* టీమ్ లోగో */}
        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition duration-150 overflow-hidden">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.teamName} className="w-full h-full object-cover" />
          ) : (
            <span>🛡️</span>
          )}
        </div>
        
        <div>
          <h4 className="font-bold text-white group-hover:text-emerald-400 transition">
            {team.teamName}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Franchise Owner: {team.ownerId || 'Premium Franchise'}
          </p>
        </div>
      </div>
    ))}
  </div>

</div>


    </div>
  );
};
