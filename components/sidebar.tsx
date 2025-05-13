'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import {
  Home,
  Heart,
  FileText,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Palette,
  Clock,
  Database,
  LogIn,
  LogOut, // Keep if needed, but LogoutButton handles icon
  UserCircle2, // Import default user icon
  Wrench, // Add an icon for Tools
  AlertCircle, // For connection warning
} from 'lucide-react';
import LogoutButton from './auth/logout-button';
import { Button } from '@/components/ui/button'; // Keep if styling logout button directly
import { hasSupabaseEnvVars } from '@/lib/supabase/pages-client';

interface SidebarProps {
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [calculatorsOpen, setCalculatorsOpen] = useState(true);
  const [compressorsOpen, setCompressorsOpen] = useState(false);
  const [formattersOpen, setFormattersOpen] = useState(false);
  const [apiToolsOpen, setApiToolsOpen] = useState(false);

  // --- Style Definitions ---
  const sidebarStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 30, 30, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e0e0e0',
    width: '300px',
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

  // Style for the Sign In button when user is logged out
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

  // Styles for the User Profile Section at the bottom when logged in
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
    gap: '10px', // Space between avatar, name, and button
  };

  const userLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexGrow: 1,
    textDecoration: 'none',
    minWidth: 0, // Prevent text overflow issues
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
    flexGrow: 1, // Allow name to take space
    fontSize: '15px',
    color: 'inherit', // Inherit color from link
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  // --- Hover Handlers ---
  // Apply hover style to user link area as well
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor || '';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
      e.currentTarget.style.backgroundColor = '';
  };


  // --- Component Return ---
  return (
    <div style={sidebarStyle}>
      {/* --- Top Section (Title, Main Links, Dropdowns) --- */}
      <div style={titleStyle}>DEVTOOLS</div>

      <div style={categoryTitleStyle}>Main</div>
      <Link href="/" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Home style={iconStyle} /> Home
      </Link>
      {/* Assuming Favourites and News pages exist */}
      <Link href="/favourites" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Heart style={iconStyle} /> Favourites
      </Link>
      <Link href="/news" style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <FileText style={iconStyle} /> News
      </Link>

      {/* --- Dropdown Sections --- */}
      {/* Calculators Dropdown */}
      <div style={categoryTitleStyle} onClick={() => setCalculatorsOpen(!calculatorsOpen)} >
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Calculators</span>
              {calculatorsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
      <div style={{ ...dropdownContentStyle, maxHeight: calculatorsOpen ? '500px' : '0' }}>
        {/* Tools with correct paths */}
        <Link href="/tools/unit-converter" style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
           <div style={{ display: 'flex', alignItems: 'center' }}><RefreshCw style={{...iconStyle, fontSize: '18px'}} /><span>Unit Converter</span></div>
           <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
         </Link>
         <Link href="/tools/color-converter" style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
             <div style={{ display: 'flex', alignItems: 'center' }}><Palette style={{...iconStyle, fontSize: '18px'}} /><span>Color Converter</span></div>
             <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
         </Link>
         <Link href="/tools/time-calculator" style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
             <div style={{ display: 'flex', alignItems: 'center' }}><Clock style={{...iconStyle, fontSize: '18px'}} /><span>Time Calculator</span></div>
             <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
         </Link>
         <Link href="/tools/data-calculator" style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
             <div style={{ display: 'flex', alignItems: 'center' }}><Database style={{...iconStyle, fontSize: '18px'}} /><span>Data Calculator</span></div>
             <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
         </Link>
      </div>

      {/* Other Dropdowns (Compressors, Formatters, API Tools) */}
      {/* Compressors Dropdown (Placeholder) */}
        <div style={categoryTitleStyle} onClick={() => setCompressorsOpen(!compressorsOpen)}>
            <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span>Compressors</span>
                {compressorsOpen ? <ChevronDown /> : <ChevronRight />}
            </div>
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


      {/* --- User Profile / Sign In Section --- */}
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