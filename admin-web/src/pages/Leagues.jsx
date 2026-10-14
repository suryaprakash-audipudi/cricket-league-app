import React, { useState } from 'react';
//import { gql, useQuery } from '@apollo/client';

export const Leagues = () => {
  const [selectedConstituency, setSelectedConstituency] = useState('NRT');

  // నియోజకవర్గాల లిస్ట్ (డమ్మీ డేటా - భవిష్యత్తులో డేటాబేస్ నుండి వస్తుంది)
  const constituencies = [
    { code: 'NRT', name: 'Narasaraopeta' },
    { code: 'GNT', name: 'Guntur West' },
    { code: 'TEN', name: 'Tenali' },
    { code: 'SAT', name: 'Sattenapalle' }
  ];

  // ఇక్కడ భవిష్యత్తులో మనం రాసిన getGlobalTeams క్వెరీ రన్ అవుతుంది
  const teamsInConstituency = [
    { id: "t1", teamName: "NRT Warriors", owner: "Ravi Kumar", logo: "🛡️" },
    { id: "t2", teamName: "Palnadu Tigers", owner: "Siva Reddy", logo: "🐯" }
  ];

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

      {/* 🛡️ Registered Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teamsInConstituency.map((team) => (
          <div key={team.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-emerald-500/40 transition group cursor-pointer shadow-lg">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition duration-150">
              {team.logo}
            </div>
            <div>
              <h4 className="font-bold text-white group-hover:text-emerald-400 transition">{team.teamName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Franchise Owner: {team.owner}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
