// src/hooks/useLeagueConsole.js
import { useState, useEffect, useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_LEAGUE_BY_ID = gql`
  query GetLeagueById($leagueId: ID!) {
    getLeagueById(leagueId: $leagueId) {
      id
      title
      leagueSlug
      seasonYear
      executionScope
      leagueStatus
      targetHorizon {
        startDate
        endDate
        totalDurationDays
      }
      structureConfiguration {
        formatType
        subDivisionsTarget
        activePoolIds
        qualifiersPerPool
      }
    }
  }
`;

const GET_ENROLLED_TEAMS_BY_POOL = gql`
  query GetEnrolledTeamsByLeague($leagueId: String!, $poolId: String) {
    getEnrolledTeamsByLeague(leagueId: $leagueId, poolId: $poolId) {
      id
      leagueId
      teamId
      teamName
      logoUrl
      ownerName
      ownerPhone
      poolId
      squadIds
      stats {
        played
        won
        lost
        points
        nrr
      }
    }
  }
`;

export const useLeagueConsole = (leagueId) => {
  const [activePoolTab, setActivePoolTab] = useState('');
  const [activeViewSection, setActiveViewSection] = useState('POOLS'); // POOLS or GALLERY

  const { data: leagueData, loading: leagueLoading, error: leagueError } = useQuery(GET_LEAGUE_BY_ID, {
    variables: { leagueId },
    skip: !leagueId
  });

  const league = leagueData?.getLeagueById || null;
  const pools = league?.structureConfiguration?.activePoolIds || [];

  // Default to the first pool tab once league metadata loads
  useEffect(() => {
    if (pools.length > 0 && !activePoolTab) {
      setActivePoolTab(pools[0]);
    }
  }, [pools, activePoolTab]);

  // Fetch teams enrolled under the currently active pool tab
  const { data: teamsData, loading: teamsLoading, refetch: refetchTeams } = useQuery(GET_ENROLLED_TEAMS_BY_POOL, {
    variables: { leagueId, poolId: activePoolTab },
    skip: !leagueId || !activePoolTab
  });

  // Compute real-time timeline badge: UPCOMING, LIVE, or PAST
  const computedTimelineStatus = useMemo(() => {
    if (!league?.targetHorizon) return 'UPCOMING';
    const now = new Date().getTime();
    const start = new Date(league.targetHorizon.startDate).getTime();
    const end = new Date(league.targetHorizon.endDate).getTime();

    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'LIVE';
    return 'PAST';
  }, [league]);

  // Curated League Media Gallery items (Expandable via collection later)
  const galleryMedia = [
    { id: '1', title: 'Opening Ceremony & Trophy Reveal', category: 'HIGHLIGHT', imageUrl: 'https://unsplash.com' },
    { id: '2', title: 'Floodlight Arena Pitch Inspection', category: 'STADIUM', imageUrl: 'https://unsplash.com' },
    { id: '3', title: 'Franchise Owners Draft Meet', category: 'AUCTION', imageUrl: 'https://unsplash.com' }
  ];

  return {
    league,
    pools,
    activePoolTab,
    setActivePoolTab,
    activeViewSection,
    setActiveViewSection,
    enrolledTeams: teamsData?.getEnrolledTeamsByLeague || [],
    computedTimelineStatus,
    galleryMedia,
    leagueLoading,
    teamsLoading,
    leagueError,
    refetchTeams
  };
};
