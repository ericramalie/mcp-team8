import React from 'react';
import { X, Trash2, ArrowRight, ExternalLink, Calculator } from 'lucide-react';
import { PropertyListing } from '../types/property';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: PropertyListing[];
  onRemoveSaved: (id: string) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onOpenCalculator: () => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSaved,
  onSelectProperty,
  onOpenCalculator,
}) => {
  if (!isOpen) return null;

  const totalPortfolioValue = savedProperties.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-neutral-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-neutral-900 font-display">Saved Properties Watchlist</h2>
            <span className="text-xs text-neutral-500 tabular-nums">
              {savedProperties.length} {savedProperties.length === 1 ? 'listing' : 'listings'} saved
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close saved drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <span className="text-sm font-medium mb-1">No saved listings yet</span>
              <p className="text-xs text-neutral-500">
                Click the bookmark icon on any property card to compare listings and track price changes.
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-xl p-3 flex gap-3 transition-colors relative group"
              >
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 text-xs">
                  <div className="text-[11px] text-neutral-500 truncate mb-0.5">
                    {prop.categoryLabel} · {prop.districtCode}
                  </div>
                  <h4
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="font-semibold text-neutral-900 truncate cursor-pointer hover:text-emerald-700 mb-1"
                  >
                    {prop.title}
                  </h4>
                  <div className="font-bold text-neutral-900 tabular-nums text-sm">
                    ${prop.price.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500 tabular-nums">
                    {prop.bedrooms} Bed · {prop.areaSqFt} sqft · ${prop.pricePerSqFt} psf
                  </div>
                </div>

                <button
                  onClick={() => onRemoveSaved(prop.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove from saved"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Total Combined Value:</span>
              <span className="font-bold text-neutral-900 tabular-nums">
                ${totalPortfolioValue.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCalculator();
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Analyze Portfolio in MAS Calculator</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
