'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
} from '@/lib/types';
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
} from '@/lib/mockData';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  mapListingFromDb,
  mapListingToDb,
  mapOfferFromDb,
  mapOfferToDb,
  mapOrderFromDb,
  mapOrderToDb,
  mapDisputeFromDb,
  mapDisputeToDb,
  mapMandiPriceFromDb,
  mapMandiPriceToDb,
  seedSupabaseIfEmpty,
} from '@/lib/supabaseDb';

interface MandiDataContextType {
  crops: Crop[];
  mandis: Mandi[];
  mandiPrices: MandiPriceRecord[];
  listings: FarmerProduceListing[];
  offers: BuyerOffer[];
  orders: OrderDeal[];
  disputes: DisputeRecord[];
  storageFacilities: StorageFacility[];
  transportOptions: TransportOption[];
  weatherAlerts: WeatherAlert[];
  fpoMembersCrops: FPOMemberCrop[];
  isLoadingData: boolean;
  isLiveSynced: boolean;
  refreshData: () => Promise<void>;

  addListing: (listing: Omit<FarmerProduceListing, 'id' | 'createdAt' | 'offersCount'>) => Promise<void>;
  updateListingStatus: (id: string, status: FarmerProduceListing['status']) => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string) => Promise<void>;
  counterOffer: (offerId: string, counterPrice: number) => Promise<void>;
  createBuyerOffer: (offer: Omit<BuyerOffer, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderDeal['status'], milestone?: number) => Promise<void>;
  createDispute: (dispute: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  resolveDispute: (disputeId: string, resolutionNotes: string) => Promise<void>;
  addMandiPriceRecord: (record: Omit<MandiPriceRecord, 'id'>) => Promise<void>;
  reserveStorage: (data: { facilityId: string; facilityName: string; cropName: string; quantityQuintals: number; holdingDays: number; rent: number }) => Promise<void>;
  bookTransport: (data: { providerId: string; providerName: string; vehicleType: string; distanceKm: number; quantityQuintals: number }) => Promise<void>;
}

const MandiDataContext = createContext<MandiDataContextType | undefined>(undefined);

