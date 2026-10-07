import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close membership modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EstatePulse Pro Intelligence Tier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-900 mb-2">
            Institutional-Grade Real Estate Analytics
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Directly connect with URA Space bulk caveat data, OneMap Phase 2C school balloting heatmaps, and MAS multi-property portfolio simulations.
          </p>
        </div>

        {/* Billing Switcher */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-neutral-100 p-1 rounded-xl flex items-center text-xs font-medium">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600'
              }`}
            >
              Monthly ($29 / mo)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'yearly' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600'
              }`}
            >
              <span>Yearly ($288 / yr)</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs space-y-2.5">
            <div className="font-bold text-neutral-700 text-sm mb-1">Standard Free Tier</div>
            <ul className="space-y-2 text-neutral-600">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Public listing search & filters</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Basic MAS affordability calculator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Live carpark vacancy feeds</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/30 text-xs space-y-2.5 relative">
            <div className="font-bold text-neutral-900 text-sm mb-1 flex items-center justify-between">
              <span>Pro Member</span>
              <span className="text-emerald-700 font-extrabold tabular-nums font-display">
                {billingCycle === 'yearly' ? '$288/year' : '$29/month'}
              </span>
            </div>
            <ul className="space-y-2 text-neutral-800">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <strong>Direct URA Caveat .CSV downloads</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <strong>Primary School Phase 2C balloting odds</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <strong>Automated price drop SMS alerts</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <strong>Full TDSR & Decoupling tax simulation</strong>
              </li>
            </ul>
          </div>
        </div>

        {subscribed ? (
          <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-center text-xs font-semibold">
            ✓ Pro Membership activated! Welcome to EstatePulse SG Pro.
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Activate {billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Membership</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="text-center text-[11px] text-neutral-400 mt-3">
          Cancel anytime · 14-day money-back guarantee · Official billing receipt provided
        </div>
      </div>
    </div>
  );
};
