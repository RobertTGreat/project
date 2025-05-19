'use client'; // Add this because we are using hooks
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import Link from 'next/link'; // Import Link for navigation

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary?: string;
  published_date: string;
  // Add other fields if needed for display, e.g., category
}

// Placeholder Data - This will be removed
// const newsItems: NewsItem[] = [
// ... existing code ...
// ];

const NewsPanel: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('news_articles')
        .select('id, title, summary, content, published_date') // Select necessary fields
        .order('published_date', { ascending: false })
        .limit(5); // Fetch latest 5 articles for the panel

      if (fetchError) {
        console.error('Error fetching news for panel:', fetchError);
        setError(fetchError.message || 'Failed to load news.');
        setArticles([]); // Ensure articles is an empty array on error
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

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
    // Add clamping for description to prevent overflow
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3, // Limit to 3 lines
    WebkitBoxOrient: 'vertical',
  };

  const viewAllLinkStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    color: '#00aaff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  };


  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={titleStyle}>News & Updates</div>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginTop: '20px' }}>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={panelStyle}>
        <div style={titleStyle}>News & Updates</div>
        <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>News & Updates</div>
      {articles.length === 0 && !loading && (
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginTop: '20px' }}>No news articles yet.</p>
      )}
      <div>
        {articles.map((article, index) => (
          <Link href={`/news#${article.id}`} key={article.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{
                ...itemStyle,
                // Remove bottom border for the last item dynamically
                borderBottom: index === articles.length - 1 ? 'none' : '1px solid #444',
                paddingBottom: index === articles.length - 1 ? '0' : '20px',
                marginBottom: index === articles.length - 1 ? '0' : '20px',
              }}
              className="news-item" // Keep class if used elsewhere, but style ensures uniqueness
            >
              <div style={dateStyle}>{format(new Date(article.published_date), 'MMMM dd, yyyy')}</div>
              <div style={itemTitleStyle}>{article.title}</div>
              <div style={descriptionStyle}>
                {article.summary || (article.content ? article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '') : 'No description available.')}
              </div>
            </div>
          </Link>
        ))}
        {/* Remove static style for last child if it was there */}
        {/* {newsItems.length > 0 && <style>{`.news-item:last-child { border-bottom: none; }`}</style>} */}
        {articles.length > 0 && (
          <Link href="/news" style={viewAllLinkStyle}>
            View All News →
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewsPanel; 