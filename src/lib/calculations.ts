import { Crop, Mandi } from './types';

export interface DecisionCalculationInput {
  crop: Crop;
  quantityQuintals: number;
  currentMandiPrice: number;
  forecastPriceAfterDays: number;
  holdingDays: number;
  distanceKm: number;
  storageType: 'cold_storage' | 'dry_warehouse' | 'on_farm';
  dailyWeightLossRate?: number;
  transportRatePerKmPerQuintal?: number;
  loadingUnloadingCostPerQuintal?: number;
  mandiCommissionPercent?: number;
}

export interface DecisionCalculationResult {
  sellNow: {
    grossRevenue: number;
    transportCost: number;
    loadingUnloadingCost: number;
    mandiCommission: number;
    storageCost: number;
    spoilageLossValue: number;
    totalDeductions: number;
    netReturn: number;
    netPricePerQuintal: number;
  };
  waitAndStore: {
    effectiveQuantityRemaining: number;
    weightLossQuintals: number;
    grossRevenue: number;
    transportCost: number;
    loadingUnloadingCost: number;
    mandiCommission: number;
    storageCost: number;
    spoilageLossValue: number;
    totalDeductions: number;
    netReturn: number;
    netPricePerQuintal: number;
  };
  netBenefitOfWaiting: number;
  percentageGain: number;
  recommendation: 'SELL_NOW' | 'HOLD_AND_STORE' | 'NEUTRAL';
  headline: string;
  reasons: string[];
  riskFactor: 'Low' | 'Medium' | 'High';
}

