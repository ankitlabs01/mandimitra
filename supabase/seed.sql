-- MANDI MITRA AI: Initial Seed Data for Central India Mandis & Commodities

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
ON CONFLICT (id) DO NOTHING;

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
ON CONFLICT (id) DO NOTHING;
