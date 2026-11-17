import { supabase, isSupabaseConfigured } from './supabase';
import {
  Crop,
  Mandi,
  MandiPriceRecord,
  FarmerProduceListing,
  BuyerOffer,
  OrderDeal,
  DisputeRecord,
  StorageFacility,
  TransportOption,
  WeatherAlert,
  FPOMemberCrop,
  UserProfile,
} from './types';
import {
  CROPS,
  MANDIS,
  INITIAL_PRICES,
  INITIAL_LISTINGS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  INITIAL_DISPUTES,
  STORAGE_FACILITIES,
  TRANSPORT_OPTIONS,
  WEATHER_ALERTS,
  FPO_MEMBERS_CROPS,
} from './mockData';

// -----------------------------------------------------------------------------
// Mapping Helpers (PostgreSQL snake_case <-> Application camelCase)
// -----------------------------------------------------------------------------

export function mapProfileFromDb(row: any): UserProfile {
  return {
    id: row.id || row.user_id,
    name: row.name || 'Farmer',
    email: row.email,
    phone: row.phone || '',
    role: row.role || 'farmer',
    language: row.language || 'hi',
    village: row.village,
    district: row.district || 'Indore',
    state: row.state || 'Madhya Pradesh',
    landSizeAcres: row.land_size_acres ? Number(row.land_size_acres) : undefined,
    primaryCrops: row.primary_crops || [],
    businessName: row.business_name,
    buyerCategory: row.buyer_category,
    gstin: row.gstin,
    panNumber: row.pan_number,
    fpoRegistrationNumber: row.fpo_registration_number,
    fpoMemberCount: row.fpo_member_count ? Number(row.fpo_member_count) : undefined,
    verified: Boolean(row.verified),
    trustScore: row.trust_score ? Number(row.trust_score) : 90,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapProfileToDb(profile: Partial<UserProfile>, userId?: string): any {
  return {
    ...(profile.id ? { id: profile.id } : {}),
    ...(userId ? { user_id: userId } : {}),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    language: profile.language,
    village: profile.village,
    district: profile.district,
    state: profile.state,
    land_size_acres: profile.landSizeAcres,
    primary_crops: profile.primaryCrops,
    business_name: profile.businessName,
    buyer_category: profile.buyerCategory,
    gstin: profile.gstin,
    pan_number: profile.panNumber,
    fpo_registration_number: profile.fpoRegistrationNumber,
    fpo_member_count: profile.fpoMemberCount,
    verified: profile.verified,
    trust_score: profile.trustScore,
    avatar_url: profile.avatarUrl,
    updated_at: new Date().toISOString(),
  };
}

export function mapListingFromDb(row: any): FarmerProduceListing {
  return {
    id: row.id,
    farmerId: row.farmer_id,
    farmerName: row.farmer_name,
    farmerPhone: row.farmer_phone,
    location: row.location,
    cropId: row.crop_id,
    cropName: row.crop_name,
    variety: row.variety,
    quantityQuintals: Number(row.quantity_quintals),
    expectedPricePerQuintal: Number(row.expected_price_per_quintal),
    harvestDate: row.harvest_date,
    availableFromDate: row.available_from_date,
    expiryOrStorageLimitDays: Number(row.expiry_or_storage_limit_days || 180),
    grade: row.grade || 'A',
    moisturePercent: Number(row.moisture_percent || 10),
    photos: row.photos || [],
    status: row.status || 'active',
    offersCount: Number(row.offers_count || 0),
    createdAt: row.created_at,
  };
}

export function mapListingToDb(item: Omit<FarmerProduceListing, 'id' | 'createdAt' | 'offersCount'> & { id?: string }): any {
  return {
    ...(item.id ? { id: item.id } : {}),
    farmer_id: item.farmerId,
    farmer_name: item.farmerName,
    farmer_phone: item.farmerPhone,
    location: item.location,
    crop_id: item.cropId,
    crop_name: item.cropName,
    variety: item.variety,
    quantity_quintals: item.quantityQuintals,
    expected_price_per_quintal: item.expectedPricePerQuintal,
    harvest_date: item.harvestDate,
    available_from_date: item.availableFromDate,
    expiry_or_storage_limit_days: item.expiryOrStorageLimitDays,
    grade: item.grade,
    moisture_percent: item.moisturePercent,
    photos: item.photos || [],
    status: item.status || 'active',
    offers_count: 0,
  };
}

export function mapOfferFromDb(row: any): BuyerOffer {
  return {
    id: row.id,
    listingId: row.listing_id,
    cropName: row.crop_name,
    quantityQuintals: Number(row.quantity_quintals),
    buyerId: row.buyer_id,
    buyerName: row.buyer_name,
    buyerBusinessName: row.buyer_business_name,
    buyerCategory: row.buyer_category || 'Wholesaler',
    buyerRating: Number(row.buyer_rating || 4.5),
    buyerVerified: Boolean(row.buyer_verified),
    offeredPricePerQuintal: Number(row.offered_price_per_quintal),
    paymentTerms: row.payment_terms || 'same_day_rtgs',
    transportProvidedByBuyer: Boolean(row.transport_provided_by_buyer),
    transportAllowancePerQuintal: Number(row.transport_allowance_per_quintal || 0),
    deliveryMandiOrLocation: row.delivery_mandi_or_location || 'APMC Yard',
    distanceKm: Number(row.distance_km || 0),
    status: row.status || 'pending',
    counterPrice: row.counter_price ? Number(row.counter_price) : undefined,
    notes: row.notes,
    validUntil: row.valid_until,
    createdAt: row.created_at,
  };
}

export function mapOfferToDb(item: Omit<BuyerOffer, 'id' | 'createdAt' | 'status'> & { id?: string; status?: string }): any {
  return {
    ...(item.id ? { id: item.id } : {}),
    listing_id: item.listingId,
    crop_name: item.cropName,
    quantity_quintals: item.quantityQuintals,
    buyer_id: item.buyerId,
    buyer_name: item.buyerName,
    buyer_business_name: item.buyerBusinessName,
    buyer_category: item.buyerCategory,
    buyer_rating: item.buyerRating,
    buyer_verified: item.buyerVerified,
    offered_price_per_quintal: item.offeredPricePerQuintal,
    payment_terms: item.paymentTerms,
    transport_provided_by_buyer: item.transportProvidedByBuyer,
    transport_allowance_per_quintal: item.transportAllowancePerQuintal,
    delivery_mandi_or_location: item.deliveryMandiOrLocation,
    distance_km: item.distanceKm,
    status: item.status || 'pending',
    counter_price: item.counterPrice,
    notes: item.notes,
    valid_until: item.validUntil,
  };
}

export function mapOrderFromDb(row: any): OrderDeal {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerOfferId: row.buyer_offer_id,
    farmerId: row.farmer_id,
    farmerName: row.farmer_name,
    buyerId: row.buyer_id,
    buyerName: row.buyer_name,
    cropName: row.crop_name,
    quantityQuintals: Number(row.quantity_quintals),
    agreedPricePerQuintal: Number(row.agreed_price_per_quintal),
    totalAmount: Number(row.total_amount),
    paymentTerms: row.payment_terms,
    status: row.status || 'confirmed',
    paymentStatus: row.payment_status || 'in_escrow',
    dispatchDate: row.dispatch_date,
    deliveryDate: row.delivery_date,
    transportVehicleNumber: row.transport_vehicle_number,
    driverPhone: row.driver_phone,
    currentMilestone: Number(row.current_milestone || 1),
    inspectionReport: row.inspection_report,
    createdAt: row.created_at,
  };
}

export function mapOrderToDb(item: Partial<OrderDeal>): any {
  return {
    ...(item.id ? { id: item.id } : {}),
    listing_id: item.listingId,
    buyer_offer_id: item.buyerOfferId,
    farmer_id: item.farmerId,
    farmer_name: item.farmerName,
    buyer_id: item.buyerId,
    buyer_name: item.buyerName,
    crop_name: item.cropName,
    quantity_quintals: item.quantityQuintals,
    agreed_price_per_quintal: item.agreedPricePerQuintal,
    total_amount: item.totalAmount,
    payment_terms: item.paymentTerms,
    status: item.status || 'confirmed',
    payment_status: item.paymentStatus || 'in_escrow',
    dispatch_date: item.dispatchDate,
    delivery_date: item.deliveryDate,
    transport_vehicle_number: item.transportVehicleNumber,
    driver_phone: item.driverPhone,
    current_milestone: item.currentMilestone || 1,
    inspection_report: item.inspectionReport,
  };
}

export function mapDisputeFromDb(row: any): DisputeRecord {
  return {
    id: row.id,
    orderId: row.order_id,
    raisedBy: row.raised_by || 'farmer',
    partyName: row.party_name,
    reason: row.reason || 'payment_delay',
    description: row.description,
    evidenceUrls: row.evidence_urls || [],
    status: row.status || 'open',
    resolutionNotes: row.resolution_notes,
    createdAt: row.created_at,
  };
}

export function mapDisputeToDb(item: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'> & { id?: string; status?: string }): any {
  return {
    ...(item.id ? { id: item.id } : {}),
    order_id: item.orderId,
    raised_by: item.raisedBy,
    party_name: item.partyName,
    reason: item.reason,
    description: item.description,
    evidence_urls: item.evidenceUrls || [],
    status: item.status || 'open',
    resolution_notes: item.resolutionNotes,
  };
}

export function mapMandiPriceFromDb(row: any): MandiPriceRecord {
  return {
    id: row.id,
    mandiId: row.mandi_id,
    mandiName: row.mandi_name,
    cropId: row.crop_id,
    cropName: row.crop_name,
    variety: row.variety,
    minPrice: Number(row.min_price),
    maxPrice: Number(row.max_price),
    modalPrice: Number(row.modal_price),
    arrivalTons: Number(row.arrival_tons),
    priceChangePercent: Number(row.price_change_percent || 0),
    date: row.date || new Date().toISOString().slice(0, 10),
  };
}

export function mapMandiPriceToDb(item: Omit<MandiPriceRecord, 'id'> & { id?: string }): any {
  return {
    ...(item.id ? { id: item.id } : {}),
    mandi_id: item.mandiId,
    mandi_name: item.mandiName,
    crop_id: item.cropId,
    crop_name: item.cropName,
    variety: item.variety,
    min_price: item.minPrice,
    max_price: item.maxPrice,
    modal_price: item.modalPrice,
    arrival_tons: item.arrivalTons,
    price_change_percent: item.priceChangePercent,
    date: item.date,
  };
}

// -----------------------------------------------------------------------------
// Auto-Seeding Helper for Fresh Supabase Projects
// -----------------------------------------------------------------------------
export async function seedSupabaseIfEmpty(): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    // Check if crops table has data
    const { count: cropsCount, error: cropsErr } = await supabase
      .from('crops')
      .select('*', { count: 'exact', head: true });

    if (!cropsErr && (cropsCount === 0 || cropsCount === null)) {
      console.log('Seeding initial crops into Supabase...');
      const cropsData = CROPS.map((c) => ({
        id: c.id,
        name: c.name,
        hindi_name: c.hindiName,
        category: c.category,
        shelf_life_days: c.shelfLifeDays,
        perishability_index: c.perishabilityIndex,
        daily_weight_loss_rate: c.dailyWeightLossRate,
        standard_moisture_percent: c.standardMoisturePercent,
        base_storage_cost_per_quintal_per_month: c.baseStorageCostPerQuintalPerMonth,
        typical_transport_cost_per_km_per_quintal: c.typicalTransportCostPerKmPerQuintal,
      }));
      await supabase.from('crops').upsert(cropsData);
    }

    // Check if mandis table has data
    const { count: mandisCount, error: mandisErr } = await supabase
      .from('mandis')
      .select('*', { count: 'exact', head: true });

    if (!mandisErr && (mandisCount === 0 || mandisCount === null)) {
      console.log('Seeding initial mandis into Supabase...');
      const mandisData = MANDIS.map((m) => ({
        id: m.id,
        name: m.name,
        district: m.district,
        state: m.state,
        distance_km: m.distanceKm,
        contact_number: m.contactNumber,
        operating_hours: m.operatingHours,
        daily_arrivals_quintals: m.dailyArrivalsQuintals,
        trade_volume_quintals: m.tradeVolumeQuintals,
      }));
      await supabase.from('mandis').upsert(mandisData);
    }

    // Check if mandi_prices table has data
    const { count: pricesCount, error: pricesErr } = await supabase
      .from('mandi_prices')
      .select('*', { count: 'exact', head: true });

    if (!pricesErr && (pricesCount === 0 || pricesCount === null)) {
      console.log('Seeding initial mandi prices into Supabase...');
      const pricesData = INITIAL_PRICES.map(mapMandiPriceToDb);
      await supabase.from('mandi_prices').upsert(pricesData);
    }

    // Check if storage_facilities table has data
    const { count: storCount, error: storErr } = await supabase
      .from('storage_facilities')
      .select('*', { count: 'exact', head: true });

    if (!storErr && (storCount === 0 || storCount === null)) {
      console.log('Seeding initial storage facilities into Supabase...');
      const storData = STORAGE_FACILITIES.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        location: s.location,
        distance_km: s.distanceKm,
        capacity_quintals: s.capacityQuintals,
        available_capacity_quintals: s.availableCapacityQuintals,
        rate_per_quintal_per_month: s.ratePerQuintalPerMonth,
        climate_controlled: s.climateControlled,
        insurance_covered: s.insuranceCovered,
        rating: s.rating,
        phone: s.phone,
      }));
      await supabase.from('storage_facilities').upsert(storData);
    }

    // Check if transport_options table has data
    const { count: transCount, error: transErr } = await supabase
      .from('transport_options')
      .select('*', { count: 'exact', head: true });

    if (!transErr && (transCount === 0 || transCount === null)) {
      console.log('Seeding initial transport options into Supabase...');
      const transData = TRANSPORT_OPTIONS.map((t) => ({
        id: t.id,
        provider_name: t.providerName,
        vehicle_type: t.vehicleType,
        capacity_quintals: t.capacityQuintals,
        base_charge: t.baseCharge,
        rate_per_km: t.ratePerKm,
        handling_charge_per_quintal: t.handlingChargePerQuintal,
        available_in_hours: t.availableInHours,
        rating: t.rating,
        contact_number: t.contactNumber,
      }));
      await supabase.from('transport_options').upsert(transData);
    }

    // Check if weather_alerts table has data
    const { count: wCount, error: wErr } = await supabase
      .from('weather_alerts')
      .select('*', { count: 'exact', head: true });

    if (!wErr && (wCount === 0 || wCount === null)) {
      console.log('Seeding initial weather alerts into Supabase...');
      const wData = WEATHER_ALERTS.map((w) => ({
        id: w.id,
        date: w.date,
        forecast_day: w.forecastDay,
        condition: w.condition,
        temp_min: w.tempMin,
        temp_max: w.tempMax,
        humidity_percent: w.humidityPercent,
        rainfall_mm: w.rainfallMm,
        wind_speed_kmh: w.windSpeedKmh,
        impact_on_harvest: w.impactOnHarvest,
        advisory_note: w.advisoryNote,
        alert_level: w.alertLevel,
      }));
      await supabase.from('weather_alerts').upsert(wData);
    }

    // Check if fpo_members_crops table has data
    const { count: fpoCount, error: fpoErr } = await supabase
      .from('fpo_members_crops')
      .select('*', { count: 'exact', head: true });

    if (!fpoErr && (fpoCount === 0 || fpoCount === null)) {
      console.log('Seeding initial FPO member crops into Supabase...');
      const fpoData = FPO_MEMBERS_CROPS.map((f) => ({
        member_id: f.memberId,
        member_name: f.memberName,
        village: f.village,
        phone: f.phone,
        crop_name: f.cropName,
        acreage: f.acreage,
        expected_yield_quintals: f.expectedYieldQuintals,
        harvest_window_start: f.harvestWindowStart,
        harvest_window_end: f.harvestWindowEnd,
      }));
      await supabase.from('fpo_members_crops').upsert(fpoData);
    }

    // Check if produce_listings table has data
    const { count: listingsCount, error: listErr } = await supabase
      .from('produce_listings')
      .select('*', { count: 'exact', head: true });

    if (!listErr && (listingsCount === 0 || listingsCount === null)) {
      console.log('Seeding initial produce listings into Supabase...');
      const listingsData = INITIAL_LISTINGS.map(mapListingToDb);
      await supabase.from('produce_listings').upsert(listingsData);
    }

    // Check if buyer_offers table has data
    const { count: offersCount, error: offErr } = await supabase
      .from('buyer_offers')
      .select('*', { count: 'exact', head: true });

    if (!offErr && (offersCount === 0 || offersCount === null)) {
      console.log('Seeding initial buyer offers into Supabase...');
      const offersData = INITIAL_OFFERS.map(mapOfferToDb);
      await supabase.from('buyer_offers').upsert(offersData);
    }

    // Check if orders table has data
    const { count: ordersCount, error: ordErr } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (!ordErr && (ordersCount === 0 || ordersCount === null)) {
      console.log('Seeding initial orders into Supabase...');
      const ordersData = INITIAL_ORDERS.map(mapOrderToDb);
      await supabase.from('orders').upsert(ordersData);
    }

    return true;
  } catch (error) {
    console.warn('Auto-seed check encountered non-fatal error:', error);
    return false;
  }
}
