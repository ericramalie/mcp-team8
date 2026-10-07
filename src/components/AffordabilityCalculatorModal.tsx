import React, { useState, useEffect } from 'react';
import { X, Calculator, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { BuyerResidency, TrueCostCalculationInput } from '../types/property';
import { calculateTrueCost } from '../utils/masCalculations';

interface AffordabilityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
  initialPropertyType?: 'private' | 'hdb';
}

export const AffordabilityCalculatorModal: React.FC<AffordabilityCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 1850000,
  initialPropertyType = 'private',
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [buyerType, setBuyerType] = useState<BuyerResidency>('citizen_first');
  const [propertyType, setPropertyType] = useState<'private' | 'hdb'>(initialPropertyType);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<number>(14000);
  const [monthlyExistingDebts, setMonthlyExistingDebts] = useState<number>(1200);
  const [cpfOaAvailable, setCpfOaAvailable] = useState<number>(220000);
  const [cashOnHand, setCashOnHand] = useState<number>(180000);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(30);
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(3.5);

  useEffect(() => {
    if (initialPrice) {
      setPropertyPrice(initialPrice);
    }
    if (initialPropertyType) {
      setPropertyType(initialPropertyType);
    }
  }, [initialPrice, initialPropertyType, isOpen]);

  if (!isOpen) return null;

  const input: TrueCostCalculationInput = {
    propertyPrice,
    buyerType,
    loanTenureYears,
    interestRateAnnual,
    cpfOaAvailable,
    cashOnHand,
    grossMonthlyIncome,
    monthlyExistingDebts,
    propertyType,
  };

  const result = calculateTrueCost(input);

  const applyPreset = (preset: 'bto_couple' | 'condo_upgrader' | 'prime_investor') => {
    if (preset === 'bto_couple') {
      setPropertyPrice(650000);
      setPropertyType('hdb');
      setBuyerType('citizen_first');
      setGrossMonthlyIncome(9500);
      setMonthlyExistingDebts(400);
      setCpfOaAvailable(120000);
      setCashOnHand(60000);
      setLoanTenureYears(25);
      setInterestRateAnnual(2.6);
    } else if (preset === 'condo_upgrader') {
      setPropertyPrice(1950000);
      setPropertyType('private');
      setBuyerType('citizen_first');
      setGrossMonthlyIncome(16000);
      setMonthlyExistingDebts(1100);
      setCpfOaAvailable(280000);
      setCashOnHand(200000);
      setLoanTenureYears(30);
      setInterestRateAnnual(3.5);
    } else if (preset === 'prime_investor') {
      setPropertyPrice(3200000);
      setPropertyType('private');
      setBuyerType('citizen_second');
      setGrossMonthlyIncome(28000);
      setMonthlyExistingDebts(2500);
      setCpfOaAvailable(450000);
      setCashOnHand(650000);
      setLoanTenureYears(25);
      setInterestRateAnnual(3.5);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <div>
              <h1 className="text-base font-bold text-neutral-900 font-display">
                True Total Cost & MAS Affordability Calculator
              </h1>
              <span className="text-[11px] text-neutral-500">
                Incorporates TDSR 55%, MSR 30%, BSD/ABSD, and CPF OA regulations
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-500 font-medium shrink-0">Sample Scenarios:</span>
            <button
              onClick={() => applyPreset('bto_couple')}
              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              First-Time BTO Couple ($650k)
            </button>
            <button
              onClick={() => applyPreset('condo_upgrader')}
              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Private Condo Upgrader ($1.95M)
            </button>
            <button
              onClick={() => applyPreset('prime_investor')}
              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              2nd Property Investor ($3.2M + 20% ABSD)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              {/* Purchase Price */}
              <div>
                <label className="font-semibold text-neutral-800 block mb-1">
                  Purchase Price (SGD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-bold text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Property Type & Residency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as 'private' | 'hdb')}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="private">Private / Condo / Landed</option>
                    <option value="hdb">HDB Flat / BTO / EC</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Buyer Profile (ABSD Rate)
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as BuyerResidency)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 truncate"
                  >
                    <option value="citizen_first">SG Citizen (1st Property - 0% ABSD)</option>
                    <option value="citizen_second">SG Citizen (2nd Property - 20% ABSD)</option>
                    <option value="pr_first">Permanent Resident (1st - 5% ABSD)</option>
                    <option value="pr_second">Permanent Resident (2nd - 30% ABSD)</option>
                    <option value="foreigner">Foreigner (60% ABSD)</option>
                  </select>
                </div>
              </div>

              {/* Monthly Income & Existing Debts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Gross Household Income /mo
                  </label>
                  <input
                    type="number"
                    value={grossMonthlyIncome}
                    onChange={(e) => setGrossMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Existing Monthly Debts
                  </label>
                  <input
                    type="number"
                    value={monthlyExistingDebts}
                    onChange={(e) => setMonthlyExistingDebts(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Available CPF OA & Liquid Cash */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Available CPF Ordinary (OA)
                  </label>
                  <input
                    type="number"
                    value={cpfOaAvailable}
                    onChange={(e) => setCpfOaAvailable(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Liquid Cash Savings
                  </label>
                  <input
                    type="number"
                    value={cashOnHand}
                    onChange={(e) => setCashOnHand(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Loan Tenure & Interest Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Loan Tenure ({loanTenureYears} Years)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 block mb-1">
                    Interest Rate ({interestRateAnnual}% p.a.)
                  </label>
                  <input
                    type="range"
                    min="1.5"
                    max="6.0"
                    step="0.1"
                    value={interestRateAnnual}
                    onChange={(e) => setInterestRateAnnual(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: MAS Compliance Results & Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              {/* Verdict Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result.isAffordable
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                {result.isAffordable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <h3 className="font-bold text-sm mb-0.5">
                    {result.isAffordable ? 'MAS Regulatory Affordability Verified' : 'Affordability Action Required'}
                  </h3>
                  <p className="leading-relaxed opacity-90">{result.summaryNote}</p>
                </div>
              </div>

              {/* Key Results Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Monthly Mortgage Installment</span>
                  <span className="text-xl font-bold text-neutral-900 font-display tabular-nums">
                    ${result.monthlyMortgagePayment.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    {loanTenureYears}y tenure @ {interestRateAnnual}%
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Total Upfront Capital Required</span>
                  <span className="text-xl font-bold text-neutral-900 font-display tabular-nums">
                    ${result.totalUpfrontAcquisitionCost.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    Min cash: ${result.minCashDownpayment.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* MAS Regulatory Ratios Meters */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-neutral-800">
                      Total Debt Servicing Ratio (TDSR)
                    </span>
                    <span className={`font-bold tabular-nums ${result.tdsrPassed ? 'text-emerald-700' : 'text-red-600'}`}>
                      {result.tdsrRatioPercent}% / max 55%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.tdsrPassed ? 'bg-emerald-600' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (result.tdsrRatioPercent / 55) * 100)}%` }}
                    />
                  </div>
                </div>

                {propertyType === 'hdb' && result.msrRatioPercent !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-neutral-800">
                        Mortgage Servicing Ratio (MSR for HDB/EC)
                      </span>
                      <span className={`font-bold tabular-nums ${result.msrPassed ? 'text-emerald-700' : 'text-red-600'}`}>
                        {result.msrRatioPercent}% / max 30%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          result.msrPassed ? 'bg-emerald-600' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (result.msrRatioPercent / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Itemized Cost Breakdown Table */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Purchase Price:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${result.propertyPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Max Loan Amount ({result.maxLtvPercent}% LTV):</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${result.maxLoanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Min. 5% Cash Downpayment:</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${result.minCashDownpayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">CPF OA / Cash Downpayment (20%):</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${result.minCpfDownpayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-600">Buyer's Stamp Duty (BSD):</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">${result.bsdAmount.toLocaleString()}</span>
                </div>
                {result.absdAmount > 0 && (
                  <div className="flex justify-between py-1 border-b border-neutral-100 text-amber-700">
                    <span>Additional Stamp Duty (ABSD {result.absdRatePercent}%):</span>
                    <span className="font-semibold tabular-nums">${result.absdAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 pt-1 font-bold text-neutral-900">
                  <span>Total Upfront Cash & CPF Needed:</span>
                  <span className="text-emerald-800 text-sm tabular-nums">${result.totalUpfrontAcquisitionCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
