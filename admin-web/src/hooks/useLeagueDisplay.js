// src/hooks/useLeagueDisplay.js
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_ACTIVE_LEAGUES = gql`
  query GetActiveLeaguesByScope($scope: String!, $geoId: String!) {
    getActiveLeaguesByScope(scope: $scope, geoId: $geoId) {
      id
      title
      leagueSlug
      seasonYear
      executionScope
      parentGeoIds
      leagueStatus
      createdAt
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

export const useLeagueDisplay = (targetScope = 'DISTRICT', targetGeoId = 'GNT') => {
  // Trigger cache-first query execution routed dynamically into the independent league microservice node
  const { data, loading, error, refetch } = useQuery(GET_ACTIVE_LEAGUES, {
    variables: { scope: targetScope, geoId: targetGeoId },
    context: { serviceTarget: "LEAGUES" },
   // fetchPolicy: 'cache-first'
  });

  return {
    leagues: data?.getActiveLeaguesByScope || [],
    loading,
    error,
    triggerManualRefresh: refetch
  };
};