export const MandiDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useState<Crop[]>(CROPS);
  const [mandis, setMandis] = useState<Mandi[]>(MANDIS);
  const [storageFacilities, setStorageFacilities] = useState<StorageFacility[]>(STORAGE_FACILITIES);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>(TRANSPORT_OPTIONS);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>(WEATHER_ALERTS);
  const [fpoMembersCrops, setFpoMembersCrops] = useState<FPOMemberCrop[]>(FPO_MEMBERS_CROPS);

  // Initialize with consistent default arrays to guarantee 100% identical server/client render
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>(INITIAL_PRICES);
  const [listings, setListings] = useState<FarmerProduceListing[]>(INITIAL_LISTINGS);
  const [offers, setOffers] = useState<BuyerOffer[]>(INITIAL_OFFERS);
  const [orders, setOrders] = useState<OrderDeal[]>(INITIAL_ORDERS);
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(isSupabaseConfigured);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load saved local cache ONLY after initial component mounting
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedPrices = getStorageItem<MandiPriceRecord[] | null>('mandi_prices', null);
      if (savedPrices && Array.isArray(savedPrices) && savedPrices.length > 0) setMandiPrices(savedPrices);

      const savedListings = getStorageItem<FarmerProduceListing[] | null>('produce_listings', null);
      if (savedListings && Array.isArray(savedListings) && savedListings.length > 0) setListings(savedListings);

      const savedOffers = getStorageItem<BuyerOffer[] | null>('buyer_offers', null);
      if (savedOffers && Array.isArray(savedOffers) && savedOffers.length > 0) setOffers(savedOffers);

      const savedOrders = getStorageItem<OrderDeal[] | null>('order_deals', null);
      if (savedOrders && Array.isArray(savedOrders) && savedOrders.length > 0) setOrders(savedOrders);

      const savedDisputes = getStorageItem<DisputeRecord[] | null>('dispute_records', null);
      if (savedDisputes && Array.isArray(savedDisputes) && savedDisputes.length > 0) setDisputes(savedDisputes);
    } catch (e) {
      console.warn('Error restoring local storage mandi cache:', e);
    }
  }, []);

  // Sync to local storage only AFTER mounting has completed
  useEffect(() => {
    if (isMounted) setStorageItem('mandi_prices', mandiPrices);
  }, [mandiPrices, isMounted]);

  useEffect(() => {
    if (isMounted) setStorageItem('produce_listings', listings);
  }, [listings, isMounted]);

  useEffect(() => {
    if (isMounted) setStorageItem('buyer_offers', offers);
  }, [offers, isMounted]);

  useEffect(() => {
    if (isMounted) setStorageItem('order_deals', orders);
  }, [orders, isMounted]);

  useEffect(() => {
    if (isMounted) setStorageItem('dispute_records', disputes);
  }, [disputes, isMounted]);

  // ---------------------------------------------------------------------------
  // Fetch Actual Data from Supabase
  // ---------------------------------------------------------------------------
  const refreshData = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    setIsLoadingData(true);
    try {
      // 1. Ensure initial seed exists if tables are blank
      await seedSupabaseIfEmpty();

      // 2. Fetch Crops
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*');
      if (!cropsError && cropsData && cropsData.length > 0) {
        setCrops(
          cropsData.map((c) => ({
            id: c.id,
            name: c.name,
            hindiName: c.hindi_name,
            category: c.category,
            shelfLifeDays: Number(c.shelf_life_days),
            perishabilityIndex: c.perishability_index,
            dailyWeightLossRate: Number(c.daily_weight_loss_rate),
            standardMoisturePercent: Number(c.standard_moisture_percent),
            baseStorageCostPerQuintalPerMonth: Number(c.base_storage_cost_per_quintal_per_month),
            typicalTransportCostPerKmPerQuintal: Number(c.typical_transport_cost_per_km_per_quintal),
          }))
        );
      }

      // 3. Fetch Mandis
      const { data: mandisData, error: mandisError } = await supabase
        .from('mandis')
        .select('*');
      if (!mandisError && mandisData && mandisData.length > 0) {
        setMandis(
          mandisData.map((m) => ({
            id: m.id,
            name: m.name,
            district: m.district,
            state: m.state,
            distanceKm: Number(m.distance_km),
            contactNumber: m.contact_number,
            operatingHours: m.operating_hours,
            dailyArrivalsQuintals: Number(m.daily_arrivals_quintals),
            tradeVolumeQuintals: Number(m.trade_volume_quintals),
          }))
        );
      }

      // 4. Fetch Live Mandi Prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('mandi_prices')
        .select('*')
        .order('date', { ascending: false });
      if (!pricesError && pricesData && pricesData.length > 0) {
        setMandiPrices(pricesData.map(mapMandiPriceFromDb));
      }

      // 5. Fetch Produce Listings
      const { data: listingsData, error: listError } = await supabase
        .from('produce_listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!listError && listingsData && listingsData.length > 0) {
        setListings(listingsData.map(mapListingFromDb));
      }

      // 6. Fetch Buyer Offers
      const { data: offersData, error: offError } = await supabase
        .from('buyer_offers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!offError && offersData && offersData.length > 0) {
        setOffers(offersData.map(mapOfferFromDb));
      }

      // 7. Fetch Orders
      const { data: ordersData, error: ordError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!ordError && ordersData && ordersData.length > 0) {
        setOrders(ordersData.map(mapOrderFromDb));
      }

      // 8. Fetch Disputes
      const { data: disputesData, error: dispError } = await supabase
        .from('disputes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!dispError && disputesData && disputesData.length > 0) {
        setDisputes(disputesData.map(mapDisputeFromDb));
      }

      // 9. Fetch Storage Facilities
      const { data: storData, error: storError } = await supabase
        .from('storage_facilities')
        .select('*');
      if (!storError && storData && storData.length > 0) {
        setStorageFacilities(
          storData.map((s) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            location: s.location,
            distanceKm: Number(s.distance_km),
            capacityQuintals: Number(s.capacity_quintals),
            availableCapacityQuintals: Number(s.available_capacity_quintals),
            ratePerQuintalPerMonth: Number(s.rate_per_quintal_per_month),
            climateControlled: Boolean(s.climate_controlled),
            insuranceCovered: Boolean(s.insurance_covered),
            rating: Number(s.rating),
            phone: s.phone,
          }))
        );
      }

      // 10. Fetch Transport Options
      const { data: transData, error: transError } = await supabase
        .from('transport_options')
        .select('*');
      if (!transError && transData && transData.length > 0) {
        setTransportOptions(
          transData.map((t) => ({
            id: t.id,
            providerName: t.provider_name,
            vehicleType: t.vehicle_type,
            capacityQuintals: Number(t.capacity_quintals),
            baseCharge: Number(t.base_charge),
            ratePerKm: Number(t.rate_per_km),
            handlingChargePerQuintal: Number(t.handling_charge_per_quintal),
            availableInHours: Number(t.available_in_hours),
            rating: Number(t.rating),
            contactNumber: t.contact_number,
          }))
        );
      }

      // 11. Fetch Weather Alerts
      const { data: weatherData, error: weatherError } = await supabase
        .from('weather_alerts')
        .select('*')
        .order('date', { ascending: true });
      if (!weatherError && weatherData && weatherData.length > 0) {
        setWeatherAlerts(
          weatherData.map((w) => ({
            id: w.id,
            date: w.date,
            forecastDay: w.forecast_day,
            condition: w.condition,
            tempMin: Number(w.temp_min),
            tempMax: Number(w.temp_max),
            humidityPercent: Number(w.humidity_percent),
            rainfallMm: Number(w.rainfall_mm),
            windSpeedKmh: Number(w.wind_speed_kmh),
            impactOnHarvest: w.impact_on_harvest,
            advisoryNote: w.advisory_note,
            alertLevel: w.alert_level,
          }))
        );
      }

      // 12. Fetch FPO Pipeline
      const { data: fpoData, error: fpoError } = await supabase
        .from('fpo_members_crops')
        .select('*');
      if (!fpoError && fpoData && fpoData.length > 0) {
        setFpoMembersCrops(
          fpoData.map((f) => ({
            memberId: f.member_id,
            memberName: f.member_name,
            village: f.village,
            phone: f.phone,
            cropName: f.crop_name,
            acreage: Number(f.acreage),
            expectedYieldQuintals: Number(f.expected_yield_quintals),
            harvestWindowStart: f.harvest_window_start,
            harvestWindowEnd: f.harvest_window_end,
          }))
        );
      }

      setIsLiveSynced(true);
    } catch (err) {
      console.warn('Error fetching Supabase data, utilizing local fallback:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-Time Supabase Channel Subscription
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase
      .channel('mandi-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'produce_listings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = mapListingFromDb(payload.new);
            setListings((prev) => [newItem, ...prev.filter((l) => l.id !== newItem.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapListingFromDb(payload.new);
            setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
          } else if (payload.eventType === 'DELETE') {
            setListings((prev) => prev.filter((l) => l.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buyer_offers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = mapOfferFromDb(payload.new);
            setOffers((prev) => [newItem, ...prev.filter((o) => o.id !== newItem.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapOfferFromDb(payload.new);
            setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = mapOrderFromDb(payload.new);
            setOrders((prev) => [newItem, ...prev.filter((o) => o.id !== newItem.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapOrderFromDb(payload.new);
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mandi_prices' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const item = mapMandiPriceFromDb(payload.new);
            setMandiPrices((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Application Form Handlers Connected to Supabase
  // ---------------------------------------------------------------------------

  const addListing = async (newListingData: Omit<FarmerProduceListing, 'id' | 'createdAt' | 'offersCount'>) => {
    const tempId = `list-${Date.now().toString().slice(-4)}`;
    const newListing: FarmerProduceListing = {
      ...newListingData,
      id: tempId,
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setListings((prev) => [newListing, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = mapListingToDb(newListing);
        const { data, error } = await supabase
          .from('produce_listings')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          const inserted = mapListingFromDb(data);
          setListings((prev) => [inserted, ...prev.filter((l) => l.id !== tempId)]);
        }
      } catch (err) {
        console.warn('Error inserting listing to Supabase:', err);
      }
    }
  };

  const updateListingStatus = async (id: string, status: FarmerProduceListing['status']) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('produce_listings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Error updating listing status in Supabase:', err);
      }
    }
  };

  const acceptOffer = async (offerId: string) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return;

    // 1. Mark offer accepted
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );

    // 2. Mark listing sold
    await updateListingStatus(targetOffer.listingId, 'sold');

    // 3. Create a live order deal
    const totalAmount = targetOffer.quantityQuintals * targetOffer.offeredPricePerQuintal;
    const tempOrderId = `ord-${Date.now().toString().slice(-4)}`;
    const newOrder: OrderDeal = {
      id: tempOrderId,
      listingId: targetOffer.listingId,
      buyerOfferId: targetOffer.id,
      farmerId: 'farmer-ramesh-01',
      farmerName: 'Rameshwar Patidar',
      buyerId: targetOffer.buyerId,
      buyerName: targetOffer.buyerBusinessName,
      cropName: targetOffer.cropName,
      quantityQuintals: targetOffer.quantityQuintals,
      agreedPricePerQuintal: targetOffer.offeredPricePerQuintal,
      totalAmount,
      paymentTerms: targetOffer.paymentTerms,
      status: 'confirmed',
      paymentStatus: 'in_escrow',
      currentMilestone: 1,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('buyer_offers')
          .update({ status: 'accepted', updated_at: new Date().toISOString() })
          .eq('id', offerId);

        const orderPayload = mapOrderToDb(newOrder);
        const { data } = await supabase
          .from('orders')
          .insert([orderPayload])
          .select()
          .single();

        if (data) {
          const insertedOrder = mapOrderFromDb(data);
          setOrders((prev) => [insertedOrder, ...prev.filter((o) => o.id !== tempOrderId)]);
        }
      } catch (err) {
        console.warn('Error accepting offer in Supabase:', err);
      }
    }
  };

  const rejectOffer = async (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('buyer_offers')
          .update({ status: 'rejected', updated_at: new Date().toISOString() })
          .eq('id', offerId);
      } catch (err) {
        console.warn('Error rejecting offer in Supabase:', err);
      }
    }
  };

  const counterOffer = async (offerId: string, counterPrice: number) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: 'countered', counterPrice } : o
      )
    );

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('buyer_offers')
          .update({
            status: 'countered',
            counter_price: counterPrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', offerId);
      } catch (err) {
        console.warn('Error submitting counter offer in Supabase:', err);
      }
    }
  };

  const createBuyerOffer = async (offerData: Omit<BuyerOffer, 'id' | 'createdAt' | 'status'>) => {
    const tempId = `off-${Date.now().toString().slice(-4)}`;
    const newOffer: BuyerOffer = {
      ...offerData,
      id: tempId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOffers((prev) => [newOffer, ...prev]);
    setListings((prev) =>
      prev.map((l) =>
        l.id === offerData.listingId ? { ...l, offersCount: l.offersCount + 1 } : l
      )
    );

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = mapOfferToDb(newOffer);
        const { data } = await supabase
          .from('buyer_offers')
          .insert([payload])
          .select()
          .single();

        if (data) {
          const inserted = mapOfferFromDb(data);
          setOffers((prev) => [inserted, ...prev.filter((o) => o.id !== tempId)]);
        }
      } catch (err) {
        console.warn('Error creating buyer offer in Supabase:', err);
      }
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderDeal['status'],
    milestone?: number
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const newMilestone = milestone !== undefined ? milestone : order.currentMilestone;
        const newPaymentStatus =
          status === 'completed' ? 'paid_to_farmer' : order.paymentStatus;
        return {
          ...order,
          status,
          currentMilestone: newMilestone,
          paymentStatus: newPaymentStatus,
        };
      })
    );

    if (supabase && isSupabaseConfigured) {
      try {
        const updates: any = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (milestone !== undefined) updates.current_milestone = milestone;
        if (status === 'completed') updates.payment_status = 'paid_to_farmer';

        await supabase
          .from('orders')
          .update(updates)
          .eq('id', orderId);
      } catch (err) {
        console.warn('Error updating order status in Supabase:', err);
      }
    }
  };

  const createDispute = async (disputeData: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => {
    const tempId = `disp-${Date.now().toString().slice(-4)}`;
    const newDispute: DisputeRecord = {
      ...disputeData,
      id: tempId,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = mapDisputeToDb(newDispute);
        const { data } = await supabase
          .from('disputes')
          .insert([payload])
          .select()
          .single();

        if (data) {
          const inserted = mapDisputeFromDb(data);
          setDisputes((prev) => [inserted, ...prev.filter((d) => d.id !== tempId)]);
        }
      } catch (err) {
        console.warn('Error logging dispute to Supabase:', err);
      }
    }
  };

  const resolveDispute = async (disputeId: string, resolutionNotes: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: 'resolved', resolutionNotes } : d
      )
    );

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase
          .from('disputes')
          .update({
            status: 'resolved',
            resolution_notes: resolutionNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', disputeId);
      } catch (err) {
        console.warn('Error resolving dispute in Supabase:', err);
      }
    }
  };

  const addMandiPriceRecord = async (record: Omit<MandiPriceRecord, 'id'>) => {
    const tempId = `pr-${Date.now().toString().slice(-4)}`;
    const newRecord: MandiPriceRecord = {
      ...record,
      id: tempId,
    };

    setMandiPrices((prev) => [newRecord, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        const payload = mapMandiPriceToDb(newRecord);
        const { data } = await supabase
          .from('mandi_prices')
          .insert([payload])
          .select()
          .single();

        if (data) {
          const inserted = mapMandiPriceFromDb(data);
          setMandiPrices((prev) => [inserted, ...prev.filter((p) => p.id !== tempId)]);
        }
      } catch (err) {
        console.warn('Error inserting mandi price in Supabase:', err);
      }
    }
  };

  const reserveStorage = async (data: {
    facilityId: string;
    facilityName: string;
    cropName: string;
    quantityQuintals: number;
    holdingDays: number;
    rent: number;
  }) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('storage_reservations').insert([
          {
            facility_id: data.facilityId,
            facility_name: data.facilityName,
            farmer_id: 'farmer-ramesh-01',
            crop_name: data.cropName,
            quantity_quintals: data.quantityQuintals,
            holding_days: data.holdingDays,
            estimated_total_rent: data.rent,
            status: 'confirmed',
          },
        ]);
      } catch (err) {
        console.warn('Error reserving storage in Supabase:', err);
      }
    }
  };

  const bookTransport = async (data: {
    providerId: string;
    providerName: string;
    vehicleType: string;
    distanceKm: number;
    quantityQuintals: number;
  }) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('transport_bookings').insert([
          {
            provider_id: data.providerId,
            provider_name: data.providerName,
            farmer_id: 'farmer-ramesh-01',
            vehicle_type: data.vehicleType,
            distance_km: data.distanceKm,
            quantity_quintals: data.quantityQuintals,
            driver_name: 'Mohan Gurjar',
            driver_phone: '+91 97552 19280',
            driver_vehicle_number: 'MP-09-GH-8219',
            status: 'dispatched',
          },
        ]);
      } catch (err) {
        console.warn('Error booking transport in Supabase:', err);
      }
    }
  };

  return (
    <MandiDataContext.Provider
      value={{
        crops,
        mandis,
        mandiPrices,
        listings,
        offers,
        orders,
        disputes,
        storageFacilities,
        transportOptions,
        weatherAlerts,
        fpoMembersCrops,
        isLoadingData,
        isLiveSynced,
        refreshData,
        addListing,
        updateListingStatus,
        acceptOffer,
        rejectOffer,
        counterOffer,
        createBuyerOffer,
        updateOrderStatus,
        createDispute,
        resolveDispute,
        addMandiPriceRecord,
        reserveStorage,
        bookTransport,
      }}
    >
      {children}
    </MandiDataContext.Provider>
  );
};

export const useMandiData = () => {
  const context = useContext(MandiDataContext);
  if (!context) {
    throw new Error('useMandiData must be used within a MandiDataProvider');
  }
  return context;
};
