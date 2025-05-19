'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button for potential use
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/contexts/favorites-context';

const TOOL_ID = 11;

// --- Color Conversion Utilities ---
const colorUtils = {
  // HEX to RGB: Converts #RRGGBB or #RGB to {r, g, b}
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  // RGB to HEX: Converts {r, g, b} to #RRGGBB
  rgbToHex: (r: number, g: number, b: number): string => {
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  },
  
  // RGB to HSL: Converts {r, g, b} to {h, s, l}
  // r, g, b are 0-255; h is 0-360, s, l are 0-100
  rgbToHsl: (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  },

  // HSL to RGB: Converts {h, s, l} to {r, g, b}
  // h is 0-360, s, l are 0-100; r, g, b are 0-255
  hslToRgb: (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100; l /= 100;
    const k = (n:number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n:number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  },

  // Parse RGB string: "rgb(255, 99, 71)" to {r,g,b,a:1} or null
  parseRgbString: (rgbStr: string): { r: number; g: number; b: number; a: number } | null => {
    const match = rgbStr.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([01]?\.?\d+))?\)$/i);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1) return null;
    return { r, g, b, a };
  },

  // Parse HSL string: "hsl(9, 100%, 64%)" to {h,s,l,a:1} or null
  parseHslString: (hslStr: string): { h: number; s: number; l: number; a: number } | null => {
    const match = hslStr.match(/^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(?:,\s*([01]?\.?\d+))?\)$/i);
    if (!match) return null;
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1) return null;
    return { h, s, l, a };
  }
};
// --- End Color Conversion Utilities ---

const quickConversions = [
  { from: 'hex', to: 'rgb', label: 'HEX → RGB' },
  { from: 'rgb', to: 'hex', label: 'RGB → HEX' },
  { from: 'rgb', to: 'hsl', label: 'RGB → HSL' },
  { from: 'hsl', to: 'rgb', label: 'HSL → RGB' },
  { from: 'hex', to: 'hsl', label: 'HEX → HSL' },
  // Maybe add pairs involving RGBA/HSLA if desired
  // { from: 'hex', to: 'rgba', label: 'HEX → RGBA (alpha=1)' },
  // { from: 'rgb', to: 'hsla', label: 'RGB → HSLA (alpha=1)' },
];

const HISTORY_STORAGE_KEY = 'colorConverterHistory';
const MAX_HISTORY_ITEMS = 10;

interface ConversionHistoryItem {
  id: string;
  inputValue: string;
  outputValue: string;
  fromFormat: string;
  toFormat: string;
  timestamp: number;
}

