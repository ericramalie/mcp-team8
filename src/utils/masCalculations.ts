import { BuyerResidency, TrueCostCalculationInput, TrueCostCalculationResult } from '../types/property';

/**
 * Calculates Singapore Buyer's Stamp Duty (BSD) for residential property
 * Based on IRAS residential BSD rate tiers.
 */
export function calculateBsd(purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;

  let bsd = 0;
  const p = purchasePrice;

  // Tier 1: First $180,000 at 1%
  if (p > 0) {
    bsd += Math.min(p, 180000) * 0.01;
  }
  // Tier 2: Next $180,000 ($180,001 - $360,000) at 2%
  if (p > 180000) {
    bsd += Math.min(p - 180000, 180000) * 0.02;
  }
  // Tier 3: Next $640,000 ($360,001 - $1,000,000) at 3%
  if (p > 360000) {
    bsd += Math.min(p - 360000, 640000) * 0.03;
  }
  // Tier 4: Next $500,000 ($1,000,001 - $1,500,000) at 4%
  if (p > 1000000) {
    bsd += Math.min(p - 1000000, 500000) * 0.04;
  }
  // Tier 5: Next $1,500,000 ($1,500,001 - $3,000,000) at 5%
  if (p > 1500000) {
    bsd += Math.min(p - 1500000, 1500000) * 0.05;
  }
  // Tier 6: Amount in excess of $3,000,000 at 6%
  if (p > 3000000) {
    bsd += (p - 3000000) * 0.06;
  }

  return Math.round(bsd);
}

/**
 * Additional Buyer's Stamp Duty (ABSD) percentage rate
 */
export function getAbsdRate(buyerType: BuyerResidency): number {
  switch (buyerType) {
    case 'citizen_first':
      return 0; // 0%
    case 'citizen_second':
      return 20; // 20%
    case 'pr_first':
      return 5; // 5%
    case 'pr_second':
      return 30; // 30%
    case 'foreigner':
      return 60; // 60%
    case 'entity':
      return 65; // 65%
    default:
      return 0;
  }
}

/**
 * Monthly mortgage payment using standard amortization formula:
 * M = P [ r(1 + r)^n ] / [ (1 + r)^n – 1]
 */
export function calculateMonthlyMortgage(
  loanAmount: number,
  annualInterestRatePercent: number,
  tenureYears: number
): number {
  if (loanAmount <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) return loanAmount / totalMonths;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const payment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  return Math.round(payment);
}

/**
 * Computes full MAS-compliant True Total Cost and Affordability breakdown
 */
export function calculateTrueCost(input: TrueCostCalculationInput): TrueCostCalculationResult {
  const price = input.propertyPrice;
  const isHdb = input.propertyType === 'hdb';
  const bsd = calculateBsd(price);
  const absdRate = getAbsdRate(input.buyerType);
  const absd = Math.round((price * absdRate) / 100);
  const legalAndValuation = 3000; // Average Singapore conveyancing and bank valuation fee

  // MAS Loan-to-Value (LTV) limits:
  // Bank loan max 75%, HDB concessionary loan max 80% (if applicable)
  const maxLtvPercent = isHdb ? 80 : 75;
  const maxLoanAmount = Math.round((price * maxLtvPercent) / 100);

  // Minimum Cash Downpayment: 5% for bank loan (or 0 for HDB concessionary, but standard 5% buffer)
  const minCashDownpayment = Math.round(price * 0.05);

  // CPF OA or Cash portion for the remaining 20% downpayment
  const minCpfDownpayment = Math.round(price * (1 - maxLtvPercent / 100 - 0.05));
  const totalDownpayment = Math.round(price * (1 - maxLtvPercent / 100));

  // Actual loan needed
  const loanAmountRequested = maxLoanAmount;

  // Monthly mortgage
  const monthlyMortgage = calculateMonthlyMortgage(
    loanAmountRequested,
    input.interestRateAnnual,
    input.loanTenureYears
  );

  // Total upfront acquisition cost (Downpayment + Stamp duties + Legal)
  const totalUpfrontAcquisitionCost = totalDownpayment + bsd + absd + legalAndValuation;

  // MAS TDSR Check (Total Debt Servicing Ratio <= 55%)
  const totalMonthlyDebt = monthlyMortgage + input.monthlyExistingDebts;
  const tdsrRatio = input.grossMonthlyIncome > 0 ? (totalMonthlyDebt / input.grossMonthlyIncome) * 100 : 100;
  const tdsrPassed = tdsrRatio <= 55;

  // MAS MSR Check for HDB (Mortgage Servicing Ratio <= 30%)
  let msrRatio: number | undefined;
  let msrPassed: boolean | undefined;

  if (isHdb) {
    msrRatio = input.grossMonthlyIncome > 0 ? (monthlyMortgage / input.grossMonthlyIncome) * 100 : 100;
    msrPassed = msrRatio <= 30;
  }

  // Cash / CPF liquidity check
  const totalFundsAvailable = input.cpfOaAvailable + input.cashOnHand;
  const fundsSufficient = totalFundsAvailable >= totalUpfrontAcquisitionCost && input.cashOnHand >= minCashDownpayment;

  const isAffordable = tdsrPassed && (isHdb ? (msrPassed ?? true) : true) && fundsSufficient;

  let summaryNote = '';
  if (!tdsrPassed) {
    summaryNote = `TDSR of ${tdsrRatio.toFixed(1)}% exceeds MAS regulatory threshold of 55%. Consider extending tenure or reducing purchase price.`;
  } else if (isHdb && msrPassed === false) {
    summaryNote = `MSR of ${msrRatio?.toFixed(1)}% exceeds MAS 30% limit for HDB housing.`;
  } else if (!fundsSufficient) {
    summaryNote = `Available funds (CPF + Cash: $${totalFundsAvailable.toLocaleString()}) are below upfront requirements ($${totalUpfrontAcquisitionCost.toLocaleString()}).`;
  } else {
    summaryNote = `PASSED all MAS regulatory stress-tests (TDSR ${tdsrRatio.toFixed(1)}% ≤ 55%${isHdb ? `, MSR ${msrRatio?.toFixed(1)}% ≤ 30%` : ''}). Fully affordable!`;
  }

  return {
    propertyPrice: price,
    bsdAmount: bsd,
    absdRatePercent: absdRate,
    absdAmount: absd,
    legalAndValuationFees: legalAndValuation,
    totalUpfrontAcquisitionCost,
    maxLtvPercent,
    maxLoanAmount,
    minCashDownpayment,
    minCpfDownpayment,
    totalDownpayment,
    loanAmountRequested,
    monthlyMortgagePayment: monthlyMortgage,
    tdsrRatioPercent: Number(tdsrRatio.toFixed(1)),
    tdsrPassed,
    msrRatioPercent: msrRatio ? Number(msrRatio.toFixed(1)) : undefined,
    msrPassed,
    isAffordable,
    summaryNote,
  };
}
