import React from 'react';
import { Building2, Calendar, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { PropertyListing } from '../types/property';

interface BtoTrackerSectionProps {
  btoProperties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onOpenCalculatorForProperty: (property: PropertyListing) => void;
}

export const BtoTrackerSection: React.FC<BtoTrackerSectionProps> = ({
  btoProperties,
  onSelectProperty,
  onOpenCalculatorForProperty,
}) => {
  return (
    <section className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 my-10 border border-neutral-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">
            <Building2 className="w-4 h-4" />
            <span>Singapore Housing & Development Board (HDB) Launches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Latest BTO Exercises & Classification Framework
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
            Browse new Standard, Plus, and Prime category launches with subsidized pricing,
            tightened 10-year Minimum Occupation Periods (MOP), and subsidy clawbacks.
          </p>
        </div>

        {/* Framework Pill-Free Explanatory Summary */}
        <div className="text-xs text-neutral-300 bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-700/80 max-w-sm">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>MND BTO Classification Rules</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            <strong>Standard:</strong> 5-yr MOP, standard subsidies.<br />
            <strong>Plus & Prime:</strong> 10-yr MOP, 6%-9% resale subsidy clawback, $14k income ceiling on resale.
          </p>
        </div>
      </div>

      {/* BTO Launches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {btoProperties.map((bto) => (
          <div
            key={bto.id}
            className="bg-neutral-800/90 rounded-xl border border-neutral-700 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
          >
            <div className="p-5">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-semibold text-emerald-400">{bto.btoLaunchQuarter}</span>
                <span className="text-neutral-500">{bto.district} ({bto.districtCode})</span>
              </div>

              <h3 className="text-lg font-bold text-white font-display mb-1">{bto.title}</h3>
              <p className="text-xs text-neutral-300 line-clamp-2 mb-4">{bto.description}</p>

              {/* Price & Details Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-neutral-700 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] block">Indicative Price</span>
                  <span className="font-bold text-white text-base tabular-nums">${bto.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Unit Model</span>
                  <span className="font-semibold text-neutral-200">{bto.bedrooms} Bedroom</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Nearest MRT</span>
                  <span className="font-semibold text-neutral-200 truncate block">{bto.nearestMrt}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-neutral-900/80 border-t border-neutral-700/60 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Remaining Lease: <strong className="text-white font-semibold">{bto.remainingLeaseYears} Years</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCalculatorForProperty(bto)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Calc Grant & Loan
                </button>
                <button
                  onClick={() => onSelectProperty(bto)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
