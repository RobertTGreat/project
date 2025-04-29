'use client'; // Required if using client-side components like NewsPanel directly

import React from 'react';
import NewsPanel from '@/components/NewsPanel';
import { Clock } from 'lucide-react'; // For placeholder tool card icons

// Placeholder Tool Card Component
const ToolCard: React.FC<{ title: string; description: string; lastUsed?: string }> = ({ title, description, lastUsed }) => {
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

  return (
    <div style={cardStyle}>
        <div style={titleStyle}>
           <Clock size={18} style={{ marginRight: '8px' }} /> {title}
        </div>
      <div style={descriptionStyle}>{description}</div>
      {lastUsed && <div style={lastUsedStyle}>Last used: {lastUsed}</div>}
    </div>
  );
};

export default function Home() {
  const pageStyle: React.CSSProperties = {
    // Removed display:flex and background styles - they are now handled by layout/body
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
          <h2 style={sectionTitleStyle}>Favourites</h2>
          <div style={toolGridStyle}>
             <ToolCard
                  title="Time Calculator"
                  description="Calculate time differences, add or subtract time intervals, and convert between time formats."
                  lastUsed="2 hours ago"
              />
             <ToolCard
                  title="Time Calculator"
                  description="Calculate time differences, add or subtract time intervals, and convert between time formats."
                  lastUsed="2 hours ago"
              />
             <ToolCard
                  title="Time Calculator"
                  description="Calculate time differences, add or subtract time intervals, and convert between time formats."
                  lastUsed="2 hours ago"
              />
          </div>

          {/* All Tools Section */}
          <h2 style={sectionTitleStyle}>All Tools</h2>
           <div style={toolGridStyle}>
             {/* Add more ToolCard instances here */}
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
             <ToolCard title="Time Calculator" description="Calculate time differences..." />
           </div>
        </div>

        {/* News Panel needs to be inside the flex wrapper */}
        <NewsPanel />
      </div>
    </div>
  );
}
