import React from 'react';

export const Home = () => {
  return (
    <div className="space-y-6">
      
      {/* 📺 Top Home Banner Sponsor Ad Slot */}
      <div className="w-full bg-slate-900 border border-slate-800 p-2 rounded-2xl text-center shadow-lg">
        <span className="text-[9px] text-slate-500 font-bold block mb-1 uppercase tracking-widest">PSPL Official Premium Sponsor</span>
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/40 rounded-xl flex items-center justify-center border border-slate-700/50 text-slate-400 font-black text-xl italic tracking-wider">
         <img src="/title_sponser_banner_final.png" className="w-full"/>
        </div>
      </div>

      {/* 📊 Main Split Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 🚀 Left Area: Welcome Dashboard Hero Content (Takes 2 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-800 to-slate-900 p-8 rounded-2xl shadow-xl border border-emerald-500/10">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Welcome to PSPL Season 1</h1>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-slate-700 border border-slate-600 rounded-2xl p-6 relative overflow-hidden"><div class="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none"></div><h3 class="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">✨ <span class="text-purple-400">Dignitaries &amp; Celebrities</span></h3><p class="text-xs text-gray-400 leading-relaxed">The opening ceremony and key weekend fixtures are scheduled to be graced by top-tier **state political leaders** alongside stellar **Tollywood film personalities**. Red carpet presentations, live brand interactive meets, and high-octane stadium entertainment will make it unforgettable.</p></div><div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"><div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div><h3 class="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">💰 <span class="text-amber-400">Bumper Cash Rewards</span></h3><p class="text-xs text-gray-400 leading-relaxed">We are committing to a historic prize spectrum this season! The tournament champion takes home a massive **₹ 5,00,000 Grand Cash Prize**, while the runner-up secures **₹ 2,500,000**. Additional individual financial incentives are reserved for the Player of the Tournament, Best Bowler, and Maximum Sixes awards.</p></div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"><div class="space-y-1"><h4 class="text-sm font-black text-white uppercase tracking-wider">How to Secure a Team Spot:</h4><ul class="text-xs text-gray-400 space-y-1 list-disc list-inside"><li>Navigate to your home Zone panel via the system interface dashboard.</li><li>Select your home district profile card to unlock registration availability.</li><li>Process the dynamic transaction module gate and upload your final 15-player core roster.</li></ul></div><button class="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-[#39FF14] to-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] active:scale-95">Start Team Enrollment Now →</button></div>
          </div>
          <div class="space-y-4">
            <div class="text-center md:text-left">
              <h3 class="text-lg font-black text-white uppercase tracking-wider">
                Governing Council &amp; Core Leadership
              </h3>
              <p class="text-xs text-gray-500">
                The executive board managing regulatory parameters and operational alignment for PSPL.
              </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-[#1c1c1c] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div class="w-full aspect-[3/4] bg-neutral-900 border-b border-gray-800 relative group overflow-hidden flex items-center justify-center">
                <img src="/hp.jpeg" alt="HARI Prasad" class="w-full h-full object-cover"/>
                <div class="hidden absolute inset-0 flex-col justify-center items-center text-center p-4">
                  <span class="text-4xl mb-2 opacity-30">👤</span>
                  <span class="text-[10px] font-mono text-gray-500 bg-black/60 px-2 py-1 rounded border border-gray-800 max-w-[90%] break-all">hp.jpeg</span>
                </div>
              </div>
              <div class="p-3.5 bg-black/40 text-center mt-auto">
                <h4 class="text-sm font-black text-white tracking-wide">HARI Prasad</h4>
                <p class="text-[11px] text-[#39FF14] font-bold uppercase tracking-wider mt-0.5">PDCA President</p>
                </div>
              </div>
              <div class="bg-[#1c1c1c] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div class="w-full aspect-[3/4] bg-neutral-900 border-b border-gray-800 relative group overflow-hidden flex items-center justify-center">
                <img src="/sp.jpeg" alt="Surya Prakash" class="w-full h-full object-cover"/>
                <div class="hidden absolute inset-0 flex-col justify-center items-center text-center p-4">
                  <span class="text-4xl mb-2 opacity-30">👤</span>
                  <span class="text-[10px] font-mono text-gray-500 bg-black/60 px-2 py-1 rounded border border-gray-800 max-w-[90%] break-all">sp.jpeg</span>
                  </div>
                </div>
                <div class="p-3.5 bg-black/40 text-center mt-auto">
                  <h4 class="text-sm font-black text-white tracking-wide">Surya Prakash</h4>
                  <p class="text-[11px] text-[#39FF14] font-bold uppercase tracking-wider mt-0.5">PDCA Vice President</p>
                </div>
              </div>
              <div class="bg-[#1c1c1c] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div class="w-full aspect-[3/4] bg-neutral-900 border-b border-gray-800 relative group overflow-hidden flex items-center justify-center">
                <img src="/bs.jpeg" alt="Bolla Suresh" class="w-full h-full object-cover"/>
                <div class="hidden absolute inset-0 flex-col justify-center items-center text-center p-4">
                  <span class="text-4xl mb-2 opacity-30">👤</span>
                  <span class="text-[10px] font-mono text-gray-500 bg-black/60 px-2 py-1 rounded border border-gray-800 max-w-[90%] break-all">bs.jpeg</span>
                </div>
                </div>
                <div class="p-3.5 bg-black/40 text-center mt-auto">
                <h4 class="text-sm font-black text-white tracking-wide">Bolla Suresh</h4>
                <p class="text-[11px] text-[#39FF14] font-bold uppercase tracking-wider mt-0.5">Legal Advisor</p>
                </div>
                </div>
                <div class="bg-[#1c1c1c] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                  <div class="w-full aspect-[3/4] bg-neutral-900 border-b border-gray-800 relative group overflow-hidden flex items-center justify-center">
                  <img src="/pg.jpeg" alt="Praveen Gali" class="w-full h-full object-cover"/>
                  <div class="hidden absolute inset-0 flex-col justify-center items-center text-center p-4">
                    <span class="text-4xl mb-2 opacity-30">👤</span>
                    <span class="text-[10px] font-mono text-gray-500 bg-black/60 px-2 py-1 rounded border border-gray-800 max-w-[90%] break-all">pg.jpeg</span>
                    </div>
                  </div>
                  <div class="p-3.5 bg-black/40 text-center mt-auto">
                  <h4 class="text-sm font-black text-white tracking-wide">Praveen Gali</h4>
                  <p class="text-[11px] text-[#39FF14] font-bold uppercase tracking-wider mt-0.5">Technical Head</p>
                  </div>
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
          {/* 📺 Right Side Custom Vertical Sponsor Banner */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center h-48 flex flex-col justify-center items-center">
            <span className="text-[9px] text-slate-600 font-bold block mb-2 uppercase">Vertical Side Ad</span>
            <div className="w-full flex-1 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/40 text-slate-500 text-xs font-black italic">
              {/*<span>SIDE BANNER ADS</span> */}
              <iframe width="100%" height="auto" src="https://www.youtube.com/embed/8NsMrErZZPA?list=RD8NsMrErZZPA&autoplay=1" title="TDP Latest Songs 2019 || Chandrababu Naidu | NarasaraoPet | Chadalavada Aravind Babu" frameborder="0" allow="accelerometer; controls; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
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
        </div>

      </div>
    </div>
  );
};
