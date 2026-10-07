import React from 'react';
import { Search, MapPin, School, Building2, ShieldCheck, Car, Sparkles, ArrowRight } from 'lucide-react';
import { PropertyCategory } from '../types/property';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  targetSegment: 'all' | 'family' | 'young_pro';
  onTargetSegmentChange: (seg: 'all' | 'family' | 'young_pro') => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (cat: PropertyCategory) => void;
  onOpenCalculator: () => void;
  onOpenMarketTrends: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  targetSegment,
  onTargetSegmentChange,
  selectedCategory,
  onSelectCategory,
  onOpenCalculator,
  onOpenMarketTrends,
}) => {
  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background with Generated High-Fidelity Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_singapore_condo_1791357754159.jpg"
          alt="Modern Singapore residential architecture"
          className="w-full h-full object-cover object-center brightness-60"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrim for high contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-neutral-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
        {/* Editorial Eyebrow & Headline */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-3 tracking-wide uppercase">
            <span>Official Government Data Synthesis</span>
            <span aria-hidden="true">·</span>
            <span>URA Space & OneMap Verified</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-4 text-balance">
            Find Singapore homes with real transacted pricing & true cost calculations.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-light mb-8">
            Filter by 1km primary school priority, live carpark availability, remaining lease tenure,
            and instant MAS regulatory affordability simulations.
          </p>
        </div>

        {/* Persona Mode Switchers - Directly matching the BMC Customer Segments */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium mr-1">Curated Presets:</span>
          <button
            onClick={() => onTargetSegmentChange('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              targetSegment === 'all'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => onTargetSegmentChange('family')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              targetSegment === 'family'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200'
            }`}
          >
            <School className="w-3.5 h-3.5 text-emerald-300" />
            Family Mode (Top 1km Schools & 3-5 Beds)
          </button>
          <button
            onClick={() => onTargetSegmentChange('young_pro')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              targetSegment === 'young_pro'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            Young Professionals (CBD & &lt;500m MRT)
          </button>
        </div>

        {/* Quick Search & Category Bar */}
        <div className="bg-white rounded-xl shadow-xl p-3 md:p-4 text-neutral-900 border border-neutral-200/80 max-w-4xl">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-100 mb-3 text-xs">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'new_launch', label: 'Private New Launch' },
              { id: 'bto', label: 'Latest BTO Launches' },
              { id: 'condo_resale', label: 'Condo Resale' },
              { id: 'hdb_resale', label: 'HDB Resale Flats' },
              { id: 'landed', label: 'Landed Homes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as PropertyCategory)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by project name, district (e.g. D15, Tanjong Pagar), MRT, or primary school..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 transition-all border border-neutral-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('listings-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
              >
                <span>Find Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Partners & Key Resources Strip (Directly addressing BMC key partners) */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-200 block">URA Space</span>
              <span className="text-[11px] text-neutral-400">Caveat price benchmarks</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-200 block">OneMap SLA</span>
              <span className="text-[11px] text-neutral-400">1km school radius & MRT</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-200 block">HDB Datasets</span>
              <span className="text-[11px] text-neutral-400">Resale txns & lease decay</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-200 block">Real-time SG</span>
              <span className="text-[11px] text-neutral-400">Live carpark lot counters</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-200 block">MAS Framework</span>
              <span className="text-[11px] text-neutral-400">TDSR 55% · MSR 30% · BSD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
