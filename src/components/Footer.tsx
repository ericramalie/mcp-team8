import React from 'react';
import { Mail, Shield } from 'lucide-react';

interface FooterProps {
  onOpenNewsletter: () => void;
  onOpenCalculator: () => void;
  onOpenMarketTrends: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenNewsletter,
  onOpenCalculator,
  onOpenMarketTrends,
}) => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-lg font-bold text-neutral-900 font-display block">EstatePulse SG</span>
            <p className="text-neutral-500 leading-relaxed text-xs">
              Singapore property intelligence platform synthesizing official URA Space caveat data,
              OneMap SLA geospatial metrics, real-time carpark availability, and MAS affordability stress tests.
            </p>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 text-xs uppercase tracking-wider">
              Calculators & Datasets
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  MAS True Total Cost Calculator (TDSR 55%)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMarketTrends}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  URA Space Caveat & PSF Price Tracker
                </button>
              </li>
              <li>
                <span className="text-neutral-500">OneMap SLA 1km Primary School Radius</span>
              </li>
              <li>
                <span className="text-neutral-500">LTA / HDB Real-Time Carpark Availability</span>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 text-xs uppercase tracking-wider">
              Market Segments
            </h4>
            <ul className="space-y-2 text-neutral-500">
              <li>Private New Launch (Core & Rest of Central)</li>
              <li>HDB BTO Standard, Plus & Prime Exercises</li>
              <li>District 9, 10, 11 Prime Freehold Residences</li>
              <li>District 15 Marine Parade / East Coast Belt</li>
            </ul>
          </div>

          {/* Updates & Mailer */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 text-xs uppercase tracking-wider">
              Weekly Market Digest
            </h4>
            <p className="text-neutral-500 mb-3 text-xs">
              Receive newly registered caveats, below-market listings, and BTO application updates once a week.
            </p>
            <button
              onClick={onOpenNewsletter}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Subscribe to Weekly Mailer</span>
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-[11px]">
          <div>
            © 2026 EstatePulse SG. Data referenced from URA Space, SLA OneMap, HDB Resale Data, and MAS.
          </div>
          <div className="flex items-center gap-4">
            <span>Regulatory Disclaimers</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