export default function ColorConverterPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [fromFormat, setFromFormat] = useState<string>('hex');
  const [toFormat, setToFormat] = useState<string>('rgb');
  const [outputValue, setOutputValue] = useState<string>('');
  const [colorPreview, setColorPreview] = useState<string>('transparent');
  const [conversionHistory, setConversionHistory] = useState<ConversionHistoryItem[]>([]);

  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const isCurrentlyFavorited = isFavorited(TOOL_ID);

  const handleFavoriteClick = () => {
    if (isCurrentlyFavorited) {
      removeFavorite(TOOL_ID);
    } else {
      addFavorite(TOOL_ID);
    }
  };

  const handleQuickConvertClick = (from: string, to: string) => {
    setFromFormat(from);
    setToFormat(to);
  };

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setConversionHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load color conversion history:", error);
      // Optionally clear corrupted history: localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const addConversionToHistory = (item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>) => {
    setConversionHistory(prevHistory => {
      const newHistoryItem: ConversionHistoryItem = {
        ...item,
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        timestamp: Date.now(),
      };
      // Prevent duplicate of the very last entry if inputs haven't changed
      if (prevHistory.length > 0) {
        const lastEntry = prevHistory[0];
        if (
          lastEntry.inputValue === newHistoryItem.inputValue &&
          lastEntry.outputValue === newHistoryItem.outputValue &&
          lastEntry.fromFormat === newHistoryItem.fromFormat &&
          lastEntry.toFormat === newHistoryItem.toFormat
        ) {
          return prevHistory; // Don't add identical consecutive entry
        }
      }
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save color conversion history:", error);
      }
      return updatedHistory;
    });
  };

  const clearConversionHistory = () => {
    setConversionHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear color conversion history:", error);
    }
  };

  const applyHistoryItem = (item: ConversionHistoryItem) => {
    setInputValue(item.inputValue);
    setFromFormat(item.fromFormat);
    setToFormat(item.toFormat);
    // Output and preview will update via the main useEffect for conversion
  };

  // Main conversion logic (updates UI immediately)
  useEffect(() => {
    if (!inputValue) {
      setOutputValue('');
      setColorPreview('transparent');
      return;
    }

    let r=0, g=0, b=0, a=1;
    let h=0, s=0, l=0;
    let inputValid = false;

    // --- PARSE INPUT ---
    if (fromFormat === 'hex') {
      const rgb = colorUtils.hexToRgb(inputValue);
      if (rgb) { ({r,g,b} = rgb); inputValid = true; }
    } else if (fromFormat === 'rgb' || fromFormat === 'rgba') {
      const parsed = colorUtils.parseRgbString(inputValue);
      if (parsed) { ({r,g,b,a} = parsed); inputValid = true; }
    } else if (fromFormat === 'hsl' || fromFormat === 'hsla') {
      const parsed = colorUtils.parseHslString(inputValue);
      if (parsed) { 
        ({h,s,l,a} = parsed);
        const rgbFromHsl = colorUtils.hslToRgb(h,s,l);
        r = rgbFromHsl.r; g = rgbFromHsl.g; b = rgbFromHsl.b;
        inputValid = true; 
      }
    }

    if (!inputValid) {
      setOutputValue('Invalid input format');
      setColorPreview('transparent');
      return;
    }

    // --- CONVERT TO OUTPUT ---
    let outputStr = '';
    if (toFormat === 'hex') {
      outputStr = colorUtils.rgbToHex(r, g, b);
    } else if (toFormat === 'rgb') {
      outputStr = `rgb(${r}, ${g}, ${b})`;
    } else if (toFormat === 'rgba') {
      outputStr = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (toFormat === 'hsl') {
      const hslResult = colorUtils.rgbToHsl(r, g, b);
      outputStr = `hsl(${hslResult.h}, ${hslResult.s}%, ${hslResult.l}%)`;
    } else if (toFormat === 'hsla') {
      const hslResult = colorUtils.rgbToHsl(r, g, b);
      outputStr = `hsla(${hslResult.h}, ${hslResult.s}%, ${hslResult.l}%, ${a})`;
    }
    
    setOutputValue(outputStr);
    // Set color preview based on output string if it's likely a valid color, else use input or transparent
    if (outputStr && !outputStr.toLowerCase().includes('invalid')) {
        setColorPreview(outputStr); 
    } else if (inputValid && (fromFormat === 'hex' || fromFormat === 'rgb' || fromFormat === 'rgba' || fromFormat === 'hsl' || fromFormat === 'hsla')) {
        // If output is invalid but input was parseable, try to preview input (might need more robust logic)
        setColorPreview(inputValue); 
    } else {
        setColorPreview('transparent');
    }

  }, [inputValue, fromFormat, toFormat]);

  // Debounced effect for adding to history
  useEffect(() => {
    if (!inputValue || !outputValue || outputValue.toLowerCase().includes('invalid')) {
      return; // Don't save if input is empty, output is empty or shows an error
    }

    const handler = setTimeout(() => {
      addConversionToHistory({
        inputValue,
        outputValue,
        fromFormat,
        toFormat,
      });
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, outputValue, fromFormat, toFormat]); // Note: addConversionToHistory is not in deps array as it's stable due to setConversionHistory

  const colorFormats = [
    { id: 'hex', name: 'HEX' },
    { id: 'rgb', name: 'RGB' },
    { id: 'rgba', name: 'RGBA' },
    { id: 'hsl', name: 'HSL' },
    { id: 'hsla', name: 'HSLA' },
    // { id: 'cmyk', name: 'CMYK' }, // CMYK is more complex
    // { id: 'name', name: 'CSS Name' }, // CSS Name to HEX/RGB
  ];
  
  // Helper to format names (e.g. "HEX" to "HEX")
  const formatName = (name: string): string => name.toUpperCase();


  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
      <div className="flex items-center mb-6 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-white mr-3">
          Color Converter
        </h1>
        <button
          onClick={handleFavoriteClick}
          title={isCurrentlyFavorited ? 'Remove from favorites' : 'Add to favorites'}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart size={22} className={isCurrentlyFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-grow min-h-0">
        {/* Quick Access Sidebar */}
        <div className="md:w-60 lg:w-72 flex-shrink-0">
          <Card className="border-white/10 h-full">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 overflow-y-auto">
              {quickConversions.map(qc => (
                <button
                  key={`${qc.from}-${qc.to}`}
                  onClick={() => handleQuickConvertClick(qc.from, qc.to)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    (fromFormat === qc.from && toFormat === qc.to)
                      ? 'bg-white/20 text-white' // Highlight if active
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                  title={`Set conversion from ${qc.from.toUpperCase()} to ${qc.to.toUpperCase()}`}
                >
                  {qc.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Converter Card */}
        <Card className="w-full flex-grow flex flex-col border-white/10 min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-center text-white">Convert Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow overflow-y-auto p-4 md:p-6">
            {/* Combined Color Picker and Text Input Row */}
            <div className="flex items-end space-x-3">
              {/* Color Picker Input */}
              <div className="text-center">
                <label htmlFor="color-picker-input" className="block text-sm font-medium text-white mb-1">Pick</label>
                <Input
                  id="color-picker-input"
                  type="color"
                  value={colorUtils.hexToRgb(inputValue) ? inputValue.startsWith('#') ? inputValue : colorUtils.rgbToHex(colorUtils.parseRgbString(inputValue)?.r ?? 0, colorUtils.parseRgbString(inputValue)?.g ?? 0, colorUtils.parseRgbString(inputValue)?.b ?? 0) : '#000000'}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setFromFormat('hex');
                    setColorPreview(e.target.value);
                  }}
                  className="w-10 h-10 p-0 rounded-md cursor-pointer border-gray-600 hover:border-gray-500 focus:border-blue-500 transition-colors duration-150 ease-in-out dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-blue-500 bg-white/5 dark:bg-black/20"
                />
              </div>

              {/* Input Value Text Field */}
              <div className="flex-grow">
                <label htmlFor="input-color" className="block text-sm font-medium text-white mb-1">Input Color Value</label>
                <Input
                  id="input-color"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., #RRGGBB, rgb(r,g,b), etc."
                  className="text-lg w-full"
                />
              </div>
            </div>

            {/* From/To Format Selection Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <label htmlFor="from-format" className="block text-sm font-medium text-white mb-1">From</label>
                <Select value={fromFormat} onValueChange={setFromFormat}>
                  <SelectTrigger id="from-format">
                    <SelectValue placeholder="From Format" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorFormats.map(format => (
                      <SelectItem key={format.id} value={format.id}>{format.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center sm:pt-6">
                <span className="text-xl font-semibold text-white/70">→</span>
              </div>

              <div className="flex-1 min-w-0">
                <label htmlFor="to-format" className="block text-sm font-medium text-white mb-1">To</label>
                <Select value={toFormat} onValueChange={setToFormat}>
                  <SelectTrigger id="to-format">
                    <SelectValue placeholder="To Format" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorFormats.map(format => (
                      <SelectItem key={format.id} value={format.id}>{format.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Output Value & Preview */}
            <div>
              <label htmlFor="output-color" className="block text-sm font-medium text-white mb-1">Output Color</label>
              <div className="flex items-center space-x-2">
                <Input
                  id="output-color"
                  type="text"
                  value={outputValue}
                  readOnly
                  placeholder="Result"
                  className="text-lg bg-muted/50 dark:bg-muted/30 border-muted-foreground/30 cursor-not-allowed flex-grow"
                />
                <div
                  className="w-10 h-10 rounded border border-white/20"
                  style={{ backgroundColor: colorPreview }}
                  title="Color preview"
                ></div>
              </div>
            </div>
            
            {/* Placeholder for error messages or additional info */}
            {/* <p className="text-sm text-red-400">Error message here</p> */}

          </CardContent>
          
          {/* History Section */}
          {conversionHistory.length > 0 && (
            <div className="p-4 md:p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-white">History</h3>
                <Button variant="outline" size="sm" onClick={clearConversionHistory} className="text-xs">
                  Clear History
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {conversionHistory.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => applyHistoryItem(item)}
                    className="p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors text-xs text-white/80 border border-transparent hover:border-white/20 flex items-center space-x-2"
                  >
                    <div 
                      className="w-4 h-4 rounded-sm border border-white/30 flex-shrink-0"
                      style={{ backgroundColor: item.outputValue }}
                      title={`Preview: ${item.outputValue}`}
                    ></div>
                    <div className="flex-grow flex justify-between items-center min-w-0">
                      <span className="truncate" title={`${item.inputValue} (${item.fromFormat.toUpperCase()})`}>{item.inputValue} ({item.fromFormat.toUpperCase()})</span>
                      <span className="mx-1 text-white/60">→</span>
                      <span className="truncate text-right" title={`${item.outputValue} (${item.toFormat.toUpperCase()})`}>{item.outputValue} ({item.toFormat.toUpperCase()})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 