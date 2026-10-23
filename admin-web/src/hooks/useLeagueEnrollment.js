// src/hooks/useLeagueEnrollment.js
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_ACTIVE_LEAGUES = gql`
  query GetActiveLeaguesByScope($scope: String!, $geoId: String!) {
    getActiveLeaguesByScope(scope: $scope, geoId: $geoId) {
      id
      title
      seasonYear
      structureConfiguration {
        activePoolIds
      }
    }
  }
`;

const GET_GLOBAL_TEAMS_BY_POOL = gql`
  query GetGlobalTeamsByConstituency($constituency: String!) {
    getGlobalTeamsByConstituency(constituency: $constituency) {
      id
      teamName
      ownerName
      logoUrl
      playerIds
    }
  }
`;

const ENROLL_TEAM_INTO_LEAGUE = gql`
  mutation EnrollTeamIntoLeague(
    $leagueId: String!
    $teamId: String!
    $poolId: String!
    $squadIds: [String!]!
  ) {
    enrollTeamIntoLeague(
      leagueId: $leagueId
      teamId: $teamId
      poolId: $poolId
      squadIds: $squadIds
    ) {
      id
      teamName
      poolId
    }
  }
`;

export const useLeagueEnrollment = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [selectedPoolId, setSelectedPoolId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [squadIds, setSquadIds] = useState([]);
  
  const [actionStatus, setActionStatus] = useState('');
  const [statusType, setStatusType] = useState('');

  // 1. Fetch active leagues from leagueService
  const { data: leaguesData, loading: leaguesLoading } = useQuery(GET_ACTIVE_LEAGUES, {
    variables: { scope: 'DISTRICT', geoId: 'PAL' }
  });

  const leagues = leaguesData?.getActiveLeaguesByScope || [];
  const activeLeague = leagues.find(l => l.id === selectedLeagueId) || null;
  const availablePools = activeLeague?.structureConfiguration?.activePoolIds || [];

  // 2. Fetch global teams for the selected pool from coreService (/api)
  const { data: teamsData, loading: teamsLoading } = useQuery(GET_GLOBAL_TEAMS_BY_POOL, {
    variables: { constituency: selectedPoolId },
    skip: !selectedPoolId
  });

  const globalTeams = teamsData?.getGlobalTeamsByConstituency || [];

  // 3. Auto-fill squadIds from the Global Team's base playerIds when a team is selected
  useEffect(() => {
    if (selectedTeamId) {
      const chosenTeam = globalTeams.find(t => t.id === selectedTeamId);
      if (chosenTeam && Array.isArray(chosenTeam.playerIds)) {
        setSquadIds(chosenTeam.playerIds);
      } else {
        setSquadIds([]);
      }
    } else {
      setSquadIds([]);
    }
  }, [selectedTeamId, globalTeams]);

  const [enrollTeam, { loading: enrolling }] = useMutation(ENROLL_TEAM_INTO_LEAGUE);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setActionStatus('');
    setStatusType('');

    if (!selectedLeagueId || !selectedPoolId || !selectedTeamId) {
      setStatusType('ERROR');
      setActionStatus('Validation Error: Please select a League, Pool, and Global Club.');
      return;
    }

    try {
      setStatusType('PENDING');
      setActionStatus('Validating player locks and enrolling team into tournament pool...');

      const res = await enrollTeam({
        variables: {
          leagueId: selectedLeagueId,
          teamId: selectedTeamId,
          poolId: selectedPoolId,
          squadIds
        }
      });

      setStatusType('SUCCESS');
      setActionStatus(`Success! "${res.data.enrollTeamIntoLeague.teamName}" is officially locked into Pool ${res.data.enrollTeamIntoLeague.poolId}.`);
      setSelectedTeamId('');
      setSquadIds([]);
    } catch (err) {
      setStatusType('ERROR');
      setActionStatus(err.message);
    }
  };

  return {
    leagues,
    leaguesLoading,
    availablePools,
    globalTeams,
    teamsLoading,
    selectedLeagueId,
    selectedPoolId,
    selectedTeamId,
    squadIds,
    actionStatus,
    statusType,
    enrolling,
    setSelectedLeagueId: (id) => {
      setSelectedLeagueId(id);
      setSelectedPoolId('');
      setSelectedTeamId('');
    },
    setSelectedPoolId: (pool) => {
      setSelectedPoolId(pool);
      setSelectedTeamId('');
    },
    setSelectedTeamId,
    setSquadIds,
    handleEnrollSubmit
  };
};
