// src/hooks/useGeoScopeRegistry.js
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_UNIVERSAL_GEO_NODES = gql`
  query GetUniversalGeoNodes($level: String!, $target: String!, $parentIds: [String!]) {
    getUniversalGeoNodes(level: $level, target: $target, parentIds: $parentIds) {
      id
      label
      parentRef
    }
  }
`;

export const useGeoScopeRegistry = (initialLevel = 'DISTRICT', initialTarget = 'CONSTITUENCY', initialParents = []) => {
  const [level, setLevel] = useState(initialLevel);
  const [target, setTarget] = useState(initialTarget);
  const [parentIds, setParentIds] = useState(initialParents); // 🚀 Tracks single or multiple select array nodes dynamically
  const [selectedNodeIds, setSelectedNodeIds] = useState([]); // Array state for multi-select checkboxes on UI

  const { data, loading, error, refetch } = useQuery(GET_UNIVERSAL_GEO_NODES, {
    variables: { level, target, parentIds },
    //fetchPolicy: 'cache-first', // Leverage cloudflare proxy edge matrix RAM for maximum speed
    //context: { uri: '/api' }
  });

  // Re-configure configuration array vectors dynamically without causing layout flashing
  const updateGeoScopeConfiguration = (newLevel, newTarget, newParentsArray = []) => {
    setLevel(newLevel);
    setTarget(newTarget);
    setParentIds(newParentsArray);
    setSelectedNodeIds([]); 
  };

  return {
    geoNodes: data?.getUniversalGeoNodes || [],
    loading,
    error,
    selectedNodeIds,
    setSelectedNodeIds,
    updateGeoScopeConfiguration,
    triggerManualRefresh: refetch
  };
};
