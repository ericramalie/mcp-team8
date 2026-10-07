/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AffordabilityCalculatorModal } from './components/AffordabilityCalculatorModal';
import { UraMarketTrendsModal } from './components/UraMarketTrendsModal';
import { MembershipModal } from './components/MembershipModal';
import { AlertsSubscriptionModal } from './components/AlertsSubscriptionModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { BtoTrackerSection } from './components/BtoTrackerSection';
import { Footer } from './components/Footer';
import { MOCK_PROPERTIES } from './data/mockProperties';
import { FilterState, PropertyCategory, PropertyListing } from './types/property';
import { RotateCcw, Home, Sparkles, Building2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 20000000,
  minPsf: 0,
  maxPsf: 5000,
  bedrooms: 'all',
  region: 'all',
  maxMrtDistance: 'any',
  schoolWithin1kmOnly: false,
  tenure: 'all',
  minRemainingLease: 'any',
  hasCarparkVacancy: false,
  sortBy: 'recommended',
  targetSegment: 'all',
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('estatepulse_saved_ids');
      return stored ? JSON.parse(stored) : ['prop-001', 'prop-005'];
    } catch {
      return ['prop-001', 'prop-005'];
    }
  });

  // Modal / Drawer states
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorPrice, setCalculatorPrice] = useState<number>(1850000);
  const [calculatorPropType, setCalculatorPropType] = useState<'private' | 'hdb'>('private');

  const [marketTrendsOpen, setMarketTrendsOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);

  // Sync saved list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estatepulse_saved_ids', JSON.stringify(savedPropertyIds));
    } catch {
      // ignore
    }
  }, [savedPropertyIds]);

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectProperty = (property: PropertyListing) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
  };

  const handleOpenCalculatorForProperty = (property: PropertyListing) => {
    setCalculatorPrice(property.price);
    setCalculatorPropType(property.category === 'bto' || property.category === 'hdb_resale' ? 'hdb' : 'private');
    setCalculatorOpen(true);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filter & Sort logic
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      // Category filter
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }

      // Target Persona segment
      if (filters.targetSegment === 'family' && p.familyFriendlyScore < 85) {
        return false;
      }
      if (filters.targetSegment === 'young_pro' && p.youngProScore < 85) {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDistrict = p.district.toLowerCase().includes(query) || p.districtCode.toLowerCase().includes(query);
        const matchesMrt = p.nearestMrt.toLowerCase().includes(query);
        const matchesSchool = p.schoolsNearby.some((s) => s.name.toLowerCase().includes(query));
        const matchesDeveloper = p.developer ? p.developer.toLowerCase().includes(query) : false;

        if (!matchesTitle && !matchesDistrict && !matchesMrt && !matchesSchool && !matchesDeveloper) {
          return false;
        }
      }

      // Price filter
      if (p.price < filters.minPrice || p.price > filters.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'all' && p.bedrooms < filters.bedrooms) {
        return false;
      }

      // Region filter
      if (filters.region !== 'all' && p.region !== filters.region) {
        return false;
      }

      // School within 1km filter
      if (filters.schoolWithin1kmOnly && !p.schoolsNearby.some((s) => s.within1km)) {
        return false;
      }

      // MRT distance filter
      if (filters.maxMrtDistance !== 'any' && p.mrtDistanceMeters > filters.maxMrtDistance) {
        return false;
      }

      // Tenure filter
      if (filters.tenure === 'freehold' && p.tenure !== 'Freehold') {
        return false;
      }
      if (filters.tenure === 'leasehold' && !p.tenure.includes('Leasehold')) {
        return false;
      }

      // Carpark vacancy filter
      if (filters.hasCarparkVacancy && p.liveCarpark.availableLots <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'psf_asc':
          return a.pricePerSqFt - b.pricePerSqFt;
        case 'psf_desc':
          return b.pricePerSqFt - a.pricePerSqFt;
        case 'yield_desc':
          return b.rentalYieldPercent - a.rentalYieldPercent;
        case 'newest':
          return b.builtYear - a.builtYear;
        case 'recommended':
        default:
          if (filters.targetSegment === 'family') {
            return b.familyFriendlyScore - a.familyFriendlyScore;
          }
          if (filters.targetSegment === 'young_pro') {
            return b.youngProScore - a.youngProScore;
          }
          return 0;
      }
    });
  }, [filters]);

  const savedPropertiesList = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  }, [savedPropertyIds]);

  const btoLaunches = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => p.category === 'bto');
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Strict 3-Zone Top Bar */}
      <Navbar
        savedCount={savedPropertyIds.length}
        onOpenCalculator={() => {
          setCalculatorPrice(1850000);
          setCalculatorPropType('private');
          setCalculatorOpen(true);
        }}
        onOpenMarketTrends={() => setMarketTrendsOpen(true)}
        onOpenMembership={() => setMembershipOpen(true)}
        onOpenSavedDrawer={() => setSavedDrawerOpen(true)}
        onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
      />

      {/* Hero Section with Official Data Synthesis */}
      <HeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
        targetSegment={filters.targetSegment}
        onTargetSegmentChange={(seg) => setFilters({ ...filters, targetSegment: seg })}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
        onOpenCalculator={() => {
          setCalculatorPrice(1850000);
          setCalculatorPropType('private');
          setCalculatorOpen(true);
        }}
        onOpenMarketTrends={() => setMarketTrendsOpen(true)}
      />

      {/* Main Catalog & Listings Explorer Area */}
      <main id="listings-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Section Title & Subheading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
              <span>Market Explorer</span>
              <span aria-hidden="true">·</span>
              <span>Updated with live URA & LTA feeds</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900">
              {filters.category === 'all'
                ? 'Singapore Residential Properties'
                : filters.category === 'new_launch'
                ? 'Private New Launch Condominiums'
                : filters.category === 'bto'
                ? 'Latest HDB BTO Launches'
                : filters.category === 'condo_resale'
                ? 'Private Resale Condominiums'
                : filters.category === 'hdb_resale'
                ? 'HDB Resale Flats'
                : 'Landed Residences'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAlertsOpen(true)}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Set Price Alert (Weekly)
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          totalResultsCount={filteredProperties.length}
        />

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedPropertyIds.includes(property.id)}
                onToggleSave={toggleSaveProperty}
                onSelectProperty={handleSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto my-12">
            <Building2 className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-900 font-display mb-1">No matching properties found</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Try adjusting your price range, school distance, or region filters to see available listings.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Dedicated HDB BTO Tracker Section (matching BMC canvas) */}
        <BtoTrackerSection
          btoProperties={btoLaunches}
          onSelectProperty={handleSelectProperty}
          onOpenCalculatorForProperty={handleOpenCalculatorForProperty}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenNewsletter={() => setAlertsOpen(true)}
        onOpenCalculator={() => {
          setCalculatorPrice(1850000);
          setCalculatorPropType('private');
          setCalculatorOpen(true);
        }}
        onOpenMarketTrends={() => setMarketTrendsOpen(true)}
      />

      {/* Interactive Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={toggleSaveProperty}
        onOpenCalculatorForProperty={(p) => {
          handleOpenCalculatorForProperty(p);
        }}
      />

      <AffordabilityCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        initialPrice={calculatorPrice}
        initialPropertyType={calculatorPropType}
      />

      <UraMarketTrendsModal
        isOpen={marketTrendsOpen}
        onClose={() => setMarketTrendsOpen(false)}
      />

      <MembershipModal
        isOpen={membershipOpen}
        onClose={() => setMembershipOpen(false)}
      />

      <AlertsSubscriptionModal
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
      />

      <SavedPropertiesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSaved={toggleSaveProperty}
        onSelectProperty={handleSelectProperty}
        onOpenCalculator={() => {
          setCalculatorPrice(
            savedPropertiesList.length > 0 ? savedPropertiesList[0].price : 1850000
          );
          setCalculatorOpen(true);
        }}
      />
    </div>
  );
}
