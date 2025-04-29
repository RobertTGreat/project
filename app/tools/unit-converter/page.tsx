'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Expanded conversion factors
const conversionFactors: Record<string, Record<string, number>> = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
    yards: 1.09361,
    nautical_miles: 0.000539957,
    millimeters: 1000,
    centimeters: 100,
  },
  area: {
    square_meters: 1,
    square_kilometers: 1e-6,
    square_miles: 3.861e-7,
    square_feet: 10.7639,
    square_inches: 1550,
    square_yards: 1.19599,
    acres: 0.000247105,
    hectares: 0.0001,
  },
  volume: {
    cubic_meters: 1,
    liters: 1000,
    milliliters: 1e6,
    gallons_us: 264.172,
    gallons_uk: 219.969,
    quarts_us: 1056.69,
    pints_us: 2113.38,
    fluid_ounces_us: 33814,
    cubic_feet: 35.3147,
    cubic_inches: 61023.7,
  },
  mass: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1e6,
    pounds: 2.20462,
    ounces: 35.274,
    metric_tonnes: 0.001,
    stones: 0.157473,
  },
  speed: {
    meters_per_second: 1,
    kilometers_per_hour: 3.6,
    miles_per_hour: 2.23694,
    feet_per_second: 3.28084,
    knots: 1.94384,
  },
  time: {
    seconds: 1,
    minutes: 1 / 60,
    hours: 1 / 3600,
    days: 1 / 86400,
    weeks: 1 / 604800,
    milliseconds: 1000,
    microseconds: 1e6,
    nanoseconds: 1e9,
  },
  temperature: { // Special handling needed
    celsius: 1,
    fahrenheit: 1, // Placeholder
    kelvin: 1, // Placeholder
  },
  data_storage: {
    bytes: 1,
    kilobytes: 1 / 1024,
    megabytes: 1 / (1024 ** 2),
    gigabytes: 1 / (1024 ** 3),
    terabytes: 1 / (1024 ** 4),
    petabytes: 1 / (1024 ** 5),
    bits: 8,
    kibibytes: 1 / 1024,
    mebibytes: 1 / (1024 ** 2),
    gibibytes: 1 / (1024 ** 3),
    tebibytes: 1 / (1024 ** 4),
    pebibytes: 1 / (1024 ** 5),
  },
  pressure: {
    pascals: 1,
    kilopascals: 0.001,
    megapascals: 1e-6,
    bars: 1e-5,
    millibars: 0.01,
    psi: 0.000145038, // Pounds per square inch
    atmospheres: 9.8692e-6,
    torr: 0.00750062,
  },
  energy: {
    joules: 1,
    kilojoules: 0.001,
    calories: 0.239006,
    kilocalories: 0.000239006,
    watt_hours: 0.000277778,
    kilowatt_hours: 2.77778e-7,
    electronvolts: 6.242e+18,
    btu: 0.000947817, // British Thermal Unit
  },
  frequency: {
    hertz: 1,
    kilohertz: 0.001,
    megahertz: 1e-6,
    gigahertz: 1e-9,
  },
  angle: {
    degrees: 1,
    radians: Math.PI / 180,
    gradians: 100 / 90, // Also known as gon
    arcminutes: 60,
    arcseconds: 3600,
  }
};

// Function to get sorted unit types
const getSortedUnitTypes = () => Object.keys(conversionFactors).sort();

