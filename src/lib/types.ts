export type UserRole = 'farmer' | 'buyer' | 'fpo' | 'admin';

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'ml' // Malayalam
  | 'or' // Odia
  | 'ne'; // Nepali

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  language: SupportedLanguage;
  village?: string;
  district: string;
  state: string;
  landSizeAcres?: number;
  primaryCrops?: string[];
  businessName?: string;
  buyerCategory?: 'wholesaler' | 'retailer' | 'processor' | 'exporter' | 'commission_agent';
  gstin?: string;
  panNumber?: string;
  fpoRegistrationNumber?: string;
  fpoMemberCount?: number;
  verified: boolean;
  avatarUrl?: string;
  trustScore?: number;
  createdAt: string;
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Vegetable' | 'Fruit' | 'Cash Crop' | 'Spice';
  shelfLifeDays: number;
  perishabilityIndex: 'High' | 'Medium' | 'Low';
  dailyWeightLossRate: number; // e.g. 0.015 = 1.5% daily weight/quality drop
  standardMoisturePercent: number;
  baseStorageCostPerQuintalPerMonth: number;
  typicalTransportCostPerKmPerQuintal: number;
}

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  contactNumber?: string;
  operatingHours?: string;
  dailyArrivalsQuintals?: number;
  tradeVolumeQuintals?: number;
}

export interface MandiPriceRecord {
  id: string;
  mandiId: string;
  mandiName: string;
  cropId: string;
  cropName: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalTons: number;
  date: string;
  priceChangePercent: number; // e.g. +3.4% or -1.8%
}

export interface PriceForecast {
  cropId: string;
  cropName: string;
  mandiId: string;
  mandiName: string;
  currentPrice: number;
  forecasts: {
    dayOffset: number;
    date: string;
    predictedPrice: number;
    confidenceMin: number;
    confidenceMax: number;
    confidenceScore: number; // 0 - 100%
  }[];
  priceDrivers: string[];
  recommendation: 'STRONG_SELL' | 'SELL_NOW' | 'HOLD_SHORT_TERM' | 'HOLD_LONG_TERM';
  summary: string;
}

export interface FarmerProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  cropId: string;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  expectedPricePerQuintal: number;
  harvestDate: string;
  availableFromDate: string;
  expiryOrStorageLimitDays: number;
  grade: 'A' | 'B' | 'C';
  moisturePercent: number;
  photos: string[];
  status: 'active' | 'negotiating' | 'sold' | 'expired';
  offersCount: number;
  createdAt: string;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  cropName: string;
  quantityQuintals: number;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  buyerCategory: string;
  buyerRating: number;
  buyerVerified: boolean;
  offeredPricePerQuintal: number;
  paymentTerms: 'immediate_upi' | 'same_day_rtgs' | 'escrow' | '3_days' | '7_days';
  transportProvidedByBuyer: boolean;
  transportAllowancePerQuintal: number;
  deliveryMandiOrLocation: string;
  distanceKm: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  notes?: string;
  validUntil: string;
  createdAt: string;
}

export interface OrderDeal {
  id: string;
  listingId: string;
  buyerOfferId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantityQuintals: number;
  agreedPricePerQuintal: number;
  totalAmount: number;
  paymentTerms: string;
  status: 'confirmed' | 'dispatched' | 'in_transit' | 'weighed_and_inspected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'in_escrow' | 'released' | 'paid_to_farmer';
  dispatchDate?: string;
  deliveryDate?: string;
  transportVehicleNumber?: string;
  driverPhone?: string;
  currentMilestone: number; // 1 to 5
  inspectionReport?: {
    recordedMoisture: number;
    recordedForeignMatter: number;
    finalNetWeightQuintals: number;
    adjustedAmount: number;
  };
  createdAt: string;
}

export interface DisputeRecord {
  id: string;
  orderId: string;
  raisedBy: 'farmer' | 'buyer';
  partyName: string;
  reason: 'weight_shortage' | 'quality_mismatch' | 'payment_delay' | 'vehicle_breakdown' | 'breach_of_terms';
  description: string;
  evidenceUrls: string[];
  status: 'open' | 'under_review' | 'fpo_arbitration' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  type: 'Cold Storage' | 'Dry Warehouse' | 'Silo' | 'On-Farm Covered Shed';
  location: string;
  distanceKm: number;
  capacityQuintals: number;
  availableCapacityQuintals: number;
  ratePerQuintalPerMonth: number;
  climateControlled: boolean;
  insuranceCovered: boolean;
  rating: number;
  phone: string;
}

export interface TransportOption {
  id: string;
  providerName: string;
  vehicleType: 'Pickup (1.5T)' | 'Small Truck (4T)' | 'Heavy 6-Wheel (10T)' | 'Tractor Trolley (3T)';
  capacityQuintals: number;
  baseCharge: number;
  ratePerKm: number;
  handlingChargePerQuintal: number;
  availableInHours: number;
  rating: number;
  contactNumber: string;
}

export interface FPOMemberCrop {
  memberId: string;
  memberName: string;
  village: string;
  phone: string;
  cropName: string;
  acreage: number;
  expectedYieldQuintals: number;
  harvestWindowStart: string;
  harvestWindowEnd: string;
}

export interface WeatherAlert {
  id: string;
  date: string;
  forecastDay: string;
  condition: 'Sunny' | 'Light Rain' | 'Heavy Thunderstorm' | 'Hail Risk' | 'Heatwave' | 'Frost Alert';
  tempMin: number;
  tempMax: number;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number;
  impactOnHarvest: string;
  advisoryNote: string;
  alertLevel: 'low' | 'moderate' | 'high' | 'severe';
}
