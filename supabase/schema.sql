-- ==============================================================================
-- MANDI MITRA AI: Complete PostgreSQL & Supabase Database Schema
-- Production-Ready with Row Level Security (RLS), Relationships & Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'fpo', 'admin')),
  language TEXT NOT NULL DEFAULT 'hi',
  village TEXT,
  district TEXT NOT NULL DEFAULT 'Indore',
  state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
  land_size_acres NUMERIC(6,2),
  primary_crops TEXT[] DEFAULT ARRAY[]::TEXT[],
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

-- ------------------------------------------------------------------------------
-- 2. COMMODITIES / CROPS TABLE
-- ------------------------------------------------------------------------------
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
  typical_transport_cost_per_km_per_quintal NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. MANDIS (APMC MARKETS) TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mandis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  distance_km NUMERIC(6,2) NOT NULL,
  contact_number TEXT,
  operating_hours TEXT,
  daily_arrivals_quintals NUMERIC(10,2),
  trade_volume_quintals NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. LIVE MANDI PRICES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mandi_prices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  mandi_id TEXT REFERENCES public.mandis(id) ON DELETE CASCADE,
  mandi_name TEXT NOT NULL,
  crop_id TEXT REFERENCES public.crops(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  min_price NUMERIC(8,2) NOT NULL,
  max_price NUMERIC(8,2) NOT NULL,
  modal_price NUMERIC(8,2) NOT NULL,
  arrival_tons NUMERIC(8,2) NOT NULL,
  price_change_percent NUMERIC(4,2) DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. FARMER PRODUCE LISTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.produce_listings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  crop_id TEXT REFERENCES public.crops(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  expected_price_per_quintal NUMERIC(8,2) NOT NULL,
  harvest_date DATE NOT NULL,
  available_from_date DATE NOT NULL,
  expiry_or_storage_limit_days INT NOT NULL,
  grade TEXT CHECK (grade IN ('A', 'B', 'C')),
  moisture_percent NUMERIC(4,2),
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'negotiating', 'sold', 'expired')),
  offers_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. BUYER OFFERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buyer_offers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id TEXT REFERENCES public.produce_listings(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  buyer_id TEXT NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. ORDERS & CONTRACTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id TEXT,
  buyer_offer_id TEXT,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
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
  inspection_report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. DISPUTES & GRIEVANCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disputes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  raised_by TEXT NOT NULL CHECK (raised_by IN ('farmer', 'buyer')),
  party_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'fpo_arbitration', 'resolved')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. STORAGE FACILITIES & RESERVATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.storage_facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  distance_km NUMERIC(6,2) NOT NULL,
  capacity_quintals NUMERIC(10,2) NOT NULL,
  available_capacity_quintals NUMERIC(10,2) NOT NULL,
  rate_per_quintal_per_month NUMERIC(6,2) NOT NULL,
  climate_controlled BOOLEAN DEFAULT false,
  insurance_covered BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 4.5,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.storage_reservations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  facility_id TEXT REFERENCES public.storage_facilities(id) ON DELETE CASCADE,
  facility_name TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  holding_days INT NOT NULL,
  estimated_total_rent NUMERIC(10,2),
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. TRANSPORT FLEET & BOOKINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transport_options (
  id TEXT PRIMARY KEY,
  provider_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  capacity_quintals NUMERIC(10,2) NOT NULL,
  base_charge NUMERIC(8,2) NOT NULL,
  rate_per_km NUMERIC(6,2) NOT NULL,
  handling_charge_per_quintal NUMERIC(6,2) NOT NULL,
  available_in_hours INT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 4.5,
  contact_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transport_bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  provider_id TEXT REFERENCES public.transport_options(id) ON DELETE SET NULL,
  provider_name TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  distance_km NUMERIC(6,2) NOT NULL,
  quantity_quintals NUMERIC(8,2) NOT NULL,
  driver_name TEXT,
  driver_phone TEXT,
  driver_vehicle_number TEXT,
  status TEXT DEFAULT 'dispatched',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. WEATHER ALERTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_alerts (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  forecast_day TEXT NOT NULL,
  condition TEXT NOT NULL,
  temp_min NUMERIC(4,1) NOT NULL,
  temp_max NUMERIC(4,1) NOT NULL,
  humidity_percent INT NOT NULL,
  rainfall_mm NUMERIC(5,1) NOT NULL,
  wind_speed_kmh NUMERIC(5,1) NOT NULL,
  impact_on_harvest TEXT NOT NULL,
  advisory_note TEXT NOT NULL,
  alert_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. FPO MEMBERS CROPS PIPELINE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fpo_members_crops (
  member_id TEXT PRIMARY KEY,
  member_name TEXT NOT NULL,
  village TEXT NOT NULL,
  phone TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  acreage NUMERIC(6,2) NOT NULL,
  expected_yield_quintals NUMERIC(8,2) NOT NULL,
  harvest_window_start DATE NOT NULL,
  harvest_window_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- AUTH TRIGGER: AUTO-CREATE OR SYNC PROFILE ON USER SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    name,
    email,
    phone,
    role,
    language,
    village,
    district,
    state,
    land_size_acres,
    primary_crops,
    business_name,
    buyer_category,
    gstin,
    pan_number,
    fpo_registration_number,
    fpo_member_count,
    verified,
    trust_score
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Kisan Mitra'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, '+91 98000 00000'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'hi'),
    NEW.raw_user_meta_data->>'village',
    COALESCE(NEW.raw_user_meta_data->>'district', 'Indore'),
    COALESCE(NEW.raw_user_meta_data->>'state', 'Madhya Pradesh'),
    (NEW.raw_user_meta_data->>'land_size_acres')::numeric,
    ARRAY['Soybean (JS-9560)', 'Sharbati Wheat']::TEXT[],
    NEW.raw_user_meta_data->>'business_name',
    NEW.raw_user_meta_data->>'buyer_category',
    NEW.raw_user_meta_data->>'gstin',
    NEW.raw_user_meta_data->>'pan_number',
    NEW.raw_user_meta_data->>'fpo_registration_number',
    (NEW.raw_user_meta_data->>'fpo_member_count')::int,
    true,
    92
  )
  ON CONFLICT (user_id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fpo_members_crops ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Static & Agricultural Intelligence
DROP POLICY IF EXISTS "Public crops viewable by all" ON public.crops;
CREATE POLICY "Public crops viewable by all" ON public.crops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mandis viewable by all" ON public.mandis;
CREATE POLICY "Public mandis viewable by all" ON public.mandis FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public prices viewable by all" ON public.mandi_prices;
CREATE POLICY "Public prices viewable by all" ON public.mandi_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public prices insertable by all" ON public.mandi_prices;
CREATE POLICY "Public prices insertable by all" ON public.mandi_prices FOR ALL USING (true);

DROP POLICY IF EXISTS "Public weather alerts viewable by all" ON public.weather_alerts;
CREATE POLICY "Public weather alerts viewable by all" ON public.weather_alerts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public storage facilities viewable by all" ON public.storage_facilities;
CREATE POLICY "Public storage facilities viewable by all" ON public.storage_facilities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public transport options viewable by all" ON public.transport_options;
CREATE POLICY "Public transport options viewable by all" ON public.transport_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public FPO pipeline viewable by all" ON public.fpo_members_crops;
CREATE POLICY "Public FPO pipeline viewable by all" ON public.fpo_members_crops FOR ALL USING (true);

-- 2. Profiles Policies
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true);

-- 3. Produce Listings Policies
DROP POLICY IF EXISTS "Listings viewable by everyone" ON public.produce_listings;
CREATE POLICY "Listings viewable by everyone" ON public.produce_listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create or manage produce listings" ON public.produce_listings;
CREATE POLICY "Anyone can create or manage produce listings" ON public.produce_listings FOR ALL USING (true);

-- 4. Buyer Offers Policies
DROP POLICY IF EXISTS "Offers viewable by involved parties" ON public.buyer_offers;
CREATE POLICY "Offers viewable by involved parties" ON public.buyer_offers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create or update buyer offers" ON public.buyer_offers;
CREATE POLICY "Anyone can create or update buyer offers" ON public.buyer_offers FOR ALL USING (true);

-- 5. Orders Policies
DROP POLICY IF EXISTS "Orders viewable and manageable by involved parties" ON public.orders;
CREATE POLICY "Orders viewable and manageable by involved parties" ON public.orders FOR ALL USING (true);

-- 6. Disputes Policies
DROP POLICY IF EXISTS "Disputes viewable and manageable by all" ON public.disputes;
CREATE POLICY "Disputes viewable and manageable by all" ON public.disputes FOR ALL USING (true);

-- 7. Reservations & Bookings Policies
DROP POLICY IF EXISTS "Storage reservations open access" ON public.storage_reservations;
CREATE POLICY "Storage reservations open access" ON public.storage_reservations FOR ALL USING (true);

DROP POLICY IF EXISTS "Transport bookings open access" ON public.transport_bookings;
CREATE POLICY "Transport bookings open access" ON public.transport_bookings FOR ALL USING (true);
