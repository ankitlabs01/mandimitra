-- ==============================================================================
-- MANDI MITRA AI: Comprehensive Seed Data for Central India Mandi Network
-- ==============================================================================

-- 1. CROPS & COMMODITIES
INSERT INTO public.crops (id, name, hindi_name, category, shelf_life_days, perishability_index, daily_weight_loss_rate, standard_moisture_percent, base_storage_cost_per_quintal_per_month, typical_transport_cost_per_km_per_quintal)
VALUES
('crop-soybean', 'Soybean (JS-9560)', 'सोयाबीन', 'Oilseed', 240, 'Low', 0.0003, 10.0, 22.0, 2.2),
('crop-wheat', 'Sharbati Wheat (C-306)', 'शरबती गेहूँ', 'Cereal', 365, 'Low', 0.0002, 11.0, 18.0, 2.0),
('crop-chana', 'Desi Chana (Gram)', 'चना (देशी)', 'Pulse', 300, 'Low', 0.00025, 10.0, 20.0, 2.1),
('crop-onion', 'Nasik Red Onion', 'लाल प्याज', 'Vegetable', 60, 'Medium', 0.006, 14.0, 38.0, 2.6),
('crop-tomato', 'Hybrid Tomato (Abhinav)', 'टमाटर (संकर)', 'Vegetable', 14, 'High', 0.018, 92.0, 95.0, 3.2),
('crop-cotton', 'BT Cotton (Medium Staple)', 'कपास (कॉटन)', 'Cash Crop', 360, 'Low', 0.0001, 8.0, 25.0, 2.4),
('crop-garlic', 'Garlic (Amleta Special)', 'लहसुन (अमलेटा)', 'Spice', 150, 'Medium', 0.002, 12.0, 45.0, 2.5),
('crop-mustard', 'Mustard (Pusa Bold)', 'सरसों / राई', 'Oilseed', 270, 'Low', 0.00025, 8.0, 22.0, 2.1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hindi_name = EXCLUDED.hindi_name,
  shelf_life_days = EXCLUDED.shelf_life_days;

-- 2. APMC MANDIS
INSERT INTO public.mandis (id, name, district, state, distance_km, contact_number, operating_hours, daily_arrivals_quintals, trade_volume_quintals)
VALUES
('mandi-indore', 'Indore APMC (Chhawani)', 'Indore', 'Madhya Pradesh', 18.0, '+91 731 2401822', '06:00 - 18:00', 18500, 17200),
('mandi-ujjain', 'Ujjain Krishi Upaj Mandi', 'Ujjain', 'Madhya Pradesh', 62.0, '+91 734 2514210', '06:00 - 19:00', 24200, 23100),
('mandi-dewas', 'Dewas Mandi Samiti', 'Dewas', 'Madhya Pradesh', 44.0, '+91 7272 254190', '07:00 - 17:30', 9800, 9100),
('mandi-neemuch', 'Neemuch Grain & Spice Mandi', 'Neemuch', 'Madhya Pradesh', 215.0, '+91 7423 220045', '06:00 - 20:00', 31000, 29500),
('mandi-mandsaur', 'Mandsaur Garlic & Grain Mandi', 'Mandsaur', 'Madhya Pradesh', 188.0, '+91 7422 245112', '06:30 - 19:30', 28000, 27000),
('mandi-sehore', 'Sehore Krishi Mandi', 'Sehore', 'Madhya Pradesh', 148.0, '+91 7562 222380', '07:00 - 18:00', 12400, 11800),
('mandi-khandwa', 'Khandwa Cotton & Grain Mandi', 'Khandwa', 'Madhya Pradesh', 132.0, '+91 7332 224411', '06:00 - 18:30', 14100, 13500),
('mandi-kota', 'Kota Bhamashah Krishi Mandi', 'Kota', 'Rajasthan', 248.0, '+91 744 2465320', '05:30 - 20:00', 38000, 36200)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  distance_km = EXCLUDED.distance_km;

-- 3. LIVE MANDI PRICES
INSERT INTO public.mandi_prices (id, mandi_id, mandi_name, crop_id, crop_name, variety, min_price, max_price, modal_price, arrival_tons, price_change_percent, date)
VALUES
('pr-1', 'mandi-indore', 'Indore APMC', 'crop-soybean', 'Soybean (JS-9560)', 'Yellow Machine Clean', 4720, 5180, 4980, 1240, 2.1, CURRENT_DATE),
('pr-2', 'mandi-ujjain', 'Ujjain Mandi', 'crop-soybean', 'Soybean (JS-9560)', 'Yellow Regular', 4680, 5220, 5040, 1680, 3.4, CURRENT_DATE),
('pr-3', 'mandi-dewas', 'Dewas Mandi', 'crop-soybean', 'Soybean (JS-9560)', 'Yellow Machine Clean', 4650, 5090, 4920, 740, -0.8, CURRENT_DATE),
('pr-4', 'mandi-sehore', 'Sehore Mandi', 'crop-wheat', 'Sharbati Wheat (C-306)', 'Lokwan Grade-A', 2850, 3420, 3260, 920, 1.5, CURRENT_DATE),
('pr-5', 'mandi-indore', 'Indore APMC', 'crop-wheat', 'Sharbati Wheat (C-306)', 'Sharbati Premium', 3100, 3680, 3480, 1100, 2.8, CURRENT_DATE),
('pr-6', 'mandi-ujjain', 'Ujjain Mandi', 'crop-chana', 'Desi Chana (Gram)', 'Desi Bold', 5750, 6280, 6120, 860, -1.2, CURRENT_DATE),
('pr-7', 'mandi-indore', 'Indore APMC', 'crop-chana', 'Desi Chana (Gram)', 'Desi Clean', 5800, 6310, 6180, 790, 0.6, CURRENT_DATE),
('pr-8', 'mandi-indore', 'Indore APMC', 'crop-onion', 'Nasik Red Onion', 'Medium Red', 1650, 2350, 2150, 1950, -4.5, CURRENT_DATE),
('pr-9', 'mandi-indore', 'Indore APMC', 'crop-tomato', 'Hybrid Tomato (Abhinav)', 'Hybrid Firm Red', 1200, 1850, 1550, 680, 6.2, CURRENT_DATE),
('pr-10', 'mandi-mandsaur', 'Mandsaur Mandi', 'crop-garlic', 'Garlic (Amleta Special)', 'Special Box Quality', 13200, 18400, 16200, 540, 4.8, CURRENT_DATE),
('pr-11', 'mandi-neemuch', 'Neemuch Mandi', 'crop-garlic', 'Garlic (Amleta Special)', 'G2 Medium Extra', 12800, 17900, 15800, 710, 3.9, CURRENT_DATE),
('pr-12', 'mandi-khandwa', 'Khandwa Mandi', 'crop-cotton', 'BT Cotton (Medium Staple)', 'Medium Staple Clean', 6700, 7450, 7220, 1420, 1.1, CURRENT_DATE),
('pr-13', 'mandi-kota', 'Kota Mandi', 'crop-mustard', 'Mustard (Pusa Bold)', 'Oil 42% Guaranteed', 5350, 5890, 5740, 2100, 2.3, CURRENT_DATE)
ON CONFLICT (id) DO UPDATE SET
  modal_price = EXCLUDED.modal_price,
  price_change_percent = EXCLUDED.price_change_percent;

-- 4. STORAGE FACILITIES
INSERT INTO public.storage_facilities (id, name, type, location, distance_km, capacity_quintals, available_capacity_quintals, rate_per_quintal_per_month, climate_controlled, insurance_covered, rating, phone)
VALUES
('stor-1', 'Indore Central Warehousing Corporation (CWC)', 'Dry Warehouse', 'Laxmibai Nagar, Indore', 14.0, 80000, 16500, 20.0, false, true, 4.7, '+91 731 2419080'),
('stor-2', 'Malwa Agro Mega Cold Storage & Ripening Unit', 'Cold Storage', 'Sanwer Road Industrial Area, Indore', 26.0, 35000, 8200, 85.0, true, true, 4.8, '+91 731 2801455'),
('stor-3', 'Dewas Kisan Modern Silos & Drying Yard', 'Silo', 'Dewas Bypass Highway', 42.0, 60000, 21000, 24.0, true, true, 4.6, '+91 7272 268901'),
('stor-4', 'On-Farm Aerated Grain Bin (Village Collective)', 'On-Farm Covered Shed', 'Datoda Village Society Shed', 1.5, 4000, 1200, 12.0, false, false, 4.1, '+91 98261 44520')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rate_per_quintal_per_month = EXCLUDED.rate_per_quintal_per_month;

-- 5. TRANSPORT FLEET
INSERT INTO public.transport_options (id, provider_name, vehicle_type, capacity_quintals, base_charge, rate_per_km, handling_charge_per_quintal, available_in_hours, rating, contact_number)
VALUES
('trans-1', 'Kisan Gaddi Rural Logistics', 'Pickup (1.5T)', 15, 500.0, 22.0, 20.0, 2, 4.8, '+91 98265 11092'),
('trans-2', 'Shree Ram Malwa Transport', 'Small Truck (4T)', 40, 1200.0, 34.0, 25.0, 4, 4.7, '+91 94250 88201'),
('trans-3', 'Central Freight Carriers APMC Fleet', 'Heavy 6-Wheel (10T)', 100, 2200.0, 48.0, 22.0, 6, 4.9, '+91 731 4059910'),
('trans-4', 'Patidar Brothers Trolley Network', 'Tractor Trolley (3T)', 30, 400.0, 20.0, 15.0, 1, 4.5, '+91 98930 44102')
ON CONFLICT (id) DO UPDATE SET
  provider_name = EXCLUDED.provider_name,
  rate_per_km = EXCLUDED.rate_per_km;

-- 6. WEATHER ALERTS
INSERT INTO public.weather_alerts (id, date, forecast_day, condition, temp_min, temp_max, humidity_percent, rainfall_mm, wind_speed_kmh, impact_on_harvest, advisory_note, alert_level)
VALUES
('w-1', CURRENT_DATE, 'Today', 'Sunny', 16.0, 31.0, 44, 0.0, 9.0, 'Ideal conditions for threshing and open solar drying of grains.', 'Moisture reduction rate will be optimal. Recommended time for bagging grain before evening dew.', 'low'),
('w-2', CURRENT_DATE + INTERVAL '3 days', 'Wednesday', 'Light Rain', 18.0, 27.0, 78, 12.0, 24.0, 'Risk of moisture spike on open yard produce. Potential delays at Mandi gates.', 'Western disturbance approaching Malwa plateau. Cover stored lots with waterproof tarpaulins or shift to warehouse before Tuesday dusk.', 'moderate'),
('w-3', CURRENT_DATE + INTERVAL '4 days', 'Thursday', 'Hail Risk', 15.0, 24.0, 85, 28.0, 38.0, 'Severe risk to unharvested standing crops and open farm drying.', 'Accelerate soybean & cotton harvest immediately. Mandi trading likely disrupted due to wet yard conditions.', 'severe')
ON CONFLICT (id) DO UPDATE SET
  condition = EXCLUDED.condition,
  advisory_note = EXCLUDED.advisory_note;

-- 7. FPO SUPPLY PIPELINE
INSERT INTO public.fpo_members_crops (member_id, member_name, village, phone, crop_name, acreage, expected_yield_quintals, harvest_window_start, harvest_window_end)
VALUES
('m-101', 'Babulal Solanki', 'Datoda', '+91 98260 11200', 'Soybean (JS-9560)', 6.0, 48.0, '2026-10-20', '2026-11-05'),
('m-102', 'Dinesh Dhangar', 'Datoda', '+91 97520 44910', 'Soybean (JS-9560)', 8.5, 72.0, '2026-10-22', '2026-11-08'),
('m-103', 'Jagdish Mukati', 'Rau', '+91 94240 55190', 'Sharbati Wheat (C-306)', 11.0, 165.0, '2027-03-25', '2027-04-15'),
('m-104', 'Kanhaiyalal Yadav', 'Kshipra', '+91 98930 22310', 'Garlic (Amleta Special)', 4.0, 36.0, '2027-03-15', '2027-04-05'),
('m-105', 'Govind Choudhary', 'Sanwer', '+91 98263 77410', 'Desi Chana (Gram)', 9.0, 68.0, '2027-03-20', '2027-04-10')
ON CONFLICT (member_id) DO UPDATE SET
  member_name = EXCLUDED.member_name,
  expected_yield_quintals = EXCLUDED.expected_yield_quintals;

-- 8. INITIAL PRODUCE LISTINGS
INSERT INTO public.produce_listings (id, farmer_id, farmer_name, farmer_phone, location, crop_id, crop_name, variety, quantity_quintals, expected_price_per_quintal, harvest_date, available_from_date, expiry_or_storage_limit_days, grade, moisture_percent, photos, status, offers_count)
VALUES
('list-001', 'farmer-ramesh-01', 'Rameshwar Patidar', '+91 98261 44520', 'Datoda, Indore (MP)', 'crop-soybean', 'Soybean (JS-9560)', 'Machine Clean Certified Seed Line', 85.0, 5150.0, '2026-10-24', '2026-11-10', 180, 'A', 9.8, ARRAY['/images/soybean-clean.jpg'], 'active', 3),
('list-002', 'farmer-ramesh-01', 'Rameshwar Patidar', '+91 98261 44520', 'Datoda, Indore (MP)', 'crop-wheat', 'Sharbati Wheat (C-306)', 'Double Filtered Lustrous Grain', 140.0, 3550.0, '2026-04-12', '2026-11-01', 240, 'A', 10.2, ARRAY['/images/wheat-golden.jpg'], 'active', 2),
('list-003', 'farmer-ramesh-01', 'Rameshwar Patidar', '+91 98261 44520', 'Datoda, Indore (MP)', 'crop-garlic', 'Garlic (Amleta Special)', 'Full Cured Large Clove White', 35.0, 16800.0, '2026-03-28', '2026-11-12', 90, 'A', 11.5, ARRAY['/images/garlic-amleta.jpg'], 'active', 4)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  expected_price_per_quintal = EXCLUDED.expected_price_per_quintal;

-- 9. INITIAL BUYER OFFERS
INSERT INTO public.buyer_offers (id, listing_id, crop_name, quantity_quintals, buyer_id, buyer_name, buyer_business_name, buyer_category, buyer_rating, buyer_verified, offered_price_per_quintal, payment_terms, transport_provided_by_buyer, transport_allowance_per_quintal, delivery_mandi_or_location, distance_km, status, notes, valid_until)
VALUES
('off-101', 'list-001', 'Soybean (JS-9560)', 85.0, 'buyer-malwa-agro', 'Vijay Singhania', 'Malwa Agro Oils & Solvent Ltd', 'Oil Mill & Solvent Processor', 4.8, true, 5120.0, 'same_day_rtgs', true, 0.0, 'Pithampur Industrial Area Plant', 28.0, 'pending', 'Free pickup by our 10-wheel truck from your farm gate in Datoda. Digital weighbridge at gate.', NOW() + INTERVAL '3 days'),
('off-102', 'list-001', 'Soybean (JS-9560)', 85.0, 'buyer-kailash-traders', 'Kailash Chand Mittal', 'Kailash Traders APMC Indore', 'Registered Commission Agent / Wholesaler', 4.5, true, 5080.0, 'immediate_upi', false, 40.0, 'Indore APMC Yard Shop #44', 18.0, 'pending', 'Spot UPI settlement upon moisture confirmation under 10%. ₹40/qtl transport reimbursement added.', NOW() + INTERVAL '2 days'),
('off-103', 'list-003', 'Garlic (Amleta Special)', 35.0, 'buyer-surat-exports', 'Harshvardhan Parekh', 'Gujarat Agro Exporters Surat', 'Spice Exporter', 4.9, true, 16750.0, 'escrow', true, 0.0, 'Direct Export Hub Dewas', 42.0, 'pending', 'Escrow backed payment. Funds deposited in Mandi Mitra Safe Escrow prior to dispatch.', NOW() + INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  offered_price_per_quintal = EXCLUDED.offered_price_per_quintal;

-- 10. INITIAL ORDERS
INSERT INTO public.orders (id, listing_id, buyer_offer_id, farmer_id, farmer_name, buyer_id, buyer_name, crop_name, quantity_quintals, agreed_price_per_quintal, total_amount, payment_terms, status, payment_status, dispatch_date, transport_vehicle_number, driver_phone, current_milestone)
VALUES
('ord-8801', 'list-001', 'off-101', 'farmer-ramesh-01', 'Rameshwar Patidar', 'buyer-malwa-agro', 'Vijay Singhania (Malwa Agro)', 'Soybean (JS-9560)', 60.0, 4950.0, 297000.0, 'same_day_rtgs', 'in_transit', 'in_escrow', NOW() - INTERVAL '1 day', 'MP-09-GH-8219', '+91 97552 19280', 3),
('ord-8802', 'list-002', 'off-102', 'farmer-ramesh-01', 'Rameshwar Patidar', 'buyer-kailash-traders', 'Kailash Chand Mittal', 'Desi Chana (Gram)', 45.0, 6050.0, 272250.0, 'immediate_upi', 'completed', 'paid_to_farmer', NOW() - INTERVAL '7 days', 'MP-09-BC-4112', '+91 98270 33190', 5)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  current_milestone = EXCLUDED.current_milestone;
