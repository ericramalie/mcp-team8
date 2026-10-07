import React, { useState } from 'react';
import { Bookmark, MapPin, Train, School, Car, TrendingDown, TrendingUp, Building } from 'lucide-react';
import { PropertyListing } from '../types/property';

interface PropertyCardProps {
  property: PropertyListing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: PropertyListing) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelectProperty,
}) => {
  const [imageError, setImageError] = useState(false);

  // URA benchmark comparison
  const psfDiff = property.pricePerSqFt - property.uraMedianPsf;
  const psfPercentDiff = ((psfDiff / property.uraMedianPsf) * 100).toFixed(1);
  const isBelowUraMedian = psfDiff <= 0;

  // Primary school within 1km (if any)
  const school1km = property.schoolsNearby.find((s) => s.within1km);

  return (
    <article
      onClick={() => onSelectProperty(property)}
      className="group bg-white rounded-xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
        {!imageError ? (
          <img
            src={property.imageUrl}
            alt={property.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 p-4">
            <Building className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium text-neutral-500">{property.title}</span>
          </div>
        )}

        {/* Favorite Bookmark Button */}
        <button
          type="button"
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isSaved
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Subdued Quiet Scrim Label: Category & District */}
        <div className="absolute bottom-2.5 left-3 text-xs text-white/95 font-medium drop-shadow-md flex items-center gap-1.5">
          <span>{property.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{property.districtCode}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Kicker (Zero-Pill Compliance) */}
          <div className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1.5">
            <span>{property.region} Region</span>
            <span aria-hidden="true">·</span>
            <span>{property.district}</span>
            <span aria-hidden="true">·</span>
            <span>{property.tenure}</span>
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold text-neutral-900 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h2>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-neutral-900 font-display tabular-nums tracking-tight">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500 ml-1.5 tabular-nums">
                (${property.pricePerSqFt.toLocaleString()} psf)
              </span>
            </div>

            {/* URA Space Benchmark indicator */}
            <div
              className={`text-[11px] font-medium flex items-center gap-0.5 ${
                isBelowUraMedian ? 'text-emerald-700' : 'text-neutral-500'
              }`}
              title={`URA median for this district is $${property.uraMedianPsf.toLocaleString()} psf`}
            >
              {isBelowUraMedian ? (
                <>
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                  <span className="tabular-nums">{Math.abs(Number(psfPercentDiff))}% below URA med</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 text-neutral-400" />
                  <span className="tabular-nums">+{psfPercentDiff}% vs URA</span>
                </>
              )}
            </div>
          </div>

          {/* Property Dimensions & Layout Specs (Zero-Pill text separators) */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 pb-3 border-b border-neutral-100 mb-3 tabular-nums font-medium">
            <span>{property.bedrooms} Beds</span>
            <span aria-hidden="true">·</span>
            <span>{property.bathrooms} Baths</span>
            <span aria-hidden="true">·</span>
            <span>{property.areaSqFt.toLocaleString()} sqft</span>
            {property.remainingLeaseYears && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-500">{property.remainingLeaseYears}y lease</span>
              </>
            )}
          </div>
        </div>

        {/* Location & Data Signals (OneMap & Real-Time Carpark) */}
        <div className="space-y-1.5 text-xs text-neutral-600">
          {/* Nearest MRT */}
          <div className="flex items-center gap-1.5 text-neutral-700">
            <Train className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.nearestMrt}</span>
            <span className="text-neutral-400 shrink-0 tabular-nums">({property.mrtDistanceMeters}m)</span>
          </div>

          {/* School Proximity (OneMap priority) */}
          {school1km ? (
            <div className="flex items-center gap-1.5 text-emerald-800">
              <School className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">{school1km.name}</span>
              <span className="text-emerald-700 shrink-0 text-[11px] font-semibold">(&lt;1km priority)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
              <School className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate">{property.schoolsNearby[0]?.name} (1-2km)</span>
            </div>
          )}

          {/* Live Carpark Availability Feed */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1 text-cyan-800">
              <Car className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span className="tabular-nums font-semibold text-neutral-800">{property.liveCarpark.availableLots}</span>
              <span>lots free</span>
            </div>
            <span className="text-neutral-400 text-[10px]">LTA/HDB live</span>
          </div>
        </div>
      </div>
    </article>
  );
};
