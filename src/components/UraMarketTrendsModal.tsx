import React, { useState } from 'react';
import { X, TrendingUp, ShieldCheck, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface UraMarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UraMarketTrendsModal: React.FC<UraMarketTrendsModalProps> = ({ isOpen, onClose }) => {
  const [selectedView, setSelectedView] = useState<'condo' | 'hdb'>('condo');

  if (!isOpen) return null;

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'];

  const condoTrends = [
    { region: 'Core Central (CCR)', medianPsf: 2980, change: '+1.4%', volume: '1,420 caveats', high: 3200, low: 2750 },
    { region: 'Rest of Central (RCR)', medianPsf: 2480, change: '+2.8%', volume: '3,890 caveats', high: 2650, low: 2310 },
    { region: 'Outside Central (OCR)', medianPsf: 1980, change: '+3.1%', volume: '5,210 caveats', high: 2150, low: 1840 },
  ];

  const hdbTrends = [
    { town: 'Bishan / Toa Payoh (Central)', medianPsf: 890, change: '+2.2%', median4Room: '$890,000', median5Room: '$1,180,000' },
    { town: 'Queenstown / Bukit Merah', medianPsf: 960, change: '+3.5%', median4Room: '$940,000', median5Room: '$1,260,000' },
    { town: 'Kallang / Whampoa', medianPsf: 840, change: '+1.9%', median4Room: '$830,000', median5Room: '$1,040,000' },
    { town: 'Yishun / Sembawang (North)', medianPsf: 580, change: '+1.1%', median4Room: '$540,000', median5Room: '$690,000' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-700" />
            <div>
              <h1 className="text-base font-bold text-neutral-900 font-display">
                URA Space & HDB Resale Market Intelligence
              </h1>
              <span className="text-[11px] text-neutral-500">
                Official quarterly caveat transactions and price indices (Data.gov.sg & URA Space)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close trends"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Segment Toggle */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg max-w-xs text-xs">
            <button
              onClick={() => setSelectedView('condo')}
              className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
                selectedView === 'condo' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Private Residential (URA)
            </button>
            <button
              onClick={() => setSelectedView('hdb')}
              className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
                selectedView === 'hdb' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              HDB Resale Index (HDB)
            </button>
          </div>

          {/* Graphical Price Index Trend Mockup Bar Chart */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  {selectedView === 'condo' ? 'Singapore Private Property Price Index (PPI)' : 'HDB Resale Price Index (RPI)'}
                </h3>
                <span className="text-[11px] text-neutral-500">Indexed against 2024 Base (100.0)</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Current Index: {selectedView === 'condo' ? '194.2 (+3.2% YoY)' : '187.6 (+4.8% YoY)'}
              </span>
            </div>

            {/* Visual Quarter Bars */}
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 px-2 border-b border-neutral-200">
              {[
                { q: 'Q1 25', val: 78, num: '178.4' },
                { q: 'Q2 25', val: 81, num: '181.2' },
                { q: 'Q3 25', val: 84, num: '183.9' },
                { q: 'Q4 25', val: 87, num: '186.5' },
                { q: 'Q1 26', val: 90, num: '189.1' },
                { q: 'Q2 26', val: 93, num: '191.8' },
                { q: 'Q3 26', val: 96, num: '194.2' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {item.num}
                  </span>
                  <div
                    className="w-full bg-emerald-600/80 group-hover:bg-emerald-600 rounded-t-sm transition-all"
                    style={{ height: `${item.val}%` }}
                  />
                  <span className="text-[10px] text-neutral-600 font-medium whitespace-nowrap">{item.q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Median PSF Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3">
              Official Median PSF By Sector (Last 90 Days Caveats)
            </h3>

            {selectedView === 'condo' ? (
              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                    <tr>
                      <th className="p-3">Planning Region</th>
                      <th className="p-3">Median Transacted PSF</th>
                      <th className="p-3">Quarterly Change</th>
                      <th className="p-3">Caveat Volume</th>
                      <th className="p-3">Price Range (PSF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {condoTrends.map((t, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-neutral-900">{t.region}</td>
                        <td className="p-3 font-bold text-neutral-900 tabular-nums font-display">
                          ${t.medianPsf.toLocaleString()}
                        </td>
                        <td className="p-3 text-emerald-700 font-semibold tabular-nums">{t.change}</td>
                        <td className="p-3 text-neutral-600">{t.volume}</td>
                        <td className="p-3 text-neutral-500 tabular-nums">
                          ${t.low.toLocaleString()} – ${t.high.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                    <tr>
                      <th className="p-3">HDB Town</th>
                      <th className="p-3">Median Resale PSF</th>
                      <th className="p-3">QoQ Growth</th>
                      <th className="p-3">Median 4-Room</th>
                      <th className="p-3">Median 5-Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {hdbTrends.map((t, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-neutral-900">{t.town}</td>
                        <td className="p-3 font-bold text-neutral-900 tabular-nums font-display">
                          ${t.medianPsf.toLocaleString()}
                        </td>
                        <td className="p-3 text-emerald-700 font-semibold tabular-nums">{t.change}</td>
                        <td className="p-3 text-neutral-700 font-medium tabular-nums">{t.median4Room}</td>
                        <td className="p-3 text-neutral-700 font-medium tabular-nums">{t.median5Room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
