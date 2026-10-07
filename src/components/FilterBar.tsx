import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, School, Car, Train, Building } from 'lucide-react';
import { FilterState, PropertyCategory, SingaporeRegion } from '../types/property';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 20000000,
    filters.bedrooms !== 'all',
    filters.region !== 'all',
    filters.schoolWithin1kmOnly,
    filters.maxMrtDistance !== 'any',
    filters.tenure !== 'all',
    filters.minRemainingLease !== 'any',
    filters.hasCarparkVacancy,
    filters.targetSegment !== 'all',
  ].filter(Boolean).length;

  const handleBedroomsClick = (bed: number | 'all') => {
    onFilterChange({ ...filters, bedrooms: bed });
  };

  const handleRegionClick = (region: 'all' | SingaporeRegion) => {
    onFilterChange({ ...filters, region });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-4 mb-6">
      {/* Top Bar: Quick Sort & Filter Drawer Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs text-neutral-500 hover:text-neutral-800 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          )}

          <div className="text-xs text-neutral-500 hidden sm:block">
            Showing <strong className="text-neutral-900 font-semibold">{totalResultsCount}</strong> verified properties
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="recommended">Featured / Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="psf_asc">PSF: Low to High</option>
            <option value="psf_desc">PSF: High to Low</option>
            <option value="yield_desc">Highest Rental Yield</option>
            <option value="newest">Newest Listed</option>
          </select>
        </div>
      </div>

      {/* Primary Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-3">
        {/* Bedrooms Quick Selector */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-500 px-2 uppercase">Beds:</span>
          {(['all', 1, 2, 3, 4, 5] as const).map((bed) => (
            <button
              key={bed}
              onClick={() => handleBedroomsClick(bed)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filters.bedrooms === bed
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {bed === 'all' ? 'All' : `${bed}+`}
            </button>
          ))}
        </div>

        {/* Region Quick Selector (CCR, RCR, OCR) */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          <span className="text-[11px] font-semibold text-neutral-500 px-2 uppercase">Region:</span>
          {(['all', 'CCR', 'RCR', 'OCR'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => handleRegionClick(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filters.region === reg
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {reg === 'all' ? 'All SG' : reg}
            </button>
          ))}
        </div>

        {/* School Proximity Quick Toggle (BMC Family requirement) */}
        <button
          onClick={() => onFilterChange({ ...filters, schoolWithin1kmOnly: !filters.schoolWithin1kmOnly })}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border ${
            filters.schoolWithin1kmOnly
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <School className="w-3.5 h-3.5 text-emerald-600" />
          <span>Within 1km of Top Primary</span>
        </button>

        {/* Live Carpark Vacancy Quick Toggle (BMC Real-time SG requirement) */}
        <button
          onClick={() => onFilterChange({ ...filters, hasCarparkVacancy: !filters.hasCarparkVacancy })}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border ${
            filters.hasCarparkVacancy
              ? 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-cyan-600" />
          <span>Available Carpark Lots Now</span>
        </button>
      </div>

      {/* Expanded Detailed Filters Panel */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs animate-in fade-in duration-150">
          {/* Price Range */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1.5">
              Maximum Purchase Price: <span className="tabular-nums font-bold text-emerald-700">${(filters.maxPrice / 1000000).toFixed(1)}M</span>
            </label>
            <input
              type="range"
              min="400000"
              max="20000000"
              step="100000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1 tabular-nums">
              <span>$400K (BTO)</span>
              <span>$3M (Condo)</span>
              <span>$20M+ (Landed)</span>
            </div>
          </div>

          {/* MRT Proximity */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1.5 flex items-center gap-1">
              <Train className="w-3.5 h-3.5 text-neutral-600" />
              <span>Walk to Nearest MRT Station</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { value: 'any', label: 'Any' },
                { value: 300, label: '< 300m' },
                { value: 500, label: '< 500m' },
                { value: 1000, label: '< 1km' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => onFilterChange({ ...filters, maxMrtDistance: opt.value as number | 'any' })}
                  className={`flex-1 py-1.5 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                    filters.maxMrtDistance === opt.value
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tenure & Remaining Lease (BMC "age of property" requirement) */}
          <div>
            <label className="font-semibold text-neutral-800 block mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-neutral-600" />
              <span>Tenure & Remaining Lease</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { value: 'all', label: 'All Tenure' },
                { value: 'freehold', label: 'Freehold Only' },
                { value: 'leasehold', label: '99-Yr Lease' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, tenure: opt.value as FilterState['tenure'] })}
                  className={`flex-1 py-1.5 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                    filters.tenure === opt.value
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
