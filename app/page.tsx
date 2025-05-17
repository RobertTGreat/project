'use client'; // Required if using client-side components like NewsPanel directly

import React from 'react';
import NewsPanel from '@/components/NewsPanel';
import { Clock, Heart } from 'lucide-react'; // For placeholder tool card icons
import { useFavorites } from '@/lib/contexts/favorites-context';
import Link from 'next/link';

// Tool Card Component
const ToolCard: React.FC<{ 
  title: string; 
  description: string; 
  lastUsed?: string;
  testId: string;
  onFavoriteClick: (testId: string) => void;
  isFavorited: boolean;
}> = ({ title, description, lastUsed, testId, onFavoriteClick, isFavorited }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 30, 30, 0.25)', // More transparent background to match sidebar
    backdropFilter: 'blur(20px)', // Increased blur to match sidebar
    WebkitBackdropFilter: 'blur(20px)', // For Safari support
    padding: '20px',
    borderRadius: '15px', // Slightly larger radius for glass effect
    border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle white border
    color: '#e0e0e0',
    minHeight: '150px', // Give cards some height
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
    flexGrow: 1, // Push last used to bottom
  };
  const lastUsedStyle: React.CSSProperties = {
      fontSize: '12px',
      color: '#888',
      marginTop: '15px',
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
      {lastUsed && <div style={lastUsedStyle}>Last used: {lastUsed}</div>}
    </div>
  );
};

// Available tools data
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

export default function Home() {
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites();

  const handleFavoriteClick = (testId: string) => {
    if (isFavorited(testId)) {
      removeFavorite(testId);
    } else {
      addFavorite(testId);
    }
  };

  const pageStyle: React.CSSProperties = {
    height: '100%', // Keep height to fill main area
    color: '#e0e0e0',
  };

  const mainContentWrapperStyle: React.CSSProperties = {
    display: 'flex', // Re-apply flex here for content + news panel
    height: '100%',
  };

  const mainContentStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: '40px',
    overflowY: 'auto', // Allow scrolling if content overflows
  };

   const sectionTitleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #444',
  };

   const toolGridStyle: React.CSSProperties = {
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Responsive grid
       gap: '20px',
       marginBottom: '40px',
   };

  const viewAllLinkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '10px',
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '14px',
  };

  return (
    <div style={pageStyle}>
      <div style={mainContentWrapperStyle}>
        <div style={mainContentStyle}>
          {/* Welcome Section */}
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', marginBottom: '10px' }}>
              Welcome to DEVTOOLS
          </h1>
          <p style={{ fontSize: '16px', color: '#a0a0a0', marginBottom: '40px', maxWidth: '700px' }}>
              Your all-in-one toolkit for development needs. Access calculators, converters,
              and other useful tools to streamline your workflow.
          </p>

          {/* Favourites Section */}
          {favorites.length > 0 && (
            <>
              <h2 style={sectionTitleStyle}>Favourites</h2>
              <div style={toolGridStyle}>
                {favorites.slice(0, 3).map((favorite) => {
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
              {favorites.length > 3 && (
                <Link href="/favourites" style={viewAllLinkStyle}>
                  View all favorites →
                </Link>
              )}
            </>
          )}

          {/* All Tools Section */}
          <h2 style={sectionTitleStyle}>All Tools</h2>
           <div style={toolGridStyle}>
             {availableTools.map((tool) => (
               <Link href={`/tools/${tool.id}`} key={tool.id} style={{ textDecoration: 'none' }}>
                 <ToolCard
                   title={tool.title}
                   description={tool.description}
                   testId={tool.id}
                   onFavoriteClick={handleFavoriteClick}
                   isFavorited={isFavorited(tool.id)}
                 />
               </Link>
             ))}
           </div>
        </div>

        {/* News Panel needs to be inside the flex wrapper */}
        <NewsPanel />
      </div>
    </div>
  );
}
