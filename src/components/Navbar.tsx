import React from 'react';
import { Bookmark, Calculator, Sparkles, TrendingUp, Activity } from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  onOpenCalculator: () => void;
  onOpenMarketTrends: () => void;
  onOpenMembership: () => void;
  onOpenSavedDrawer: () => void;
  onOpenApiMonitor: () => void;
  onSelectCategory: (category: 'all' | 'new_launch' | 'bto' | 'condo_resale' | 'hdb_resale' | 'landed') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenCalculator,
  onOpenMarketTrends,
  onOpenMembership,
  onOpenSavedDrawer,
  onOpenApiMonitor,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl font-bold tracking-tight text-neutral-900 font-display hover:text-emerald-800 transition-colors"
          >
            EstatePulse SG
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => {
              onSelectCategory('all');
              const el = document.getElementById('listings-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            All Listings
          </button>
          <button
            onClick={() => {
              onSelectCategory('new_launch');
              const el = document.getElementById('listings-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            New Launches
          </button>
          <button
            onClick={() => {
              onSelectCategory('bto');
              const el = document.getElementById('listings-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            BTO Exercise
          </button>
          <button
            onClick={onOpenCalculator}
            className="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            MAS Affordability
          </button>
          <button
            onClick={onOpenMarketTrends}
            className="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
            URA Market Data
          </button>
          <button
            onClick={onOpenApiMonitor}
            className="hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-800 font-semibold"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            API Health
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSavedDrawer}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="Saved listings"
            aria-label="View saved listings"
          >
            <Bookmark className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-semibold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center tabular-nums">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenMembership}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Pro Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
