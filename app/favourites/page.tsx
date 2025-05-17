'use client';

import React from 'react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import { Clock, Heart } from 'lucide-react';
import Link from 'next/link';

// Tool Card Component (reused from home page)
const ToolCard: React.FC<{ 
  title: string; 
  description: string; 
  testId: string;
  onFavoriteClick: (testId: string) => void;
  isFavorited: boolean;
}> = ({ title, description, testId, onFavoriteClick, isFavorited }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 30, 30, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e0e0e0',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  const titleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '10px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#a0a0a0',
    flexGrow: 1,
  };

  const favoriteButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isFavorited ? '#ff4444' : '#a0a0a0',
    transition: 'color 0.2s ease',
  };

  return (
    <div style={cardStyle}>
      <button
        style={favoriteButtonStyle}
        onClick={() => onFavoriteClick(testId)}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={18} fill={isFavorited ? '#ff4444' : 'none'} />
      </button>
      <div style={titleStyle}>
        <Clock size={18} style={{ marginRight: '8px' }} /> {title}
      </div>
      <div style={descriptionStyle}>{description}</div>
    </div>
  );
};

// Available tools data (same as home page)
const availableTools = [
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between different units of measurement including length, weight, temperature, and more.',
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert colors between different formats like HEX, RGB, HSL, and more.',
  },
  {
    id: 'time-calculator',
    title: 'Time Calculator',
    description: 'Calculate time differences, add or subtract time intervals, and convert between time formats.',
  },
  {
    id: 'data-calculator',
    title: 'Data Calculator',
    description: 'Convert between different data units like bytes, kilobytes, megabytes, and more.',
  },
];

export default function FavouritesPage() {
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites();

  const handleFavoriteClick = (testId: string) => {
    if (isFavorited(testId)) {
      removeFavorite(testId);
    } else {
      addFavorite(testId);
    }
  };

  const pageStyle: React.CSSProperties = {
    padding: '40px',
    color: '#e0e0e0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
  };

  const toolGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#a0a0a0',
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Favourites</h1>
      
      {favorites.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>You haven't added any favorites yet.</p>
          <p>Browse the tools and click the heart icon to add them to your favorites.</p>
        </div>
      ) : (
        <div style={toolGridStyle}>
          {favorites.map((favorite) => {
            const tool = availableTools.find(t => t.id === favorite.test_id);
            if (!tool) return null;
            
            return (
              <Link href={`/tools/${tool.id}`} key={favorite.id} style={{ textDecoration: 'none' }}>
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  testId={tool.id}
                  onFavoriteClick={handleFavoriteClick}
                  isFavorited={true}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
} 