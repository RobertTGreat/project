import React from 'react';

interface NewsItem {
  date: string;
  title: string;
  description: string;
}

// Placeholder Data
const newsItems: NewsItem[] = [
  {
    date: 'March 20, 2025',
    title: 'New Formatter Tools Added',
    description: 'We\'ve added new formatter tools for YAML, CSV, and SQL formats with syntax highlighting and validation.',
  },
  {
    date: 'March 20, 2025',
    title: 'New Formatter Tools Added',
    description: 'We\'ve added new formatter tools for YAML, CSV, and SQL formats with syntax highlighting and validation.',
  },
    {
    date: 'March 20, 2025',
    title: 'New Formatter Tools Added',
    description: 'We\'ve added new formatter tools for YAML, CSV, and SQL formats with syntax highlighting and validation.',
  },
    {
    date: 'March 20, 2025',
    title: 'New Formatter Tools Added',
    description: 'We\'ve added new formatter tools for YAML, CSV, and SQL formats with syntax highlighting and validation.',
  },
      {
    date: 'March 20, 2025',
    title: 'New Formatter Tools Added',
    description: 'We\'ve added new formatter tools for YAML, CSV, and SQL formats with syntax highlighting and validation.',
  },
];

const NewsPanel: React.FC = () => {
  const panelStyle: React.CSSProperties = {
    backgroundColor: 'rgba(26, 26, 26, 0.25)', // Increased transparency (lower alpha)
    backdropFilter: 'blur(20px)', // Increased blur
    WebkitBackdropFilter: 'blur(20px)', // Increased blur (Safari)
    color: '#e0e0e0',
    padding: '20px',
    width: '300px', // Fixed width based on mockup appearance
    height: '100%', // Take full height of parent
    overflowY: 'auto', // Scroll if content overflows
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border on the left
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #444',
  };

  const itemStyle: React.CSSProperties = {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #444',
  };

  const dateStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#00aaff', // Blue color like mockup
    marginBottom: '5px',
  };

  const itemTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '8px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#a0a0a0',
    lineHeight: '1.4',
  };

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>News & Updates</div>
      <div>
        {newsItems.map((item, index) => (
          <div key={index} style={itemStyle}>
            <div style={dateStyle}>{item.date}</div>
            <div style={itemTitleStyle}>{item.title}</div>
            <div style={descriptionStyle}>{item.description}</div>
          </div>
        ))}
        {/* Remove last border */}
        {newsItems.length > 0 && <style>{`.news-item:last-child { border-bottom: none; }`}</style>}
      </div>
    </div>
  );
};

export default NewsPanel; 