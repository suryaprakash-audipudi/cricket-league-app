// src/hooks/useGlobalTeamRegistration.js
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useMediaUploader } from './useMediaUploader';

const CREATE_GLOBAL_TEAM = gql`
  mutation CreateGlobalTeam(
    $teamName: String!
    $ownerName: String!
    $ownerPhone: String!
    $ownerEmail: String
    $logoUrl: String!
    $playerIds: [String]!
    $country: String!
    $state: String!
    $district: String!
    $constituency: String!
  ) {
    createGlobalTeam(
      teamName: $teamName
      ownerName: $ownerName
      ownerPhone: $ownerPhone
      ownerEmail: $ownerEmail
      logoUrl: $logoUrl
      playerIds: $playerIds
      country: $country
      state: $state
      district: $district
      constituency: $constituency
    ) {
      id
      teamName
    }
  }
`;

export const useGlobalTeamRegistration = () => {
  const [teamName, setTeamName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [playerIds, setPlayerIds] = useState([]);

  const [geoLevel, setGeoLevel] = useState('DISTRICT');
  const [constituency, setConstituency] = useState('NRT');
  const [actionStatus, setActionStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // SUCCESS, ERROR, PENDING

  const [createTeam, { loading }] = useMutation(CREATE_GLOBAL_TEAM);
  const { uploadToCloud } = useMediaUploader();

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    setActionStatus('');
    setStatusType('');

    if (!ownerPhone.startsWith('+91') || ownerPhone.trim().length < 13) {
      setStatusType('ERROR');
      setActionStatus('Error: Owner mobile number must include +91 country code.');
      return;
    }
    if (!logoFile) {
      setStatusType('ERROR');
      setActionStatus('Media check required: Please upload an official team logo asset.');
      return;
    }

    try {
      setStatusType('PENDING');
      setActionStatus('Encrypting team logo canvas and routing through Cloudflare reverse proxy...');
      const cachedLogoUrl = await uploadToCloud(logoFile, 'team_logos', 'logo');

      if (!cachedLogoUrl) {
        throw new Error('Cloud storage handshake failed to return asset target link');
      }

      setActionStatus('Routing serialized registry payload directly to GraphQL firewall...');
      const res = await createTeam({
        variables: {
          teamName: teamName.trim(),
          ownerName: ownerName.trim(),
          ownerPhone: ownerPhone.trim(),
          ownerEmail: ownerEmail.trim().length > 0 ? ownerEmail.trim().toLowerCase() : null,
          logoUrl: cachedLogoUrl,
          playerIds,
          country: 'IN',
          state: 'AP',
          district: 'PAL',
          constituency: constituency.toUpperCase()
        }
      });

      setStatusType('SUCCESS');
      setActionStatus('Certified Success! Club "' + res.data.createGlobalTeam.teamName + '" is permanently secured inside PSPL Global Pool Registry.');

      // Clear all field states clean upon successful resolution
      setTeamName('');
      setOwnerName('');
      setOwnerPhone('');
      setOwnerEmail('');
      setLogoFile(null);
      setPlayerIds([]);
    } catch (err) {
      console.error(err);
      setStatusType('ERROR');
      if (err.message.includes('REGISTRY_REJECTION')) {
        setActionStatus('Registration Aborted: This mobile number is already tied to another active franchise owner node!');
      } else {
        setActionStatus('Server Exception Refusal: ' + err.message);
      }
    }
  };

  return {
    teamName, ownerName, ownerPhone, ownerEmail, playerIds, geoLevel, constituency, actionStatus, statusType, loading,
    setTeamName, setOwnerName, setOwnerPhone, setOwnerEmail, setPlayerIds, setGeoLevel, setConstituency, setLogoFile,
    handleRegisterTeam
  };
};
