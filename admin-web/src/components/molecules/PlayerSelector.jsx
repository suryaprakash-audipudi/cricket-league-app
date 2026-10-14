// src/components/molecules/PlayerSelector.jsx
import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Select from 'react-select';

const GET_GLOBAL_PLAYERS = gql`
  query GetGlobalPlayers {
    getGlobalPlayers {
      id
      name
      phone
    }
  }
`;

export const PlayerSelector = ({ selectedPlayers, setSelectedPlayers }) => {
  const { data, loading, error } = useQuery(GET_GLOBAL_PLAYERS);

  if (error) return <div className="text-red-400 text-xs">❌ Error loading talent pool: {error.message}</div>;

  const options = data?.getGlobalPlayers?.map(player => ({
    value: player.id,
    label: `${player.name} (${player.phone})`
  })) || [];

  const handleChange = (selectedOptions) => {
    setSelectedPlayers(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
  };

  // --- 🚀 Chips ని మరింత బ్యూటిఫుల్ గా మార్చడానికి Tailwind v4 బేస్డ్ CSS Styles ---
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: '#1e293b', // bg-slate-800
      borderColor: state.isFocused ? '#10b981' : '#334155', // focused అయితే emerald-500
      padding: '4px',
      borderRadius: '12px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#475569',
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#0f172a', // bg-slate-900 (డ్రాప్‌డౌన్ లిస్ట్ బ్యాక్‌గ్రౌండ్)
      borderRadius: '12px',
      border: '1px solid #334155',
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected 
        ? '#10b981' 
        : state.isFocused ? '#334155' : 'transparent',
      color: state.isSelected ? '#020617' : '#e2e8f0',
      padding: '10px 14px',
      cursor: 'pointer',
      fontSize: '14px',
      active: {
        background: '#059669'
      }
    }),
    // 💎 ఇక్కడ మనం సెలెక్ట్ చేసిన ప్లేయర్స్ "Chips" గా స్టైల్ అవుతారు
    multiValue: (base) => ({
      ...base,
      background: '#042f1a', // మందపాటి ఎమరాల్డ్ బ్యాక్‌గ్రౌండ్ (Dark Emerald)
      border: '1px solid #065f46',
      borderRadius: '8px',
      padding: '2px 6px',
      margin: '3px',
      display: 'flex',
      alignItems: 'center'
    }),
    // Chip లోపల ఉన్న ప్లేయర్ పేరు యొక్క స్టైల్
    multiValueLabel: (base) => ({
      ...base,
      color: '#34d399', // emerald-400 ప్రకాశవంతమైన టెక్స్ట్
      fontSize: '13px',
      fontWeight: '600',
      paddingRight: '6px'
    }),
    // Chip ని తీసేసే [X] బటన్ యొక్క స్టైల్
    multiValueRemove: (base) => ({
      ...base,
      color: '#a7f3d0',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover': {
        background: '#f87171', // హోవర్ చేసినప్పుడు రెడ్ కలర్ లోకి మారుతుంది
        color: '#7f1d1d',
      },
    }),
    input: (base) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#64748b',
      fontSize: '14px'
    })
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        Squad Roster (Selected Players will appear as Chips)
      </label>
      <Select
        isMulti
        options={options}
        isLoading={loading}
        onChange={handleChange}
        placeholder="Search and inject players into squad..."
        styles={customStyles}
        closeMenuOnSelect={false} // మల్టిపుల్ ప్లేయర్స్ ని ఒకేసారి ఈజీగా సెలెక్ట్ చేయడానికి డ్రాప్‌డౌన్ ఓపెన్ లోనే ఉంటుంది
      />
    </div>
  );
};
