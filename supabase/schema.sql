-- MANDI MITRA AI: Full PostgreSQL Database Schema
-- Production-Ready with Row Level Security (RLS) & Foreign Keys

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & AUTH
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'fpo', 'admin')),
  language TEXT NOT NULL DEFAULT 'hi',
  village TEXT,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
  land_size_acres NUMERIC(6,2),
  primary_crops TEXT[],
  business_name TEXT,
  buyer_category TEXT,
  gstin TEXT,
  pan_number TEXT,
  fpo_registration_number TEXT,
  fpo_member_count INT,
  verified BOOLEAN DEFAULT false,
  trust_score INT DEFAULT 85,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMMODITIES & CROPS
CREATE TABLE IF NOT EXISTS public.crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hindi_name TEXT NOT NULL,
  category TEXT NOT NULL,
  shelf_life_days INT NOT NULL,
  perishability_index TEXT NOT NULL CHECK (perishability_index IN ('High', 'Medium', 'Low')),
  daily_weight_loss_rate NUMERIC(6,5) NOT NULL,
  standard_moisture_percent NUMERIC(4,2) NOT NULL,
  base_storage_cost_per_quintal_per_month NUMERIC(6,2) NOT NULL,
  typical_transport_cost_per_km_per_quintal NUMERIC(5,2) NOT NULL
);

-- 3. MANDIS (APMC MARKETS)
CREATE TABLE IF NOT EXISTS public.mandis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  distance_km NUMERIC(6,2) NOT NULL,
  contact_number TEXT,
  operating_hours TEXT,
  daily_arrivals_quintals NUMERIC(10,2),
  trade_volume_quintals NUMERIC(10,2)
);

-- 4. LIVE MANDI PRICES
CREATE TABLE IF NOT EXISTS public.mandi_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mandi_id TEXT REFERENCES public.mandis(id) ON DELETE CASCADE,
  crop_id TEXT REFERENCES public.crops(id) ON DELETE CASCADE,
  variety TEXT NOT NULL,
  min_price NUMERIC(8,2) NOT NULL,
  max_price NUMERIC(8,2) NOT NULL,
  modal_price NUMERIC(8,2) NOT NULL,
  arrival_tons NUMERIC(8,2) NOT NULL,
  price_change_percent NUMERIC(4,2) DEFAULT 0,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 5. FARMER PRODUCE LISTINGS
CREATE TABLE IF NOT EXISTS public.produce_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  crop_id TEXT REFERENCES public.crops(id),
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  expected_price_per_quintal NUMERIC(8,2) NOT NULL,
  harvest_date DATE NOT NULL,
  available_from_date DATE NOT NULL,
  expiry_or_storage_limit_days INT NOT NULL,
  grade TEXT CHECK (grade IN ('A', 'B', 'C')),
  moisture_percent NUMERIC(4,2),
  photos TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'negotiating', 'sold', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUYER OFFERS
CREATE TABLE IF NOT EXISTS public.buyer_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.produce_listings(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_business_name TEXT NOT NULL,
  buyer_category TEXT,
  buyer_rating NUMERIC(3,2) DEFAULT 4.5,
  buyer_verified BOOLEAN DEFAULT false,
  offered_price_per_quintal NUMERIC(8,2) NOT NULL,
  payment_terms TEXT NOT NULL,
  transport_provided_by_buyer BOOLEAN DEFAULT false,
  transport_allowance_per_quintal NUMERIC(6,2) DEFAULT 0,
  delivery_mandi_or_location TEXT NOT NULL,
  distance_km NUMERIC(6,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')),
  counter_price NUMERIC(8,2),
  notes TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS & DEALS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.produce_listings(id),
  buyer_offer_id UUID REFERENCES public.buyer_offers(id),
  farmer_id UUID REFERENCES public.profiles(id),
  buyer_id UUID REFERENCES public.profiles(id),
  crop_name TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  agreed_price_per_quintal NUMERIC(8,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  payment_terms TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'dispatched', 'in_transit', 'weighed_and_inspected', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'in_escrow' CHECK (payment_status IN ('pending', 'in_escrow', 'released', 'paid_to_farmer')),
  dispatch_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  transport_vehicle_number TEXT,
  driver_phone TEXT,
  current_milestone INT DEFAULT 1,
  inspection_moisture NUMERIC(4,2),
  inspection_foreign_matter NUMERIC(4,2),
  final_net_weight_quintals NUMERIC(8,2),
  adjusted_amount NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DISPUTES & GRIEVANCES
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  raised_by TEXT NOT NULL CHECK (raised_by IN ('farmer', 'buyer')),
  party_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'fpo_arbitration', 'resolved')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Allow public read of crops, mandis, and prices
CREATE POLICY "Public crops viewable by everyone" ON public.crops FOR SELECT USING (true);
CREATE POLICY "Public mandis viewable by everyone" ON public.mandis FOR SELECT USING (true);
CREATE POLICY "Public prices viewable by everyone" ON public.mandi_prices FOR SELECT USING (true);
CREATE POLICY "Listings viewable by everyone" ON public.produce_listings FOR SELECT USING (true);