export default function UnitConverterPage() {
  const [unitTypes, setUnitTypes] = useState<string[]>(getSortedUnitTypes());
  const [unitType, setUnitType] = useState<string>(unitTypes[0]);
  const [fromUnit, setFromUnit] = useState<string>(''); // Initialize empty
  const [toUnit, setToUnit] = useState<string>('');     // Initialize empty
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<string>('');

  // Memoize available units to prevent recalculation on every render
  const availableUnits = React.useMemo(() => {
      if (!unitType || !conversionFactors[unitType]) return [];
      return Object.keys(conversionFactors[unitType]).sort();
  }, [unitType]);

  // Set initial units and update when type changes
  useEffect(() => {
    if (availableUnits.length > 0) {
        setFromUnit(availableUnits[0]);
        // Try to set a different default To unit if possible
        setToUnit(availableUnits[1] || availableUnits[0]);
    } else {
        setFromUnit('');
        setToUnit('');
    }
  }, [availableUnits]); // Depend on availableUnits

  // Perform conversion when inputs change
  useEffect(() => {
    const inputNum = parseFloat(inputValue);
    // Check for valid number, and ensure units are set (important after type change)
    if (isNaN(inputNum) || !fromUnit || !toUnit || !unitType || !conversionFactors[unitType]) {
      setOutputValue('');
      return;
    }

    let result: number;

    // --- Special Handling Cases ---
    if (unitType === 'temperature') {
      if (fromUnit === toUnit) result = inputNum;
      else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = (inputNum * 9/5) + 32;
      else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (inputNum - 32) * 5/9;
      else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = inputNum + 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = inputNum - 273.15;
      else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = (inputNum - 32) * 5/9 + 273.15;
      else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = (inputNum - 273.15) * 9/5 + 32;
      else result = NaN; // Should not happen if units are valid
    }
    // Add other special cases here if needed (e.g., logarithmic scales)
    // else if (unitType === 'some_other_special_type') { ... }

    // --- Standard Conversion Logic ---
    else {
        // Ensure the units exist in the factors object to prevent errors
        const fromFactor = conversionFactors[unitType]?.[fromUnit];
        const toFactor = conversionFactors[unitType]?.[toUnit];

        if (fromFactor === undefined || toFactor === undefined) {
            setOutputValue('Error: Invalid unit');
            return;
        }

        // Convert input value to the base unit for this type
        const baseValue = inputNum / fromFactor;
        // Convert base unit value to the target unit
        result = baseValue * toFactor;
    }

    // Format output nicely, handle potential NaN from invalid conversions
    if (isNaN(result)) {
        setOutputValue('Invalid conversion');
    } else {
        // Use toLocaleString for better number formatting, limit decimals
        setOutputValue(result.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8 // Increased precision for some conversions
        }));
    }

  }, [inputValue, fromUnit, toUnit, unitType]); // Rerun when any of these change

  // Helper function to format unit names (replace underscore with space, capitalize)
  const formatUnitName = (name: string): string => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  {/* Main container with flexbox for full height */}
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
      {/* Header with prevention of shrinking */}
      <h1 className="text-2xl font-semibold text-white mb-6 flex-shrink-0">
        Unit Converter
      </h1>
      {/* Main content with sidebar layout */}
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Quick access sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <Card className="border-white/10 h-full">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-white text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {unitTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setUnitType(type)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    unitType === type
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  {formatUnitName(type)}
                </button>
              ))}

              {/* Common conversion pairs */}
              {unitType && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <h3 className="text-xs font-medium text-white/70 mb-3">Common Pairs</h3>
                  <div className="space-y-2">
                    {unitType === 'length' && (
                      <>
                        <button onClick={() => { setFromUnit('meters'); setToUnit('feet'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Meters → Feet
                        </button>
                        <button onClick={() => { setFromUnit('kilometers'); setToUnit('miles'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Kilometers → Miles
                        </button>
                      </>
                    )}
                    {unitType === 'temperature' && (
                      <>
                        <button onClick={() => { setFromUnit('celsius'); setToUnit('fahrenheit'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Celsius → Fahrenheit
                        </button>
                        <button onClick={() => { setFromUnit('fahrenheit'); setToUnit('celsius'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Fahrenheit → Celsius
                        </button>
                      </>
                    )}
                    {unitType === 'mass' && (
                      <>
                        <button onClick={() => { setFromUnit('kilograms'); setToUnit('pounds'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Kilograms → Pounds
                        </button>
                        <button onClick={() => { setFromUnit('grams'); setToUnit('ounces'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Grams → Ounces
                        </button>
                      </>
                    )}
                    {unitType === 'data_storage' && (
                      <>
                        <button onClick={() => { setFromUnit('gigabytes'); setToUnit('megabytes'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          GB → MB
                        </button>
                        <button onClick={() => { setFromUnit('megabytes'); setToUnit('kilobytes'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          MB → KB
                        </button>
                      </>
                    )}
                    {unitType === 'time' && (
                      <>
                        <button onClick={() => { setFromUnit('hours'); setToUnit('minutes'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Hours → Minutes
                        </button>
                        <button onClick={() => { setFromUnit('days'); setToUnit('hours'); }}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 text-white/70">
                          Days → Hours
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main converter card - now wider */}
        <Card className="w-full flex-grow flex flex-col border-white/10">
          {/* Card header with prevention of shrinking */}
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-center text-white">Convert {formatUnitName(unitType)}</CardTitle>
          </CardHeader>
          {/* Allow content to scroll if needed, but prioritize growing */}
          <CardContent className="space-y-4 flex-grow overflow-y-auto p-4 md:p-6">
          {/* Unit Type Selection */}
          <div>
            <label htmlFor="unit-type" className="block text-sm font-medium text-white mb-1">Conversion Type</label>
            <Select value={unitType} onValueChange={setUnitType}>
              <SelectTrigger id="unit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map(type => (
                  <SelectItem key={type} value={type}>{formatUnitName(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input Value */}
          <div>
            <label htmlFor="input-value" className="block text-sm font-medium text-white mb-1">Value</label>
            <Input
              id="input-value"
              type="number" // Stick to number for easier parsing
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="text-lg" // Slightly larger text
            />
          </div>

          {/* From/To Unit Selection Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
            {/* From Unit */}
            {/* From unit container with shrinking allowed */}
            <div className="flex-1 min-w-0">
              <label htmlFor="from-unit" className="block text-sm font-medium text-white mb-1">From</label>
              <Select value={fromUnit} onValueChange={setFromUnit} disabled={availableUnits.length === 0}>
                <SelectTrigger id="from-unit">
                  {/* Use a placeholder if fromUnit isn't set yet */}
                  <SelectValue placeholder="From Unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{formatUnitName(unit)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equals Sign (Centered) */}
            {/* Equals sign with padding on small screens */}
            <div className="flex items-center justify-center sm:pt-6">
              <span className="text-xl font-semibold text-white/70">=</span>
            </div>

            {/* To Unit */}
            {/* To unit container with shrinking allowed */}
            <div className="flex-1 min-w-0">
              <label htmlFor="to-unit" className="block text-sm font-medium text-white mb-1">To</label>
              <Select value={toUnit} onValueChange={setToUnit} disabled={availableUnits.length === 0}>
                <SelectTrigger id="to-unit">
                  <SelectValue placeholder="To Unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>{formatUnitName(unit)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Output Value */}
          <div>
            <label htmlFor="output-value" className="block text-sm font-medium text-white mb-1">Result</label>
            <Input
              id="output-value"
              type="text"
              value={outputValue}
              readOnly
              placeholder="Result"
              className="text-lg bg-muted/50 dark:bg-muted/30 border-muted-foreground/30 cursor-not-allowed"
            />
          </div>

          {/* Common Conversions */}
          {availableUnits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-white mb-3">Common {formatUnitName(unitType)} Conversions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableUnits.slice(0, 8).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setToUnit(unit)}
                    className={`px-3 py-2 text-xs rounded-md transition-colors ${
                      toUnit === unit
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {formatUnitName(unit)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Conversion Pairs */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-white mb-3">Quick Conversion Pairs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {unitType === 'length' && (
                <>
                  <button onClick={() => { setFromUnit('meters'); setToUnit('feet'); }}
                    className="flex justify-between items-center px-3 py-2 text-xs rounded-md bg-white/5 hover:bg-white/10 text-white/70">
                    <span>Meters → Feet</span>
                    <span className="text-white/50">1m ≈ 3.28ft</span>
                  </button>
                  <button onClick={() => { setFromUnit('kilometers'); setToUnit('miles'); }}
                    className="flex justify-between items-center px-3 py-2 text-xs rounded-md bg-white/5 hover:bg-white/10 text-white/70">
                    <span>Kilometers → Miles</span>
                    <span className="text-white/50">1km ≈ 0.62mi</span>
                  </button>
                </>
              )}
              {unitType === 'temperature' && (
                <>
                  <button onClick={() => { setFromUnit('celsius'); setToUnit('fahrenheit'); }}
                    className="flex justify-between items-center px-3 py-2 text-xs rounded-md bg-white/5 hover:bg-white/10 text-white/70">
                    <span>Celsius → Fahrenheit</span>
                    <span className="text-white/50">0°C = 32°F</span>
                  </button>
                  <button onClick={() => { setFromUnit('celsius'); setToUnit('kelvin'); }}
                    className="flex justify-between items-center px-3 py-2 text-xs rounded-md bg-white/5 hover:bg-white/10 text-white/70">
                    <span>Celsius → Kelvin</span>
                    <span className="text-white/50">0°C = 273.15K</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </CardContent>
          </Card>
        </div>
      </div>
  );
}