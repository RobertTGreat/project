import React, { useState } from 'react';
import {
  Home,
  Heart,
  FileText,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Palette, // Changed from FiEdit3 for Colour Convertor
  Clock,
  Database,
  LogIn // Import LogIn icon
} from 'lucide-react'; // Changed from react-icons/fi

interface SidebarProps {
  // Props can be added later if needed, e.g., user info
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [calculatorsOpen, setCalculatorsOpen] = useState(true); // Default open based on mockup
  const [compressorsOpen, setCompressorsOpen] = useState(false);
  const [formattersOpen, setFormattersOpen] = useState(false);
  const [apiToolsOpen, setApiToolsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add logged in state

  // Placeholder user data
  const userName = "RobertTGreat";
  const userAvatarUrl = "https://placekitten.com/32/32"; // Placeholder avatar

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 30, 30, 0.25)', // Increased transparency (lower alpha)
    backdropFilter: 'blur(20px)', // Increased blur
    WebkitBackdropFilter: 'blur(20px)', // Increased blur (Safari)
    borderRight: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border on the right
    color: '#e0e0e0',
    width: '300px',
    height: '100vh', // Full height
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
  };

  const navItemHoverStyle: React.CSSProperties = {
      backgroundColor: '#333',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '15px',
    fontSize: '20px', // Adjust icon size as needed
  };

  const dropdownHeaderStyle: React.CSSProperties = {
    ...navItemStyle,
    justifyContent: 'space-between',
  };

  const dropdownContentStyle: React.CSSProperties = {
    paddingLeft: '10px', // Remove left padding to align with category title
    maxHeight: calculatorsOpen ? '500px' : '0', // Basic animation
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-out',
  };

    const subItemStyle: React.CSSProperties = {
      ...navItemStyle,
      justifyContent: 'space-between', // For the heart icon
      fontSize: '15px',
      paddingTop: '8px',
      paddingBottom: '8px',
    };

  const userProfileStyle: React.CSSProperties = {
    marginTop: 'auto', // Pushes to the bottom
    paddingTop: '15px',
    borderTop: '1px solid #444',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    minHeight: '50px', // Ensure consistent height
  };

  const signInButtonStyle: React.CSSProperties = {
    ...navItemStyle, // Reuse some nav item styles
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#4a4a4a', // Example background
    color: '#ffffff',
    marginBottom: 0, // Override margin from navItemStyle
  };

  const avatarStyle: React.CSSProperties = {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginLeft: '10px',
  };

  // Basic hover effect handling (can be improved with CSS classes)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor || '';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = ''; // Revert to transparent
  };


  return (
    <div style={sidebarStyle}>
      <div style={titleStyle}>DEVTOOLS</div>

      <div style={categoryTitleStyle}>Main</div>
      <div style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Home style={iconStyle} /> Home
      </div>
      <div style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Heart style={iconStyle} /> Favourites
      </div>
      <div style={navItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <FileText style={iconStyle} /> News
      </div>

      {/* Calculators Dropdown */}
      <div style={categoryTitleStyle} onClick={() => setCalculatorsOpen(!calculatorsOpen)} >
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Calculators</span>
              {calculatorsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
      <div style={{ ...dropdownContentStyle, maxHeight: calculatorsOpen ? '500px' : '0' }}>
        <div style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RefreshCw style={{...iconStyle, fontSize: '18px'}} />
            <span>Unit Convertor</span>
          </div>
          <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
        </div>
        <div style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Palette style={{...iconStyle, fontSize: '18px'}} />
            <span>Colour Convertor</span>
          </div>
          <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
        </div>
        <div style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Clock style={{...iconStyle, fontSize: '18px'}} />
            <span>Time Calculator</span>
          </div>
          <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
        </div>
        <div style={subItemStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Database style={{...iconStyle, fontSize: '18px'}} />
            <span>Data Calculator</span>
          </div>
          <Heart style={{ fontSize: '16px', color: '#a0a0a0' }}/>
        </div>
      </div>

       {/* Compressors Dropdown (Placeholder) */}
      <div style={categoryTitleStyle} onClick={() => setCompressorsOpen(!compressorsOpen)}>
         <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Compressors</span>
              {compressorsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
       {/* Add content when open */}

       {/* Formatters Dropdown (Placeholder) */}
       <div style={categoryTitleStyle} onClick={() => setFormattersOpen(!formattersOpen)}>
           <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>Formatters</span>
              {formattersOpen ? <ChevronDown /> : <ChevronRight />}
           </div>
       </div>
        {/* Add content when open */}

       {/* API Tools Dropdown (Placeholder) */}
      <div style={categoryTitleStyle} onClick={() => setApiToolsOpen(!apiToolsOpen)}>
          <div style={dropdownHeaderStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span>API Tools</span>
              {apiToolsOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
      </div>
       {/* Add content when open */}

      {/* User Profile / Sign In Section */}
      <div style={userProfileStyle}>
        {isLoggedIn ? (
          <>
            <span>{userName}</span>
            <img src={userAvatarUrl} alt="User Avatar" style={avatarStyle}/>
          </>
        ) : (
          <div 
            style={signInButtonStyle} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            onClick={() => alert('Sign in clicked!')} // Placeholder action
          >
            <LogIn style={{...iconStyle, marginRight: '8px'}} /> Sign In
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
