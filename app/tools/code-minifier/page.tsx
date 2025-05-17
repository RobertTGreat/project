'use client';

import React, { useState, useEffect } from 'react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import { Heart, FileCode, Wrench } from 'lucide-react'; // Specific icon for this tool

const TOOL_ID = 16; // Numeric ID for Code Minifier
const TOOL_NAME = 'Code Minifier';
const TOOL_DESCRIPTION = 'Minify code (CSS, JS, HTML) to reduce file size.';

// Reusable styles
const pageHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginRight: '20px',
  color: '#ffffff',
};

const favoriteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pageContainerStyle: React.CSSProperties = {
    padding: '40px',
    color: '#e0e0e0',
    minHeight: 'calc(100vh - 80px)', 
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#a0a0a0',
    marginBottom: '30px',
    maxWidth: '800px',
};

const placeholderContentStyle: React.CSSProperties = {
    border: '1px dashed #555',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#777',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}

export default function CodeMinifierPage() {
  const { addFavorite, removeFavorite, isFavorited, isLoading: favoritesLoading } = useFavorites();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const handleFavoriteToggle = () => {
    if (isFavorited(TOOL_ID)) {
      removeFavorite(TOOL_ID);
    } else {
      addFavorite(TOOL_ID);
    }
  };

  const isCurrentlyFavorited = isClient ? isFavorited(TOOL_ID) : false;

  return (
    <div style={pageContainerStyle}>
      <div style={pageHeaderStyle}>
        <FileCode size={36} style={{ marginRight: '15px', color: '#00aaff' }} /> 
        <h1 style={titleStyle}>{TOOL_NAME}</h1>
        {isClient && (
          <button
            onClick={handleFavoriteToggle}
            disabled={favoritesLoading}
            style={favoriteButtonStyle}
            title={isCurrentlyFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
                size={28} 
                fill={isCurrentlyFavorited ? '#ff4444' : 'none'} 
                color={isCurrentlyFavorited ? '#ff4444' : 'currentColor'} 
            />
          </button>
        )}
      </div>
      <p style={descriptionStyle}>{TOOL_DESCRIPTION}</p>
      
      <div style={placeholderContentStyle}>
        <Wrench size={48} style={{ marginBottom: '20px' }} />
        <p style={{fontSize: '1.2rem'}}>{TOOL_NAME} Functionality Coming Soon!</p>
        <p>This is where the tool's user interface will be.</p>
      </div>
    </div>
  );
} 