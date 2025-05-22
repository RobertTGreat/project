'use client';

import React from 'react';
import { Heart, LucideIcon } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  testId: number;
  onFavoriteClick: (testId: number) => void;
  isFavorited: boolean;
  icon: React.ElementType;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  name, 
  description, 
  testId, 
  onFavoriteClick, 
  isFavorited, 
  icon: IconComponent 
}) => {
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
    cursor: 'pointer', 
    transition: 'all 0.2s ease-in-out',
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const hoverStyle: React.CSSProperties = isHovered ? {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  } : {};

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
    lineHeight: '1.4', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
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
    zIndex: 1, 
  };

  return (
    <div 
      style={{ ...cardStyle, ...hoverStyle }} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        style={favoriteButtonStyle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onFavoriteClick(testId);
        }}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={18} fill={isFavorited ? '#ff4444' : 'none'} />
      </button>
      <div style={titleStyle}>
        {IconComponent && <IconComponent size={18} style={{ marginRight: '8px' }} />} {name}
      </div>
      <div style={descriptionStyle}>{description}</div>
    </div>
  );
};

export default ToolCard; 