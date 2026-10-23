// src/hooks/useLeagueTeamRoster.js
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_LEAGUE_TEAM_DETAILS = gql`
  query GetLeagueTeamDetails($leagueId: String!, $teamId: String!) {
    getLeagueTeamDetails(leagueId: $leagueId, teamId: $teamId) {
      enrollment {
        id
        leagueId
        teamId
        teamName
        logoUrl
        ownerName
        ownerPhone
        poolId
        stats {
          played
          won
          lost
          points
          nrr
        }
      }
      leagueSquadPlayers {
        id
        username
        name
        skill
        profilePic
      }
      otherGlobalPlayers {
        id
        username
        name
        skill
        profilePic
      }
    }
  }
`;

export const useLeagueTeamRoster = (leagueId, teamId) => {
  const { data, loading, error, refetch } = useQuery(GET_LEAGUE_TEAM_DETAILS, {
    variables: {
      leagueId: String(leagueId || ''),
      teamId: String(teamId || '')
    },
    skip: !leagueId || !teamId
  });

  return {
    enrollment: data?.getLeagueTeamDetails?.enrollment || null,
    leagueSquadPlayers: data?.getLeagueTeamDetails?.leagueSquadPlayers || [],
    otherGlobalPlayers: data?.getLeagueTeamDetails?.otherGlobalPlayers || [],
    loading,
    error,
    refetchRoster: refetch
  };
};
