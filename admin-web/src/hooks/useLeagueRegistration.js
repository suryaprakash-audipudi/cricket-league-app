// src/hooks/useLeagueRegistration.js
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const CREATE_LEAGUE = gql`
  mutation CreateLeagueConfiguration(
    $title: String!
    $seasonYear: Int!
    $executionScope: String!
    $parentGeoIds: [String!]!
    $startDate: String!
    $endDate: String!
    $formatType: String!
    $subDivisionsTarget: String!
    $activePoolIds: [String!]!
    $qualifiersPerPool: Int!
    $superFourEnabled: Boolean!
    $semisCount: Int!
    $finalsCount: Int!
  ) {
    createLeagueConfiguration(
      title: $title
      seasonYear: $seasonYear
      executionScope: $executionScope
      parentGeoIds: $parentGeoIds
      startDate: $startDate
      endDate: $endDate
      formatType: $formatType
      subDivisionsTarget: $subDivisionsTarget
      activePoolIds: $activePoolIds
      qualifiersPerPool: $qualifiersPerPool
      superFourEnabled: $superFourEnabled
      semisCount: $semisCount
      finalsCount: $finalsCount
    ) {
      id
      title
      leagueStatus
    }
  }
`;

export const useLeagueRegistration = () => {
  const [title, setTitle] = useState('');
  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());
  const [executionScope, setExecutionScope] = useState('DISTRICT');
  const [parentGeoIds, setParentGeoIds] = useState(['PAL']); // Default locked across Guntur sector
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [formatType, setFormatType] = useState('STAGED_POOLS');
  const [subDivisionsTarget, setSubDivisionsTarget] = useState('CONSTITUENCY');
  const [activePoolIds, setActivePoolIds] = useState([]);
  const [qualifiersPerPool, setQualifiersPerPool] = useState(2);
  const [superFourEnabled, setSuperFourEnabled] = useState(false);
  const [semisCount, setSemisCount] = useState(4);
  const [finalsCount, setFinalsCount] = useState(2);

  const [actionStatus, setActionStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // SUCCESS, ERROR, PENDING

  const [mutateLeague, { loading }] = useMutation(CREATE_LEAGUE, {
    context: { serviceTarget: "LEAGUES" } // 🚀 Direct routing override to hit our isolated microservice function tunnel
  });

  const handlePoolToggle = (poolId) => {
    if (activePoolIds.includes(poolId)) {
      setActivePoolIds(activePoolIds.filter(id => id !== poolId));
    } else {
      setActivePoolIds([...activePoolIds, poolId]);
    }
  };

  const handleRegisterLeague = async (e) => {
    e.preventDefault();
    setActionStatus('');
    setStatusType('');

    if (activePoolIds.length === 0) {
      setStatusType('ERROR');
      setActionStatus('Configuration Error: At least one active divisional pool node must be checked.');
      return;
    }

    try {
      setStatusType('PENDING');
      setActionStatus('Compiling structural tournament matrix components and deploying target horizon days...');

      const res = await mutateLeague({
        variables: {
          title: title.trim(),
          seasonYear: parseInt(seasonYear),
          executionScope,
          parentGeoIds,
          startDate,
          endDate,
          formatType,
          subDivisionsTarget,
          activePoolIds,
          qualifiersPerPool: parseInt(qualifiersPerPool),
          superFourEnabled,
          semisCount: parseInt(semisCount),
          finalsCount: parseInt(finalsCount)
        }
      });

      setStatusType('SUCCESS');
      setActionStatus('Certified Success! Dynamic tournament architecture "' + res.data.createLeagueConfiguration.title + '" deployed safely to cloud servers.');
      
      // Flush form properties upon successful persistence
      setTitle('');
      setStartDate('');
      setEndDate('');
      setActivePoolIds([]);
    } catch (err) {
      console.error(err);
      setStatusType('ERROR');
      setActionStatus('Framework Deployment Aborted: ' + err.message);
    }
  };

  return {
    title, seasonYear, executionScope, parentGeoIds, startDate, endDate, formatType, subDivisionsTarget, activePoolIds, qualifiersPerPool, superFourEnabled, semisCount, finalsCount, actionStatus, statusType, loading,
    setTitle, setSeasonYear, setExecutionScope, setParentGeoIds, setStartDate, setEndDate, setFormatType, setSubDivisionsTarget, setQualifiersPerPool, setSuperFourEnabled, setSemisCount, setFinalsCount,
    handlePoolToggle, handleRegisterLeague
  };
};