export function calculateSellNowVsWait(input: DecisionCalculationInput): DecisionCalculationResult {
  const {
    crop,
    quantityQuintals,
    currentMandiPrice,
    forecastPriceAfterDays,
    holdingDays,
    distanceKm,
    storageType,
    transportRatePerKmPerQuintal = crop.typicalTransportCostPerKmPerQuintal || 2.5,
    loadingUnloadingCostPerQuintal = 25, // typical loading/unloading fee ₹25/quintal
    mandiCommissionPercent = 1.5, // typical APMC market cess ~1.5%
  } = input;

  // 1. SELL NOW CALCULATIONS
  const sellNowGross = quantityQuintals * currentMandiPrice;
  const sellNowTransport = quantityQuintals * distanceKm * transportRatePerKmPerQuintal;
  const sellNowLoading = quantityQuintals * loadingUnloadingCostPerQuintal;
  const sellNowCommission = (sellNowGross * mandiCommissionPercent) / 100;
  const sellNowStorage = 0;
  const sellNowSpoilage = 0;
  const sellNowTotalDeductions = sellNowTransport + sellNowLoading + sellNowCommission + sellNowStorage + sellNowSpoilage;
  const sellNowNet = sellNowGross - sellNowTotalDeductions;
  const sellNowNetPerQuintal = sellNowNet / quantityQuintals;

  // 2. WAIT AND STORE CALCULATIONS
  let storageCostRatePerMonth = crop.baseStorageCostPerQuintalPerMonth;
  if (storageType === 'cold_storage') {
    storageCostRatePerMonth = Math.max(storageCostRatePerMonth, 70); // min ₹70/qtl/mo for cold store
  } else if (storageType === 'on_farm') {
    storageCostRatePerMonth = 15; // minimal direct cost, but higher spoilage risk
  }

  const storageMonths = holdingDays / 30;
  const waitStorageCost = quantityQuintals * storageCostRatePerMonth * storageMonths;

  // Weight loss / quality loss factor
  let dailyLossRate = input.dailyWeightLossRate ?? crop.dailyWeightLossRate ?? 0.005;
  if (storageType === 'cold_storage' && crop.perishabilityIndex === 'High') {
    dailyLossRate = dailyLossRate * 0.25; // Cold storage cuts deterioration by 75%
  } else if (storageType === 'on_farm' && crop.perishabilityIndex === 'High') {
    dailyLossRate = dailyLossRate * 1.5; // On-farm shed accelerates loss
  }

  const totalLossFraction = Math.min(0.6, dailyLossRate * holdingDays);
  const effectiveQuantityRemaining = quantityQuintals * (1 - totalLossFraction);
  const weightLossQuintals = quantityQuintals - effectiveQuantityRemaining;

  const waitGross = effectiveQuantityRemaining * forecastPriceAfterDays;
  const waitTransport = effectiveQuantityRemaining * distanceKm * transportRatePerKmPerQuintal;
  const waitLoading = effectiveQuantityRemaining * loadingUnloadingCostPerQuintal;
  const waitCommission = (waitGross * mandiCommissionPercent) / 100;
  const waitSpoilageLossValue = weightLossQuintals * forecastPriceAfterDays;
  const waitTotalDeductions = waitTransport + waitLoading + waitCommission + waitStorageCost;
  const waitNet = waitGross - waitTotalDeductions;
  const waitNetPerQuintal = waitNet / quantityQuintals;

  const netBenefitOfWaiting = waitNet - sellNowNet;
  const percentageGain = sellNowNet > 0 ? (netBenefitOfWaiting / sellNowNet) * 100 : 0;

  // Recommendation logic
  let recommendation: 'SELL_NOW' | 'HOLD_AND_STORE' | 'NEUTRAL' = 'NEUTRAL';
  let headline = '';
  const reasons: string[] = [];

  if (crop.perishabilityIndex === 'High' && storageType !== 'cold_storage') {
    recommendation = 'SELL_NOW';
    headline = `Immediate Mandi Sale strongly advised for ${crop.name}.`;
    reasons.push(`High perishability: Weight and grade deteriorate at ${(dailyLossRate * 100).toFixed(1)}% per day without cold chain.`);
    reasons.push(`Holding for ${holdingDays} days causes estimated ₹${Math.round(waitSpoilageLossValue).toLocaleString('en-IN')} in quality/weight loss.`);
  } else if (netBenefitOfWaiting > 3000 || percentageGain >= 5) {
    recommendation = 'HOLD_AND_STORE';
    headline = `Hold & Store in ${storageType === 'cold_storage' ? 'Cold Storage' : 'Warehouse'}: Estimated +₹${Math.round(netBenefitOfWaiting).toLocaleString('en-IN')} extra net profit.`;
    reasons.push(`Projected price surge to ₹${forecastPriceAfterDays}/qtl easily overcomes ₹${Math.round(waitStorageCost).toLocaleString('en-IN')} storage fee.`);
    reasons.push(`Net profit improves by ${percentageGain.toFixed(1)}% after all deductions.`);
  } else if (netBenefitOfWaiting < -1000 || percentageGain < -2) {
    recommendation = 'SELL_NOW';
    headline = `Sell Now: Storage costs & weight loss exceed price gains by ₹${Math.round(Math.abs(netBenefitOfWaiting)).toLocaleString('en-IN')}.`;
    reasons.push(`Current spot rate ₹${currentMandiPrice}/qtl locks in immediate guaranteed return of ₹${Math.round(sellNowNet).toLocaleString('en-IN')}.`);
    reasons.push(`Storage expenses (₹${Math.round(waitStorageCost).toLocaleString('en-IN')}) and loss erode potential future price lift.`);
  } else {
    recommendation = 'NEUTRAL';
    headline = `Marginal difference (₹${Math.round(netBenefitOfWaiting).toLocaleString('en-IN')}). Choose based on your immediate cash needs.`;
    reasons.push(`Future price lift matches holding cost almost 1:1.`);
    reasons.push(`If cash is needed urgently for inputs or sowing, selling now carries zero storage risk.`);
  }

  const riskFactor = crop.perishabilityIndex === 'High' ? 'High' : holdingDays > 45 ? 'Medium' : 'Low';

  return {
    sellNow: {
      grossRevenue: Math.round(sellNowGross),
      transportCost: Math.round(sellNowTransport),
      loadingUnloadingCost: Math.round(sellNowLoading),
      mandiCommission: Math.round(sellNowCommission),
      storageCost: Math.round(sellNowStorage),
      spoilageLossValue: Math.round(sellNowSpoilage),
      totalDeductions: Math.round(sellNowTotalDeductions),
      netReturn: Math.round(sellNowNet),
      netPricePerQuintal: Math.round(sellNowNetPerQuintal),
    },
    waitAndStore: {
      effectiveQuantityRemaining: Number(effectiveQuantityRemaining.toFixed(1)),
      weightLossQuintals: Number(weightLossQuintals.toFixed(1)),
      grossRevenue: Math.round(waitGross),
      transportCost: Math.round(waitTransport),
      loadingUnloadingCost: Math.round(waitLoading),
      mandiCommission: Math.round(waitCommission),
      storageCost: Math.round(waitStorageCost),
      spoilageLossValue: Math.round(waitSpoilageLossValue),
      totalDeductions: Math.round(waitTotalDeductions),
      netReturn: Math.round(waitNet),
      netPricePerQuintal: Math.round(waitNetPerQuintal),
    },
    netBenefitOfWaiting: Math.round(netBenefitOfWaiting),
    percentageGain: Number(percentageGain.toFixed(1)),
    recommendation,
    headline,
    reasons,
    riskFactor,
  };
}

export function calculateTransportNetPrice(
  modalPrice: number,
  quantityQuintals: number,
  distanceKm: number,
  ratePerKmPerQuintal: number = 2.5
) {
  const gross = modalPrice * quantityQuintals;
  const transportCost = distanceKm * ratePerKmPerQuintal * quantityQuintals;
  const loading = 25 * quantityQuintals;
  const net = gross - transportCost - loading;
  const effectivePricePerQuintal = net / quantityQuintals;
  return {
    gross,
    transportCost: Math.round(transportCost),
    loading: Math.round(loading),
    net: Math.round(net),
    effectivePricePerQuintal: Math.round(effectivePricePerQuintal),
  };
}
