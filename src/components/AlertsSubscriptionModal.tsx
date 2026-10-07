import React, { useState } from 'react';
import { X, Mail, Check, Bell } from 'lucide-react';

interface AlertsSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsSubscriptionModal: React.FC<AlertsSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>(['D15', 'D02']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleDistrict = (d: string) => {
    if (preferredDistricts.includes(d)) {
      setPreferredDistricts(preferredDistricts.filter((x) => x !== d));
    } else {
      setPreferredDistricts([...preferredDistricts, d]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close alerts modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-emerald-700">
          <Mail className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Weekly Property Intelligence Mailer</span>
        </div>

        <h2 className="text-xl font-bold font-display text-neutral-900 mb-2">
          Subscribe to Weekly Price Drops & URA Caveat Digests
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Delivered every Thursday morning: newly registered caveats, below-market listings, and latest BTO application rates.
        </p>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-semibold">Subscribed successfully!</strong>
              <span>You will receive the next weekly digest every Thursday.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-800 block mb-1">Your Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 block mb-1.5">
                Select Districts of Interest
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['D01', 'D02', 'D03', 'D09', 'D10', 'D11', 'D12', 'D15', 'D20', 'D27'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDistrict(d)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      preferredDistricts.includes(d)
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Get Weekly Digest</span>
            </button>

            <span className="block text-[11px] text-neutral-400 text-center">
              Strictly zero spam · 1 email per week · Unsubscribe with 1 click
            </span>
          </form>
        )}
      </div>
    </div>
  );
};
