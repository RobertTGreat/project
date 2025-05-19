'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
// import { Button } from '@/components/ui/button'; // Assuming we stick with standard button for now
import { User } from '@supabase/supabase-js';
import LogoutButton from './auth/logout-button';
import { useFavorites } from '@/lib/contexts/favorites-context';
import {
  Home,
  Heart,
  FileText,
  RefreshCw,
  Palette,
  Clock,
  Database,
  FileImage,
  Archive,
  FileCode,
  Braces,
  FileDigit,
} from 'lucide-react';

interface MobileNavProps {
  user: User | null;
}

const MobileNav: React.FC<MobileNavProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isFavorited } = useFavorites();

  const sidebarTools = [
    { id: 10, name: 'Unit Converter', href: '/tools/unit-converter', icon: RefreshCw },
    { id: 11, name: 'Color Converter', href: '/tools/color-converter', icon: Palette },
    { id: 12, name: 'Time Calculator', href: '/tools/time-calculator', icon: Clock },
    { id: 13, name: 'Data Calculator', href: '/tools/data-calculator', icon: Database },
  ];

  const sidebarCompressorTools = [
    { id: 14, name: 'Image Compressor', href: '/tools/image-compressor', icon: FileImage },
    { id: 15, name: 'File Archiver', href: '/tools/file-archiver', icon: Archive },
    { id: 16, name: 'Code Minifier', href: '/tools/code-minifier', icon: FileCode },
    { id: 17, name: 'JSON Compressor', href: '/tools/json-compressor', icon: Braces },
    { id: 18, name: 'PDF Compressor', href: '/tools/pdf-compressor', icon: FileDigit },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        type="button"
        className="fixed top-4 right-4 z-50 p-3 bg-black/20 backdrop-blur-md text-white rounded-md md:hidden flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-[280px] bg-[rgba(30,30,30,0.75)] backdrop-blur-xl border-l border-white/10 overflow-y-auto transition-transform duration-300 shadow-2xl ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">DEVTOOLS</h2>
              <button
                type="button"
                className="p-1 text-white hover:bg-white/10 rounded-full md:hidden"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Main Navigation */}
            <div className="space-y-2 mb-6">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/favourites"
                className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart size={20} />
                <span>Favourites</span>
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FileText size={20} />
                <span>News</span>
              </Link>
            </div>

            {/* Calculators Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white/60 mb-2 px-3">Calculators</h3>
              <div className="space-y-1">
                {sidebarTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <tool.icon size={20} />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Compressors Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white/60 mb-2 px-3">Compressors</h3>
              <div className="space-y-1">
                {sidebarCompressorTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <tool.icon size={20} />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Section */}
            <div className="pt-6 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/profile"
                    className="text-white hover:text-white/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {user.user_metadata?.display_name || user.email}
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav; 