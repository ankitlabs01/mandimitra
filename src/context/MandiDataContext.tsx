'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  addListing: (listing: Omit<FarmerProduceListing, 'id' | 'createdAt' | 'offersCount'>) => void;
  updateListingStatus: (id: string, status: FarmerProduceListing['status']) => void;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  counterOffer: (offerId: string, counterPrice: number) => void;
  createBuyerOffer: (offer: Omit<BuyerOffer, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderDeal['status'], milestone?: number) => void;
  createDispute: (dispute: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => void;
  resolveDispute: (disputeId: string, resolutionNotes: string) => void;
  addMandiPriceRecord: (record: Omit<MandiPriceRecord, 'id'>) => void;
}

const MandiDataContext = createContext<MandiDataContextType | undefined>(undefined);

export const MandiDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops] = useState<Crop[]>(CROPS);
  const [mandis] = useState<Mandi[]>(MANDIS);
  const [storageFacilities] = useState<StorageFacility[]>(STORAGE_FACILITIES);
  const [transportOptions] = useState<TransportOption[]>(TRANSPORT_OPTIONS);
  const [weatherAlerts] = useState<WeatherAlert[]>(WEATHER_ALERTS);
  const [fpoMembersCrops] = useState<FPOMemberCrop[]>(FPO_MEMBERS_CROPS);

  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>(() =>
    getStorageItem('mandi_prices', INITIAL_PRICES)
  );

  const [listings, setListings] = useState<FarmerProduceListing[]>(() =>
    getStorageItem('produce_listings', INITIAL_LISTINGS)
  );

  const [offers, setOffers] = useState<BuyerOffer[]>(() =>
    getStorageItem('buyer_offers', INITIAL_OFFERS)
  );

  const [orders, setOrders] = useState<OrderDeal[]>(() =>
    getStorageItem('order_deals', INITIAL_ORDERS)
  );

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() =>
    getStorageItem('dispute_records', INITIAL_DISPUTES)
  );

  // Sync to local storage
  useEffect(() => {
    setStorageItem('mandi_prices', mandiPrices);
  }, [mandiPrices]);

  useEffect(() => {
    setStorageItem('produce_listings', listings);
  }, [listings]);

  useEffect(() => {
    setStorageItem('buyer_offers', offers);
  }, [offers]);

  useEffect(() => {
    setStorageItem('order_deals', orders);
  }, [orders]);

  useEffect(() => {
    setStorageItem('dispute_records', disputes);
  }, [disputes]);

  const addListing = (newListingData: Omit<FarmerProduceListing, 'id' | 'createdAt' | 'offersCount'>) => {
    const newListing: FarmerProduceListing = {
      ...newListingData,
      id: `list-${Date.now().toString().slice(-4)}`,
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const updateListingStatus = (id: string, status: FarmerProduceListing['status']) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const acceptOffer = (offerId: string) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return;

    // 1. Mark offer accepted
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );

    // 2. Mark listing sold
    updateListingStatus(targetOffer.listingId, 'sold');

    // 3. Create a live order deal
    const totalAmount = targetOffer.quantityQuintals * targetOffer.offeredPricePerQuintal;
    const newOrder: OrderDeal = {
      id: `ord-${Date.now().toString().slice(-4)}`,
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
  };

  const rejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );
  };

  const counterOffer = (offerId: string, counterPrice: number) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: 'countered', counterPrice } : o
      )
    );
  };

  const createBuyerOffer = (offerData: Omit<BuyerOffer, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: BuyerOffer = {
      ...offerData,
      id: `off-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => [newOffer, ...prev]);
    // increment listing offersCount
    setListings((prev) =>
      prev.map((l) =>
        l.id === offerData.listingId ? { ...l, offersCount: l.offersCount + 1 } : l
      )
    );
  };

  const updateOrderStatus = (
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
  };

  const createDispute = (disputeData: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => {
    const newDispute: DisputeRecord = {
      ...disputeData,
      id: `disp-${Date.now().toString().slice(-4)}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setDisputes((prev) => [newDispute, ...prev]);
  };

  const resolveDispute = (disputeId: string, resolutionNotes: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: 'resolved', resolutionNotes } : d
      )
    );
  };

  const addMandiPriceRecord = (record: Omit<MandiPriceRecord, 'id'>) => {
    const newRecord: MandiPriceRecord = {
      ...record,
      id: `pr-${Date.now().toString().slice(-4)}`,
    };
    setMandiPrices((prev) => [newRecord, ...prev]);
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
