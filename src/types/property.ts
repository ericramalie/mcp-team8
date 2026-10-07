export type PropertyCategory = 'all' | 'new_launch' | 'bto' | 'condo_resale' | 'hdb_resale' | 'landed';

export type BuyerResidency = 'citizen_first' | 'citizen_second' | 'pr_first' | 'pr_second' | 'foreigner' | 'entity';

export type SingaporeRegion = 'CCR' | 'RCR' | 'OCR'; // Core Central, Rest of Central, Outside Central

export interface SchoolDistance {
  name: string;
  distanceKm: number;
  within1km: boolean;
}

export interface LiveCarparkInfo {
  carparkId: string;
  name: string;
  availableLots: number;
  totalLots: number;
  type: 'HDB' | 'Basement' | 'Mechanized' | 'Surface';
  lastUpdated: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  category: PropertyCategory;
  categoryLabel: string;
  price: number;
  pricePerSqFt: number;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  district: string;
  districtCode: string; // e.g. D09, D15, D10
  region: SingaporeRegion;
  address: string;
  postalCode: string;
  nearestMrt: string;
  mrtDistanceMeters: number;
  tenure: 'Freehold' | '999-Year Leasehold' | '99-Year Leasehold';
  remainingLeaseYears?: number;
  builtYear: number;
  topDate?: string;
  developer?: string;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
  schoolsNearby: SchoolDistance[];
  liveCarpark: LiveCarparkInfo;
  uraMedianPsf: number; // Official URA reference benchmark
  hdbGrantEligible?: boolean;
  rentalYieldPercent: number;
  isNewLaunch?: boolean;
  isBtoLaunch?: boolean;
  btoLaunchQuarter?: string;
  familyFriendlyScore: number; // 1-100
  youngProScore: number; // 1-100
  maintenanceFeeMonth: number;
  floorLevel: string;
}

export interface FilterState {
  searchQuery: string;
  category: PropertyCategory;
  minPrice: number;
  maxPrice: number;
  minPsf: number;
  maxPsf: number;
  bedrooms: number | 'all';
  region: 'all' | SingaporeRegion;
  maxMrtDistance: number | 'any'; // e.g. 500, 1000
  schoolWithin1kmOnly: boolean;
  tenure: 'all' | 'freehold' | 'leasehold';
  minRemainingLease: number | 'any'; // e.g. 70, 80
  hasCarparkVacancy: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'psf_asc' | 'psf_desc' | 'yield_desc' | 'newest';
  targetSegment: 'all' | 'family' | 'young_pro';
}

export interface TrueCostCalculationInput {
  propertyPrice: number;
  buyerType: BuyerResidency;
  loanTenureYears: number;
  interestRateAnnual: number;
  cpfOaAvailable: number;
  cashOnHand: number;
  grossMonthlyIncome: number;
  monthlyExistingDebts: number;
  propertyType: 'private' | 'hdb';
}

export interface TrueCostCalculationResult {
  propertyPrice: number;
  bsdAmount: number;
  absdRatePercent: number;
  absdAmount: number;
  legalAndValuationFees: number;
  totalUpfrontAcquisitionCost: number;
  maxLtvPercent: number;
  maxLoanAmount: number;
  minCashDownpayment: number;
  minCpfDownpayment: number;
  totalDownpayment: number;
  loanAmountRequested: number;
  monthlyMortgagePayment: number;
  tdsrRatioPercent: number;
  tdsrPassed: boolean;
  msrRatioPercent?: number;
  msrPassed?: boolean;
  isAffordable: boolean;
  summaryNote: string;
}
