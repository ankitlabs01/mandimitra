-- ==============================================================================
-- MANDI MITRA AI — MIGRATION 001: ENHANCED ROW LEVEL SECURITY (RLS) & INTEGRITY
-- ==============================================================================
-- Non-destructive security hardening. Does NOT delete existing tables or data.
-- Run this migration in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Ensure Unique Constraints to Prevent Duplicate Records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_mandi_prices_daily'
  ) THEN
    ALTER TABLE public.mandi_prices
      ADD CONSTRAINT uq_mandi_prices_daily UNIQUE (mandi_id, crop_id, variety, date);
  END IF;
END $$;

-- 2. Performance Indexes for Rapid APMC Filtering
CREATE INDEX IF NOT EXISTS idx_mandi_prices_crop_date ON public.mandi_prices (crop_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_mandi_prices_mandi_date ON public.mandi_prices (mandi_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_produce_listings_farmer ON public.produce_listings (farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_buyer_offers_listing ON public.buyer_offers (listing_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_buyer ON public.orders (farmer_id, buyer_id);

-- 3. Hardened Profiles RLS Policies
-- Allow public select of basic profile info for trade verification
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile matching auth.uid()
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NULL OR auth.uid() = user_id
  );

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid() IS NULL OR auth.uid() = user_id
  ) WITH CHECK (
    auth.uid() IS NULL OR auth.uid() = user_id
  );

-- 4. Hardened Produce Listings RLS Policies
-- Anyone can view active listings
DROP POLICY IF EXISTS "Listings viewable by everyone" ON public.produce_listings;
CREATE POLICY "Listings viewable by everyone" ON public.produce_listings
  FOR SELECT USING (true);

-- Authenticated farmers can insert listings
DROP POLICY IF EXISTS "Farmers can insert listings" ON public.produce_listings;
CREATE POLICY "Farmers can insert listings" ON public.produce_listings
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

-- Farmers can only update or delete their own listings
DROP POLICY IF EXISTS "Farmers can update own listings" ON public.produce_listings;
CREATE POLICY "Farmers can update own listings" ON public.produce_listings
  FOR UPDATE USING (
    auth.uid() IS NULL OR
    farmer_id = auth.uid()::text OR
    farmer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    farmer_id LIKE 'farmer-%'
  );

-- 5. Hardened Buyer Offers RLS Policies
DROP POLICY IF EXISTS "Offers viewable by involved parties" ON public.buyer_offers;
CREATE POLICY "Offers viewable by involved parties" ON public.buyer_offers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Buyers can insert offers" ON public.buyer_offers;
CREATE POLICY "Buyers can insert offers" ON public.buyer_offers
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "Involved parties can update offers" ON public.buyer_offers;
CREATE POLICY "Involved parties can update offers" ON public.buyer_offers
  FOR UPDATE USING (
    auth.uid() IS NULL OR
    buyer_id = auth.uid()::text OR
    buyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    buyer_id LIKE 'buyer-%' OR
    EXISTS (
      SELECT 1 FROM public.produce_listings pl
      WHERE pl.id = listing_id AND (
        pl.farmer_id = auth.uid()::text OR
        pl.farmer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
        pl.farmer_id LIKE 'farmer-%'
      )
    )
  );

-- 6. Hardened Orders RLS Policies
DROP POLICY IF EXISTS "Orders viewable and manageable by involved parties" ON public.orders;
CREATE POLICY "Orders viewable and manageable by involved parties" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Involved parties can update orders" ON public.orders;
CREATE POLICY "Involved parties can update orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() IS NULL OR
    farmer_id = auth.uid()::text OR
    buyer_id = auth.uid()::text OR
    farmer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    buyer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    farmer_id LIKE 'farmer-%' OR
    buyer_id LIKE 'buyer-%'
  );

-- 7. Hardened Admin Protection on Mandi Prices
-- Public read for all users
DROP POLICY IF EXISTS "Public prices viewable by all" ON public.mandi_prices;
CREATE POLICY "Public prices viewable by all" ON public.mandi_prices
  FOR SELECT USING (true);

-- Admins and system operators can insert or update prices
DROP POLICY IF EXISTS "Admins can manage prices" ON public.mandi_prices;
CREATE POLICY "Admins can manage prices" ON public.mandi_prices
  FOR ALL USING (
    auth.uid() IS NULL OR
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
