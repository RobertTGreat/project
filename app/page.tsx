'use client'; 

import React, { useEffect, useState, useCallback } from 'react';
import NewsPanel from '@/components/NewsPanel';
import ToolCard from '@/components/ToolCard'; 

import { 
  Clock, RefreshCw, Palette, Database, LucideIcon, 
  FileImage, Archive, FileCode, Braces, FileDigit,
} from 'lucide-react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

// Define a mapping from tool ID (number) to Lucide icon components
const iconMap: { [key: number]: LucideIcon } = {
  // CALCULATORS 
  10: RefreshCw,         
  11: Palette,           
  12: Clock,             
  13: Database,          
  // COMPRESSORS 
  14: FileImage,         
  15: Archive,           
  16: FileCode,          
  17: Braces,            
  18: FileDigit,         

};

interface Tool {
  id: number; 
  name: string; 
  description: string;
  href_slug: string; 
}

export default function Home() {
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [toolsError, setToolsError] = useState<string | null>(null);

  console.log('[Homepage] Initial favorites:', favorites);

  useEffect(() => {
    async function fetchTools() {
      setLoadingTools(true);
      setToolsError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description'); 

      if (error) {
        console.error('[Homepage] Error fetching tools:', error);
        setToolsError(error.message || 'Failed to load tools.');
        setAllTools([]);
      } else {
        console.log('[Homepage] Fetched allTools (without href_slug from DB):', data);
        // href_slug will be generated here if not present (which it won't be from this query)
        const processedData = data?.map((tool: Omit<Tool, 'href_slug'> & { href_slug?: string | null }) => ({ 
          ...tool, 
          href_slug: tool.href_slug || tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
        })) || [];
        setAllTools(processedData as Tool[]);
      }
      setLoadingTools(false);
    }
    fetchTools();
  }, []);

  const handleFavoriteClick = (testId: number) => {
    if (isFavorited(testId)) {
      removeFavorite(testId);
    } else {
      addFavorite(testId);
    }
  };

  const getToolDetails = useCallback((toolId: number): Tool | undefined => {
    const tool = allTools.find(t => t.id === toolId);
    return tool;
  }, [allTools]);

  // Log when favorites or allTools change to see their state before rendering
  useEffect(() => {
    console.log('[Homepage] Favorites changed (or on mount):', favorites);
    console.log('[Homepage] allTools changed (or on mount):', allTools);
  }, [favorites, allTools]);

  const pageStyle: React.CSSProperties = {
    height: '100%', 
    color: '#e0e0e0',
  };

  const mainContentWrapperStyle: React.CSSProperties = {
    display: 'flex', 
    height: '100%',
  };

  const mainContentStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: '40px',
    overflowY: 'auto', 
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
       gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
                {favorites.map((favorite) => {
                  console.log('[Homepage] Processing favorite:', favorite);
                  const tool = getToolDetails(favorite.tool_id);
                  console.log('[Homepage] Matched tool for favorite $favorite.tool_id:', tool);
                  if (!tool) {
                    console.warn(`[Homepage] Favorite tool details not found for ID: ${favorite.tool_id}`);
                    return null;
                  }
                  const IconComponent = iconMap[tool.id] || Database;

                  return (
                    <Link href={`/tools/${tool.href_slug}`} key={favorite.id} style={{ textDecoration: 'none' }}>
                      <ToolCard
                        name={tool.name}
                        description={tool.description}
                        testId={tool.id}
                        onFavoriteClick={handleFavoriteClick}
                        isFavorited={true}
                        icon={IconComponent} // Pass the mapped icon component
                      />
                    </Link>
                  );
                })}
              </div>
              {favorites.length > 4 && ( 
                <Link href="/favourites" style={viewAllLinkStyle}>
                  View all favorites →
                </Link>
              )}
            </>
          )}

          {/* All Tools Section */}
          <h2 style={sectionTitleStyle}>All Tools</h2>
          {loadingTools && <p style={{textAlign: 'center'}}>Loading tools...</p>}
          {toolsError && <p style={{ color: 'red', textAlign: 'center' }}>Error loading tools: {toolsError}</p>}
          {!loadingTools && !toolsError && allTools.length === 0 && (
            <p style={{textAlign: 'center'}}>No tools available at the moment. Please check back later.</p>
          )}
          {!loadingTools && !toolsError && allTools.length > 0 && (
            <div style={toolGridStyle}>
              {allTools.map((tool) => {
                const IconComponent = iconMap[tool.id] || Database; 
                return (
                  <Link href={`/tools/${tool.href_slug}`} key={tool.id} style={{ textDecoration: 'none' }}>
                    <ToolCard
                      name={tool.name}
                      description={tool.description}
                      testId={tool.id}
                      onFavoriteClick={handleFavoriteClick}
                      isFavorited={isFavorited(tool.id)}
                      icon={IconComponent} 
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* News Panel */}
        <NewsPanel />
      </div>
    </div>
  );
}
