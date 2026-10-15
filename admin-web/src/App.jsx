// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Leagues } from './pages/Leagues';
import { PlayerForm } from './components/organisms/PlayerForm';
import { TeamForm } from './components/organisms/TeamsForm';
import { SponsorForm } from './components/organisms/SponsorForm';
import Sidebar from './components/molecules/Sidebar';

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
        <Sidebar sideLinkClass={sideLinkClass}/>

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
