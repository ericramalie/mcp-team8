import React, { useState } from 'react';
import { X, Bookmark, Share2, MapPin, Train, School, Car, ShieldCheck, Calendar, Building, DollarSign, Calculator, Check, Phone, MessageSquare } from 'lucide-react';
import { PropertyListing } from '../types/property';
import { calculateBsd, calculateMonthlyMortgage } from '../utils/masCalculations';

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenCalculatorForProperty: (property: PropertyListing) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onOpenCalculatorForProperty,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showViewingSuccess, setShowViewingSuccess] = useState(false);
  const [viewingDate, setViewingDate] = useState('2026-10-10');
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');

  if (!isOpen || !property) return null;

  const bsd = calculateBsd(property.price);
  const estimatedDownpayment = Math.round(property.price * 0.25); // 5% cash + 20% CPF
  const estimatedMonthlyMortgage = calculateMonthlyMortgage(property.price * 0.75, 3.5, 30);

  const handleBookViewing = (e: React.FormEvent) => {
    e.preventDefault();
    setShowViewingSuccess(true);
    setTimeout(() => {
      setShowViewingSuccess(false);
    }, 4000);
  };

  const images = property.galleryUrls && property.galleryUrls.length > 0 ? property.galleryUrls : [property.imageUrl];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>{property.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{property.districtCode}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">{property.region} Region</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950">
              <img
                src={images[activeImageIndex] || property.imageUrl}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md tabular-nums">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-emerald-600 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Pricing Grid */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 font-display mb-1">{property.title}</h1>
              <p className="text-sm text-neutral-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{property.address}, Singapore {property.postalCode}</span>
              </p>
            </div>

            <div className="text-left md:text-right">
              <div className="text-3xl font-extrabold text-neutral-900 font-display tabular-nums">
                ${property.price.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500 tabular-nums mt-0.5">
                ${property.pricePerSqFt.toLocaleString()} psf · Maintenance: ${property.maintenanceFeeMonth}/mo
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-500 uppercase font-semibold block mb-0.5">Layout</span>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                {property.bedrooms} Bed · {property.bathrooms} Bath
              </span>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-500 uppercase font-semibold block mb-0.5">Floor Area</span>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                {property.areaSqFt.toLocaleString()} sqft
              </span>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-500 uppercase font-semibold block mb-0.5">Tenure & Lease</span>
              <span className="text-sm font-semibold text-neutral-900">
                {property.tenure} {property.remainingLeaseYears ? `(${property.remainingLeaseYears}y left)` : ''}
              </span>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100">
              <span className="text-[11px] text-neutral-500 uppercase font-semibold block mb-0.5">Floor Level / TOP</span>
              <span className="text-sm font-semibold text-neutral-900 truncate block">
                {property.topDate || property.floorLevel}
              </span>
            </div>
          </div>

          {/* MAS Quick Cost Estimator Callout */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-800" />
                <h2 className="text-sm font-bold text-emerald-900">
                  MAS True Total Cost Snapshot (Singapore Citizen 1st Property)
                </h2>
              </div>
              <button
                onClick={() => onOpenCalculatorForProperty(property)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Customize in Full MAS Simulator →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100">
                <span className="text-neutral-500 block text-[11px]">Est. 25% Downpayment</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  ${estimatedDownpayment.toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">5% Cash + 20% CPF OA</span>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100">
                <span className="text-neutral-500 block text-[11px]">Buyer Stamp Duty (BSD)</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  ${bsd.toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">IRAS Tiered Schedule</span>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-emerald-100">
                <span className="text-neutral-500 block text-[11px]">Est. Monthly Installment</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  ${estimatedMonthlyMortgage.toLocaleString()}/mo
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">At 3.5% p.a. over 30 yrs</span>
              </div>
            </div>
          </div>

          {/* Official Data Services Insights: URA Space, OneMap & Real-Time Carpark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URA Space & Transacted Data */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  URA Space Transaction Benchmark
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-600">Asking Price PSF:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${property.pricePerSqFt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-600">URA Median Caveat ({property.districtCode}):</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${property.uraMedianPsf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-600">Estimated Gross Rental Yield:</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">{property.rentalYieldPercent}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-600">Master Plan Zoning:</span>
                  <span className="font-semibold text-neutral-900">Residential (Plot Ratio 2.8)</span>
                </div>
              </div>
            </div>

            {/* OneMap & Live Carpark Feed */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-cyan-700" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  OneMap Amenities & Real-Time SG Carpark
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-neutral-200/60">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <Train className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{property.nearestMrt}</span>
                  </div>
                  <span className="font-semibold text-neutral-900 tabular-nums">{property.mrtDistanceMeters}m</span>
                </div>

                <div className="py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-600 block mb-1">Schools within 1km–2km:</span>
                  <div className="space-y-1">
                    {property.schoolsNearby.map((sch, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-neutral-800">{sch.name}</span>
                        <span className={sch.within1km ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
                          {sch.distanceKm} km {sch.within1km ? '(1km Priority)' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-neutral-600 block text-[11px]">{property.liveCarpark.name}</span>
                    <span className="text-[10px] text-neutral-400">Feed: {property.liveCarpark.lastUpdated}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-cyan-800 text-sm tabular-nums">
                      {property.liveCarpark.availableLots} / {property.liveCarpark.totalLots}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Lots Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-2">Property Description & Insights</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Booking / Viewing Form */}
          <div className="bg-neutral-100 p-4 sm:p-5 rounded-xl border border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Schedule Official Viewing or Developer Preview</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Direct liaison with registered CEA certified agents and developer sales galleries. No agent commission for buyers.
            </p>

            {showViewingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Viewing request received! Our sales representative will WhatsApp you within 15 minutes.</span>
              </div>
            ) : (
              <form onSubmit={handleBookViewing} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <input
                  type="tel"
                  placeholder="Mobile (WhatsApp)"
                  required
                  value={buyerContact}
                  onChange={(e) => setBuyerContact(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <input
                  type="date"
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Confirm Slot
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
