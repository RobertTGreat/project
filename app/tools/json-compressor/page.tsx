'use client';

import React, { useState, useEffect } from 'react';
import { useFavorites } from '@/lib/contexts/favorites-context';
import { Heart, Braces, Wrench } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';

const TOOL_ID = 17; 
const TOOL_NAME = 'JSON Compressor';
const TOOL_DESCRIPTION = 'Compress JSON data, potentially by removing whitespace or using algorithms.';

const pageHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginRight: '20px',
  color: '#ffffff',
};

const favoriteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const pageContainerStyle: React.CSSProperties = {
    padding: '40px',
    color: '#e0e0e0',
    minHeight: 'calc(100vh - 80px)', 
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#a0a0a0',
    marginBottom: '30px',
    maxWidth: '800px',
};

export default function JsonCompressorPage() {
  const { addFavorite, removeFavorite, isFavorited, isLoading: favoritesLoading } = useFavorites();
  const [isClient, setIsClient] = useState(false);
  const [inputJson, setInputJson] = useState<string>('');
  const [outputJson, setOutputJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const handleFavoriteToggle = () => {
    if (isFavorited(TOOL_ID)) {
      removeFavorite(TOOL_ID);
    } else {
      addFavorite(TOOL_ID);
    }
  };

  const isCurrentlyFavorited = isClient ? isFavorited(TOOL_ID) : false;

  const handleMinify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed));
    } catch (e: any) {
      setError('Invalid JSON input. Please check your JSON syntax.');
      setOutputJson('');
    }
  };

  const handlePrettify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed, null, 2)); // Indent with 2 spaces
    } catch (e: any) {
      setError('Invalid JSON input. Please check your JSON syntax.');
      setOutputJson('');
    }
  };

  const handleCopyOutput = async () => {
    if (outputJson) {
      try {
        await navigator.clipboard.writeText(outputJson);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Failed to copy:', err);
        setError('Failed to copy output to clipboard.');
      }
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={pageHeaderStyle}>
        <Braces size={36} style={{ marginRight: '15px', color: '#00aaff' }} /> 
        <h1 style={titleStyle}>{TOOL_NAME}</h1>
        {isClient && (
          <button
            onClick={handleFavoriteToggle}
            disabled={favoritesLoading}
            style={favoriteButtonStyle}
            title={isCurrentlyFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
                size={28} 
                fill={isCurrentlyFavorited ? '#ff4444' : 'none'} 
                color={isCurrentlyFavorited ? '#ff4444' : 'currentColor'} 
            />
          </button>
        )}
      </div>
      <p style={descriptionStyle}>{TOOL_DESCRIPTION}</p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-foreground">Input JSON</h2>
          <Textarea
            placeholder='{&#92;"key&#92;": &#92;"value&#92;", &#92;"nested&#92;": {&#92;"anotherKey&#92;": 123}}...'
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            className="min-h-[200px] sm:min-h-[300px] md:min-h-[400px] bg-card border-border text-sm focus:ring-primary focus:border-primary"
            rows={15}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleMinify} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Minify JSON
            </Button>
            <Button onClick={handlePrettify} variant="secondary">
              Prettify JSON
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4 bg-black/20 backdrop-blur-xl p-6 rounded-lg border border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Output JSON</h2>
            {outputJson && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyOutput}
                className="text-muted-foreground hover:text-foreground"
                disabled={copied}
              >
                {copied ? <Check size={18} className="mr-1.5 text-green-500" /> : <Copy size={18} className="mr-1.5" />}
                {copied ? 'Copied!' : 'Copy Output'}
              </Button>
            )}
          </div>
          <Textarea
            placeholder="Processed JSON will appear here..."
            value={outputJson}
            readOnly
            className="min-h-[200px] sm:min-h-[300px] md:min-h-[400px] bg-card border-border text-sm focus:ring-primary focus:border-primary"
            rows={15}
          />
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">{error}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-10 p-6 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10">
        <h3 className="text-xl font-semibold text-foreground mb-3">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Paste your JSON data into the "Input JSON" text area on the left.</li>
          <li>Click "Minify JSON" to get a compact, single-line version.</li>
          <li>Click "Prettify JSON" to get a well-formatted, human-readable version with 2-space indentation.</li>
          <li>The processed JSON will appear in the "Output JSON" text area on the right.</li>
          <li>Use the "Copy Output" button to copy the result to your clipboard.</li>
          <li>If your input is not valid JSON, an error message will be displayed.</li>
        </ol>
      </div>
    </div>
  );
} 