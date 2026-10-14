// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Logo } from './components/atoms/Logo'; // SVG లోగో ఇంపోర్ట్
import { Home } from './pages/Home';
import { Leagues } from './pages/Leagues';
import { PlayerForm } from './components/organisms/PlayerForm';
import { TeamForm } from './components/organisms/TeamsForm';
import { SponsorForm } from './components/organisms/SponsorForm';

function App() {
  const sideLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition duration-150 border ${
      isActive 
        ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-black shadow-lg shadow-emerald-500/10' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 bg-transparent border-transparent'
    }`;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
        
        {/* 🔲 1. Modern Left Side Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800/60 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo Header */}
            <div className="flex items-center gap-3 px-2">
              <Logo className="w-10 h-10" />
              <div>
                <span className="text-base font-black tracking-tight text-white uppercase block leading-none">PSPL NETWORK</span>
                <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Palnadu League</span>
              </div>
            </div>
            
            {/* Sidebar Routes Links */}
            <nav className="flex flex-col gap-2">
              <NavLink to="/" className={sideLinkClass}>🏠 Home Portal</NavLink>
              <NavLink to="/leagues" className={sideLinkClass}>🏆 Leagues Info</NavLink>
              <div className="h-px bg-slate-800/60 my-2"></div>
              <span className="text-[10px] text-slate-500 font-bold px-4 uppercase tracking-wider">Console Center</span>
              <NavLink to="/register-player" className={sideLinkClass}>🏃 Player Register</NavLink>
              <NavLink to="/register-team" className={sideLinkClass}>🛡️ Team Register</NavLink>
              <NavLink to="/admin-ads" className={sideLinkClass}>📢 Ads Center</NavLink>
            </nav>
          </div>

          {/* Footer inside sidebar */}
          <div className="text-[10px] text-slate-600 px-2 mt-6">
            © 2026 PSPL Platform. v4 Serverless.
          </div>
        </aside>

        {/* 📺 2. Right Canvas: Main Content Scrollable View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 w-full mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/register-player" element={<PlayerForm />} />
            <Route path="/register-team" element={<TeamForm />} />
            <Route path="/admin-ads" element={<SponsorForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
