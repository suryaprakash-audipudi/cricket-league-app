// src/components/molecules/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  // యాక్టివ్ లింక్ ని బట్టి కలర్ మారే స్టైల్ క్లాస్ (Tailwind v4)
  const linkClass = ({ isActive }) => 
    `px-4 py-2.5 text-sm font-bold rounded-lg transition duration-150 text-center flex-1 md:flex-none ${
      isActive ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700'
    }`;

  return (
    <nav className="flex flex-wrap gap-3 justify-center mb-8 w-full">
      <NavLink to="/players" className={linkClass}>
        🏃‍♂️ Player Management
      </NavLink>
      <NavLink to="/sponsors" className={linkClass}>
        📢 Sponsor Ads Network
      </NavLink>
      <NavLink to="/teams" className={linkClass}>
  🛡️ Team Registration
</NavLink>
    </nav>
  );
};
