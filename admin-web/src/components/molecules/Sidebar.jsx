import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from '../atoms/Logo'; // SVG లోగో ఇంపోర్ట్

// మీ Logo ఇంపోర్ట్ ఇక్కడ ఉండాలి

export default function Sidebar({ sideLinkClass }) {
  // మెనూ ఓపెన్/క్లోజ్ కంట్రోల్ చేయడానికి State
  const [isOpen, setIsOpen] = useState(false);

  // మొబైల్‌లో ఏదైనా లింక్ క్లిక్ చేయగానే మెనూ ఆటోమేటిక్‌గా క్లోజ్ అవ్వడానికి
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 1. MOBILE TOP NAVBAR (కేవలం మొబైల్‌లో మాత్రమే కనిపిస్తుంది - md:hidden) */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800/60 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center [&>*]:w-full [&>*]:h-full [&>*]:object-contain">
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

        {/* Hamburger / Close Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800/50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            // Close Icon (X)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon (☰)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 2. DARK OVERLAY (మొబైల్‌లో మెనూ ఓపెన్ అయినప్పుడు వెనుక బ్యాక్‌గ్రౌండ్ డిమ్ అవ్వడానికి) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={closeMenu}
        />
      )}

      {/* 3. MAIN SIDEBAR (మొబైల్‌లో Slide-over లాగా, డెస్క్‌టాప్‌లో సాధారణ సైడ్‌బార్ లాగా ఉంటుంది) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800/60 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out md:static md:h-auto md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo Header inside Sidebar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-2 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center [&>*]:w-full [&>*]:h-full [&>*]:object-contain">
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

          {/* Sidebar Routes Links */}
          <nav className="flex flex-col gap-2">
            <NavLink to="/" onClick={closeMenu} className={sideLinkClass}>
              🏠 Home
            </NavLink>
            <NavLink to="/leagues" onClick={closeMenu} className={sideLinkClass}>
              🏆 Leagues
            </NavLink>
            
            <div className="h-px bg-slate-800/60 my-2"></div>
            <span className="text-[10px] text-slate-500 font-bold px-4 uppercase tracking-wider">
              Console Center
            </span>
            
            <NavLink to="/register-player" onClick={closeMenu} className={sideLinkClass}>
              🏃 Player Registration
            </NavLink>
            <NavLink to="/register-team" onClick={closeMenu} className={sideLinkClass}>
              🛡️ Team Registration
            </NavLink>
            <NavLink to="/admin-review" onClick={closeMenu} className={sideLinkClass}>🛡️ Review Registrations</NavLink>

            <NavLink to="/live-stream" onClick={closeMenu} className={sideLinkClass}>
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span><span>Live Stream Link</span>
            </NavLink>
            <NavLink to="/admin-ads" onClick={closeMenu} className={sideLinkClass}>
              📢 Ads Center
            </NavLink>
          </nav>
        </div>

        {/* Footer inside sidebar */}
        <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-slate-900 bg-slate-900/40 space-y-2 mt-auto">
            <div>
              © {new Date().getFullYear()} <b>Palnadu Street Premier League (PSPL)</b> Network. All rights reserved.
            </div>
            <div className="flex justify-center gap-4 text-[11px] font-medium">
              <NavLink to="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition underline decoration-slate-700 underline-offset-4">
                🔒 Privacy Policy & Legal Consent Terms
              </NavLink>
            </div>
          </footer>
      </aside>
    </>
  );
}