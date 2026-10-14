import React from 'react';

export const Home = () => {
  return (
    <div className="space-y-6">
      
      {/* 📺 Top Home Banner Sponsor Ad Slot */}
      <div className="w-full bg-slate-900 border border-slate-800 p-2 rounded-2xl text-center shadow-lg">
        <span className="text-[9px] text-slate-500 font-bold block mb-1 uppercase tracking-widest">GDCL / PSPL Official Premium Sponsor</span>
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-800/40 rounded-xl flex items-center justify-center border border-slate-700/50 text-slate-400 font-black text-xl italic tracking-wider">
         <img src="/pspl-main-banner.png"/>
        </div>
      </div>

      {/* 📊 Main Split Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 🚀 Left Area: Welcome Dashboard Hero Content (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-800 to-slate-900 p-8 rounded-2xl shadow-xl border border-emerald-500/10">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">🔥 Palnadu Street Premier League</h1>
            <p className="text-emerald-300 font-bold text-xs mt-1 uppercase tracking-wider">The Ultimate Local Street Cricket Carnival</p>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">పల్నాడు వీధుల్లో ఉన్న నిజమైన సిక్సర్ కింగ్స్ మరియు యార్కర్ స్పెషలిస్ట్‌లను వెలికితీసే గ్రాండ్ క్రికెట్ ఫెస్టివల్. మీ నియోజకవర్గం, మీ జట్టు, మీ గెలుపు!</p>
            
            <div className="mt-6 inline-flex bg-slate-950/50 px-5 py-2.5 rounded-xl border border-white/5 gap-4">
              <div className="text-center border-r border-slate-800 pr-4">
                <span className="text-[10px] text-emerald-400 block font-bold">TALENT POOL</span>
                <span className="text-lg font-black text-white">450+ Players</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-emerald-400 block font-bold">FRANCHISES</span>
                <span className="text-lg font-black text-white">16 Teams</span>
              </div>
            </div>
          </div>

          {/* 📺 Content Area Under-Hero Sponsor Banner */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-center h-20 text-slate-500 text-xs font-bold uppercase border-dashed">
            🤝 Inline Sponsor Placement Slot
          </div>
        </div>

        {/* 🔔 Right Area: Right-Aligned Mini Important Updates Section */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
            <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Live Updates
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Breaking</span>
                <p className="text-xs text-slate-300 mt-0.5">PSPL టోర్నమెంట్ అఫీషియల్ షెడ్యూల్ ఈ వారం విడుదల కానుంది.</p>
              </div>
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Updates</span>
                <p className="text-xs text-slate-300 mt-0.5">ఆక్షన్ పూల్ లోకి కొత్తగా 50 మంది లోకల్ ప్లేయర్స్ యాడ్ అయ్యారు.</p>
              </div>
            </div>
          </div>

          {/* 📺 Right Side Custom Vertical Sponsor Banner */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center h-48 flex flex-col justify-center items-center">
            <span className="text-[9px] text-slate-600 font-bold block mb-2 uppercase">Vertical Side Ad</span>
            <div className="w-full flex-1 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/40 text-slate-500 text-xs font-black italic">
              SIDE BANNER ADS
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
