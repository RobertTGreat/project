'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import {
  Home,Heart,FileText,ChevronDown,ChevronRight,RefreshCw,
  Palette,Clock,Database,LogIn,AlertCircle,FileImage,  
  Archive,FileCode,Braces,FileDigit,  
} from 'lucide-react';
import LogoutButton from './auth/logout-button';
import { hasSupabaseEnvVars } from '@/lib/supabase/pages-client';
import { useFavorites } from '@/lib/contexts/favorites-context'; // Import useFavorites

interface SidebarProps {
  user: User | null;
}

// Define tool IDs for the sidebar items
const sidebarTools: Array<{id: number; name: string; href: string; icon: React.ElementType}> = [
  { id: 10, name: 'Unit Converter', href: '/tools/unit-converter', icon: RefreshCw }, 
  { id: 11, name: 'Color Converter', href: '/tools/color-converter', icon: Palette },   
  { id: 12, name: 'Time Calculator', href: '/tools/time-calculator', icon: Clock },    
  { id: 13, name: 'Data Calculator', href: '/tools/data-calculator', icon: Database }, 
];

// Define compressor tools
const sidebarCompressorTools: Array<{id: number; name: string; href: string; icon: React.ElementType}> = [
  { id: 14, name: 'Image Compressor', href: '/tools/image-compressor', icon: FileImage }, 
  { id: 15, name: 'File Archiver', href: '/tools/file-archiver', icon: Archive },       
  { id: 16, name: 'Code Minifier', href: '/tools/code-minifier', icon: FileCode },    
  { id: 17, name: 'JSON Compressor', href: '/tools/json-compressor', icon: Braces },    
  { id: 18, name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: FileDigit },  
];

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [calculatorsOpen, setCalculatorsOpen] = useState(true);
  const [compressorsOpen, setCompressorsOpen] = useState(false);
  const [formattersOpen, setFormattersOpen] = useState(false);
  const [apiToolsOpen, setApiToolsOpen] = useState(false);

  const { addFavorite, removeFavorite, isFavorited } = useFavorites(); // Use the hook

  // --- Style Definitions ---
  const sidebarStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 30, 30, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e0e0e0',
    width: '256px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 10px',
    fontFamily: 'sans-serif',
    fontSize: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '10px',
    paddingLeft: '10px',
    borderBottom: '1px solid #444',
    paddingBottom: '15px',
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#a0a0a0',
    marginTop: '10px',
    marginBottom: '5px',
    paddingLeft: '10px',
    textTransform: 'uppercase',
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '5px',
    transition: 'background-color 0.2s ease',
    color: '#e0e0e0',
    textDecoration: 'none',
  };

  const navItemHoverStyle: React.CSSProperties = {
      backgroundColor: '#333',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '15px',
    fontSize: '20px',
  };

  const dropdownHeaderStyle: React.CSSProperties = {
    ...navItemStyle,
    justifyContent: 'space-between',
  };

  const dropdownContentStyle: React.CSSProperties = {
    paddingLeft: '10px',
    maxHeight: calculatorsOpen ? '500px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-out',
  };

  const subItemStyle: React.CSSProperties = {
    ...navItemStyle,
    justifyContent: 'space-between',
    fontSize: '15px',
    paddingTop: '8px',
    paddingBottom: '8px',
  };

  const signInButtonStyle: React.CSSProperties = {
    ...navItemStyle,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    marginBottom: 0,
    textDecoration: 'none',
  };

  const userProfileSectionStyle: React.CSSProperties = {
    marginTop: 'auto',
    paddingTop: '15px',
    borderTop: '1px solid #444',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
  };

  const userProfileContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', 
  };

  const userLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexGrow: 1,
    textDecoration: 'none',
    minWidth: 0, 
    color: 'inherit',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  };

  const userHoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  };

  const userNameStyle: React.CSSProperties = {
    flexGrow: 1, 
    fontSize: '15px',
    color: 'inherit',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  // --- Hover Handlers ---
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor || '';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      e.currentTarget.style.backgroundColor = '';
  };

  const handleFavoriteToggle = (e: React.MouseEvent, toolId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  return (
    <div style={sidebarStyle}>

      <div style={titleStyle}>DEVTOOLS</div>

      <div style={categoryTitleStyle}>Main</div>
      <Link href="/" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Home style={iconStyle} /> Home
      </Link>
      <Link href="/favourites" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Heart style={iconStyle} /> Favourites
      </Link>
      <Link href="/news" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <FileText style={iconStyle} /> News
      </Link>

      {/* Calculators Dropdown */}
      <div style={categoryTitleStyle} onClick={() => setCalculatorsOpen(!calculatorsOpen)} >
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Calculators</span>
              {calculatorsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
      <div style={{ ...dropdownContentStyle, maxHeight: calculatorsOpen ? '500px' : '0' }}>
        {sidebarTools.map(tool => {
          const isToolFavorited = isFavorited(tool.id);
          const ToolIcon = tool.icon;
          return (
            <Link href={tool.href} key={tool.id} style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="group relative">
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <ToolIcon style={{...iconStyle, fontSize: '18px'}} />
                <span>{tool.name}</span>
              </div>
              <button 
                onClick={(e) => handleFavoriteToggle(e, tool.id)}
                title={isToolFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1 rounded-full hover:bg-gray-600/50 transition-colors z-10"
                style={{
                  color: isToolFavorited ? '#ff4444' : '#a0a0a0',
                }}
              >
                <Heart
                  style={{ fontSize: '16px' }}
                  fill={isToolFavorited ? '#ff4444' : 'none'}
                />
              </button>
            </Link>
          );
        })}
      </div>

      {/* Compressors Dropdown (Placeholder) */}
      <div style={categoryTitleStyle} onClick={() => setCompressorsOpen(!compressorsOpen)}>
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Compressors</span>
              {compressorsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
      <div style={{ ...dropdownContentStyle, maxHeight: compressorsOpen ? '500px' : '0' }}>
        {sidebarCompressorTools.map(tool => {
          const isToolFavorited = isFavorited(tool.id);
          const ToolIcon = tool.icon;
          return (
            <Link href={tool.href} key={tool.id} style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="group relative">
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <ToolIcon style={{...iconStyle, fontSize: '18px'}} />
                <span>{tool.name}</span>
              </div>
              <button
                onClick={(e) => handleFavoriteToggle(e, tool.id)}
                title={isToolFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1 rounded-full hover:bg-gray-600/50 transition-colors z-10"
                style={{
                  color: isToolFavorited ? '#ff4444' : '#a0a0a0',
                }}
              >
                <Heart
                  style={{ fontSize: '16px' }}
                  fill={isToolFavorited ? '#ff4444' : 'none'}
                />
              </button>
            </Link>
          );
        })}
      </div>

      {/* Formatters Dropdown (Placeholder) */}
      <div style={categoryTitleStyle} onClick={() => setFormattersOpen(!formattersOpen)}>
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Formatters</span>
              {formattersOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
      {/* API Tools Dropdown (Placeholder) */}
      <div style={categoryTitleStyle} onClick={() => setApiToolsOpen(!apiToolsOpen)}>
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>API Tools</span>
              {apiToolsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>


      <div style={userProfileSectionStyle}>
        {!hasSupabaseEnvVars && (
          <div style={{
            padding: '8px 12px',
            marginBottom: '10px',
            backgroundColor: 'rgba(255, 100, 100, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ff9999',
          }}>
            <AlertCircle size={16} />
            <span>Supabase connection unavailable</span>
          </div>
        )}

        {user ? (

          // Logged In State
          <div style={userProfileContentStyle}>
            <Link
              href="/profile"
              style={userLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = userHoverStyle.backgroundColor || 'transparent';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={userNameStyle}>
                {user.user_metadata?.display_name || user.email}
              </span>
            </Link>
            <LogoutButton />
          </div>
        ) : (
          
          // Logged Out State
          <Link
            href="/auth"
            style={signInButtonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <LogIn style={{...iconStyle, marginRight: '8px'}} /> Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;