// src/components/molecules/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from '../atoms/Logo'; 
import { Home, Trophy, Users, Shield, Tv, Megaphone, Sliders, Menu, X, ShieldAlert, FileText } from "lucide-react";

export default function Sidebar({ sideLinkClass }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 1. MOBILE TOP NAVBAR (Visible only on mobile layouts) */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800/60 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center">
            <Logo />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white uppercase block leading-none">
              PSPL NETWORK
            </span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase block mt-0.5">
              Palnadu League
            </span>
          </div>
        </div>

        {/* Hamburger Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800/50 focus:outline-none flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 2. DARK OVERLAY Backdrop for Mobile Drawers */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={closeMenu}
        />
      )}

      {/* 3. MAIN SIDEBAR SYSTEM */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800/60 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out md:static md:h-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
              <Logo />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white uppercase block leading-none">
                PSPL NETWORK
              </span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase block mt-1">
                Palnadu League
              </span>
            </div>
          </div>

          {/* Navigation Links Mapping */}
          <nav className="flex flex-col gap-2">
            <NavLink to="/" onClick={closeMenu} className={sideLinkClass}>
              <Home className="w-4 h-4 shrink-0" />
              <span>Home Overview</span>
            </NavLink>
            <NavLink to="/leagues" onClick={closeMenu} className={sideLinkClass}>
              <Trophy className="w-4 h-4 shrink-0" />
              <span>Public Leagues</span>
            </NavLink>
            <NavLink to="/leagues-hub" onClick={closeMenu} className={sideLinkClass}>
              <Trophy className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Tournaments Hub</span>
            </NavLink>
            
            <div className="h-px bg-slate-800/60 my-2"></div>
            <span className="text-[10px] text-slate-500 font-bold px-4 uppercase tracking-wider block mb-1">
              Console Center
            </span>
            
            <NavLink to="/register-player" onClick={closeMenu} className={sideLinkClass}>
              <Users className="w-4 h-4 shrink-0" />
              <span>Player Registration</span>
            </NavLink>
            <NavLink to="/register-team" onClick={closeMenu} className={sideLinkClass}>
              <Shield className="w-4 h-4 shrink-0" />
              <span>Team Registration</span>
            </NavLink>
            <NavLink to="/admin-review" onClick={closeMenu} className={sideLinkClass}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Review Registrations</span>
            </NavLink>
            <NavLink to="/admin/configure-league" onClick={closeMenu} className={sideLinkClass}>
              <Sliders className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>League Generator</span>
            </NavLink>
            <NavLink to="/admin/enroll-team" onClick={closeMenu} className={sideLinkClass}>
              <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>League Team Enrollment</span>
            </NavLink>

            <div className="h-px bg-slate-800/60 my-2"></div>

            <NavLink to="/live-stream" onClick={closeMenu} className={sideLinkClass}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <Tv className="w-4 h-4 shrink-0" />
                <span>Live Stream Link</span>
              </div>
            </NavLink>
            <NavLink to="/admin-ads" onClick={closeMenu} className={sideLinkClass}>
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>Ads Center</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer inside sidebar */}
        <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-slate-850 bg-slate-900/40 space-y-2 mt-auto">
          <div>
            © {new Date().getFullYear()} <b>Palnadu Street Premier League (PSPL)</b> Network. All rights reserved.
          </div>
          <div className="flex justify-center gap-4 text-[11px] font-medium">
            <NavLink to="/privacy-policy" onClick={closeMenu} className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Privacy Policy & Legal Terms</span>
            </NavLink>
          </div>
        </footer>
      </aside>
    </>
  );
}
