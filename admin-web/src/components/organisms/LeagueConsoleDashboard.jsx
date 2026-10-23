// src/components/organisms/LeagueConsoleDashboard.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeagueConsole } from '../../hooks/useLeagueConsole';
import { LeagueHeroBanner } from '../molecules/LeagueHeroBanner';
import { PoolFilterTabs } from '../molecules/PoolFilterTabs';
import { LeagueEnrolledTeamCard } from '../molecules/LeagueEnrolledTeamCard';
import { LeagueGalleryGrid } from '../molecules/LeagueGalleryGrid';
import { ArrowLeft, Shield, Loader2, AlertCircle, PlusCircle } from 'lucide-react';

export const LeagueConsoleDashboard = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();

  const {
    league,
    pools,
    activePoolTab,
    setActivePoolTab,
    activeViewSection,
    setActiveViewSection,
    enrolledTeams,
    computedTimelineStatus,
    galleryMedia,
    leagueLoading,
    teamsLoading,
    leagueError,
    teamsError
  } = useLeagueConsole(leagueId);

  if (leagueLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Loading League Console...
        </p>
      </div>
    );
  }

  if (leagueError || !league) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold">
          {leagueError?.message || 'League configuration not found'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Top Action Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/leagues-hub')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tournaments Hub</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/enroll-team')}
          className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Enroll Team into League</span>
        </button>
      </div>

      {/* Molecule 1: Hero Banner & Mode Switcher */}
      <LeagueHeroBanner
        league={league}
        poolsCount={pools.length}
        computedTimelineStatus={computedTimelineStatus}
        activeViewSection={activeViewSection}
        onSelectViewSection={setActiveViewSection}
      />

      {/* VIEW 1: POOLS & ENROLLED TEAMS */}
      {activeViewSection === 'POOLS' && (
        <div className="space-y-6">
          {/* Molecule 2: Pool Tabs */}
          <PoolFilterTabs
            pools={pools}
            activePoolTab={activePoolTab}
            onSelectPool={setActivePoolTab}
          />

          {teamsError && (
            <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              Error loading pool teams: {teamsError.message}
            </div>
          )}

          {teamsLoading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-xs font-mono text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span>Loading Pool {activePoolTab} Franchises...</span>
            </div>
          ) : enrolledTeams.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 space-y-3">
              <Shield className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">
                No Clubs Enrolled in Pool {activePoolTab} Yet
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin/enroll-team')}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                + Enroll a Global Team into Pool {activePoolTab}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledTeams.map((team) => (
                <LeagueEnrolledTeamCard
                  key={team.id}
                  team={team}
                  leagueId={league.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LEAGUE GALLERY */}
      {activeViewSection === 'GALLERY' && (
        <LeagueGalleryGrid items={galleryMedia} />
      )}
    </div>
  );
};
