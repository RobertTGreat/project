'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/contexts/favorites-context';

const TOOL_ID = 13;

const quickConversions = [
  { from: 'bytes', to: 'kilobytes', label: 'Bytes → Kilobytes (KB)' },
  { from: 'kilobytes', to: 'megabytes', label: 'KB → Megabytes (MB)' },
  { from: 'megabytes', to: 'gigabytes', label: 'MB → Gigabytes (GB)' },
  { from: 'gigabytes', to: 'terabytes', label: 'GB → Terabytes (TB)' },
  { from: 'bytes', to: 'kibibytes', label: 'Bytes → Kibibytes (KiB)' },
  { from: 'kibibytes', to: 'mebibytes', label: 'KiB → Mebibytes (MiB)' },
  { from: 'mebibytes', to: 'gibibytes', label: 'MiB → Gibibytes (GiB)' },
  { from: 'gibibytes', to: 'tebibytes', label: 'GiB → Tebibytes (TiB)' },
];

export default function DataCalculatorPage() {
  const [inputValue, setInputValue] = useState<string>('1024');
  const [fromUnit, setFromUnit] = useState<string>('kilobytes');
  const [toUnit, setToUnit] = useState<string>('megabytes');
  const [outputValue, setOutputValue] = useState<string>('');

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
    setFromUnit(from);
    setToUnit(to);
  };

  useEffect(() => {
    // Dummy logic: This should be replaced with actual data unit conversion
    if (inputValue && fromUnit && toUnit) {
      setOutputValue(`Calculated ${inputValue} ${fromUnit} to ${toUnit} (logic pending)`);
    } else {
      setOutputValue('');
    }
  }, [inputValue, fromUnit, toUnit]);

  const dataUnits = [
    { id: 'bits', name: 'Bits' },
    { id: 'bytes', name: 'Bytes' },
    { id: 'kilobits', name: 'Kilobits (kb)' },
    { id: 'megabits', name: 'Megabits (Mb)' },
    { id: 'gigabits', name: 'Gigabits (Gb)' },
    { id: 'terabits', name: 'Terabits (Tb)' },
    { id: 'kilobytes', name: 'Kilobytes (KB)' },
    { id: 'megabytes', name: 'Megabytes (MB)' },
    { id: 'gigabytes', name: 'Gigabytes (GB)' },
    { id: 'terabytes', name: 'Terabytes (TB)' },
    { id: 'petabytes', name: 'Petabytes (PB)' },
    { id: 'kibibytes', name: 'Kibibytes (KiB)' },
    { id: 'mebibytes', name: 'Mebibytes (MiB)' },
    { id: 'gibibytes', name: 'Gibibytes (GiB)' },
    { id: 'tebibytes', name: 'Tebibytes (TiB)' },
    { id: 'pebibytes', name: 'Pebibytes (PiB)' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
      <div className="flex items-center mb-6 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-white mr-3">
          Data Calculator
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
                    (fromUnit === qc.from && toUnit === qc.to)
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                  title={`Set conversion from ${qc.from} to ${qc.to}`}
                >
                  {qc.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Calculator Card */}
        <Card className="w-full flex-grow flex flex-col border-white/10 min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-center text-white">Calculate Data Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow overflow-y-auto p-4 md:p-6">
            <div>
              <label htmlFor="input-value" className="block text-sm font-medium text-white mb-1">Input Value</label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="text-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <label htmlFor="from-unit" className="block text-sm font-medium text-white mb-1">From Unit</label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="from-unit"><SelectValue placeholder="From Unit" /></SelectTrigger>
                  <SelectContent>
                    {dataUnits.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center sm:pt-6">
                <span className="text-xl font-semibold text-white/70">→</span>
              </div>

              <div className="flex-1 min-w-0">
                <label htmlFor="to-unit" className="block text-sm font-medium text-white mb-1">To Unit</label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="to-unit"><SelectValue placeholder="To Unit" /></SelectTrigger>
                  <SelectContent>
                    {dataUnits.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="output-value" className="block text-sm font-medium text-white mb-1">Result</label>
              <Input
                id="output-value"
                type="text"
                value={outputValue}
                readOnly
                placeholder="Calculated data size"
                className="text-lg bg-muted/50 dark:bg-muted/30 border-muted-foreground/30 cursor-not-allowed flex-grow"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 