'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import { 
  Clock, Palette, Database, LucideIcon, RefreshCw, 
  FileImage, Archive, FileCode, Braces, FileDigit 
} from 'lucide-react';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { createClient } from '@/utils/supabase/client';

// Define a mapping from tool ID (number) to Lucide icon components
const iconMap: { [key: number]: LucideIcon } = { // Keys are now numbers
  // CALCULATORS - Assuming sequential IDs starting from 10
  10: RefreshCw,         // Unit Converter
  11: Palette,           // Color Converter
  12: Clock,             // Time Calculator
  13: Database,          // Data Calculator (or Sigma)
  // COMPRESSORS - Assuming sequential IDs starting from 14
  14: FileImage,         // Image Compressor
  15: Archive,           // File Archiver
  16: FileCode,          // Code Minifier
  17: Braces,            // JSON Compressor
  18: FileDigit,         // PDF Compressor (using FileDigit as a placeholder, consider FileText or specific PDF icon)

};

interface Tool {
  id: number;
  name: string;
  description: string;
  // No icon property from DB
}

// Define an interface for the props of the tools to be displayed
interface ToolToDisplay {
  key: string | number;
  href: string;
  name: string;
  description: string;
  testId: number;
  isFavorited: boolean;
  IconComponent: React.ElementType;
}

export default function FavouritesPage() {
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [toolsError, setToolsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTools() {
      setLoadingTools(true);
      setToolsError(null);
      const supabase = createClient();
      // Fetch only the tools that are in the favorites list to be efficient,
      // or fetch all and filter. For simplicity, fetching all for now.
      // If performance becomes an issue with many tools, this can be optimized.
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description'); 

      if (error) {
        console.error('Error fetching tools for favourites:', error);
        setToolsError(error.message || 'Failed to load tool details.');
      } else {
        setAllTools(data || []);
      }
      setLoadingTools(false);
    }
    // Only fetch tools if there are favorites to display details for.
    // If favorites list is initially empty then becomes populated, this effect will re-run.
    if (favorites.length > 0) {
      fetchTools();
    } else {
      setLoadingTools(false); // No favorites, so no tool details to load.
    }
  }, [favorites]); // Dependency: re-fetch/re-evaluate if the favorites list changes.

  const getToolDetails = useCallback((toolId: number): Tool | undefined => {
    return allTools.find(t => t.id === toolId);
  }, [allTools]);

  const favoriteToolsToDisplay = useMemo((): ToolToDisplay[] => { // Specify return type
    if (loadingTools || toolsError || !allTools || favorites.length === 0) return [];
    
    return favorites
      .map(favorite => {
        const toolDetails = getToolDetails(favorite.tool_id);
        if (!toolDetails) {
          console.warn(`Favorite details not found for tool ID: ${favorite.tool_id}. This tool may have been removed or its ID changed.`);
          return null;
        }
        const IconComponent = iconMap[toolDetails.id] || Database;
        return {
          key: favorite.id || toolDetails.id, 
          href: `/tools/${toolDetails.id}`,
          name: toolDetails.name,
          description: toolDetails.description,
          testId: toolDetails.id,
          isFavorited: true, 
          IconComponent,
        };
      })
      .filter(Boolean) as ToolToDisplay[]; // Assert to the specific type after filtering nulls
  }, [favorites, allTools, loadingTools, toolsError, getToolDetails]); // Removed iconMap from deps as it's defined outside and stable

  const handleFavoriteClick = (testId: number) => {
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
      
      {loadingTools && favorites.length > 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading favorite tool details...</p>}
      {toolsError && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error loading tool details: {toolsError}</p>}

      {!loadingTools && !toolsError && (
        <>
          {favorites.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>You haven't added any favorites yet.</p>
              <p>Browse the tools and click the heart icon to add them to your favorites.</p>
            </div>
          ) : (
            <>
              {favoriteToolsToDisplay.length > 0 ? (
                <div style={toolGridStyle}>
                  {favoriteToolsToDisplay.map((toolProps) => (
                    <Link href={toolProps.href} key={toolProps.key} style={{ textDecoration: 'none' }}>
                      <ToolCard
                        name={toolProps.name}
                        description={toolProps.description}
                        testId={toolProps.testId}
                        onFavoriteClick={handleFavoriteClick}
                        isFavorited={toolProps.isFavorited}
                        icon={toolProps.IconComponent}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={emptyStateStyle}>
                  {allTools.length === 0 && favorites.length > 0 ? (
                     <p>Could not load details for your favorite tools. Please check your connection and try again.</p>
                  ) : (
                     <p>Details for your favorited tools could not be found. They may have been removed or updated.</p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
} 