# MANDI MITRA AI (मंडी मित्र AI)
### *Smart Decisions. Better Farming.*

**Mandi Mitra AI** is a complete, production-grade agricultural intelligence and decision support platform engineered specifically for Indian farmers, farmer producer organizations (FPOs), traders/processors, and agricultural administrators.

It empowers agricultural producers to mathematically optimize **WHEN**, **WHERE**, and **HOW** to sell their harvest, guaranteeing maximum net cash realization after deducting transportation, loading, storage fees, commission cess, and biological spoilage losses.

---

## 🌟 Key Functional Highlights

1. **Sell Now vs. Wait AI Decision Engine:**
   - Evaluates spot APMC rates against multi-week probabilistic price forecasts.
   - Models physical weight loss & degradation for perishable commodities (Tomatoes: 1.8%/day) versus storable grains (Wheat: 0.02%/day, Soybean: 0.03%/day).
   - Computes transparent net return comparisons ($Net = Revenue - Transport - Storage - Spoilage - Cess$).

2. **Real-Time Agmarknet Feeds for Central India:**
   - Live arrivals and modal rates across key APMC Mandis: Indore (Chhawani), Ujjain, Dewas, Neemuch, Mandsaur, Sehore, Khandwa, Kota.
   - Real-time transport cost deduction based on farmer farm coordinates.

3. **Safe Escrow & Zero-Default Commerce:**
   - Buyers lock 100% funds into digital escrow prior to vehicle dispatch from the farm gate.
   - Automatic 5-stage milestone fulfillment with computerized weighbridge receipts.

4. **12 Indian Languages & Multilingual Voice Assistant:**
   - Supports English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Telugu (తెలుగు), Tamil (தமிழ்), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Malayalam (മലയാളം), Odia (ଓଡ଼ିଆ), and Nepali (नेपाली).
   - Voice intent recognition routes speech queries directly to price lookups, weather warnings, or sell/hold calculators.

5. **Instant Persona Simulator (4 Roles):**
   - **Farmer:** Crop listings, bid acceptance, storage calculator, transport booking, dispute filing.
   - **Buyer / Trader:** Lot discovery, bidding, truck dispatch, gate weighment pass generation.
   - **FPO Coordinator:** Member acreage pipeline, collective bulk pool auctions, shared haulage.
   - **Administrator:** APMC rate injection, escrow audit, dispute arbitration.

6. **Complete Audit & Export Tools:**
   - Instant 1-click **CSV Ledger Export** for accounting and income records.
   - Instant client-side **PDF Dossier Generation** for bank Kisan Credit Card (KCC) renewals.

---

## 🛠️ Technology Architecture

- **Frontend Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide React Icons, Framer Motion
- **Charting & Analytics:** Recharts (Area charts, Composed prediction bands)
- **Database & Persistence:** PostgreSQL / Supabase with Row Level Security (RLS) policies (`supabase/schema.sql`, `supabase/seed.sql`) + local storage cache adapter
- **AI & ML Integration:** Server-side API endpoints (`/api/ai/chat`, `/api/ai/predict`, `/api/ai/decision`), Gemini LLM connectivity + algorithmic fallback engine
- **Voice System:** Web Speech API (SpeechRecognition + SpeechSynthesis)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 2. Installation
```bash
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📁 Repository Directory Structure

```
mandi/
├── public/
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/chat/route.ts
│   │   │   ├── ai/predict/route.ts
│   │   │   ├── ai/decision/route.ts
│   │   │   ├── mandi-prices/route.ts
│   │   │   └── weather/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/AuthModals.tsx
│   │   ├── common/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   └── Sidebar.tsx
│   │   └── modules/
│   │       ├── AdminDashboard/AdminDashboardModule.tsx
│   │       ├── AIAssistant/AIAssistantModule.tsx
│   │       ├── BuyerOffers/BuyerOffersModule.tsx
│   │       ├── BuyerVerification/BuyerVerificationModule.tsx
│   │       ├── CropQuality/CropQualityModule.tsx
│   │       ├── Dashboard/FarmerDashboard.tsx
│   │       ├── FindBuyers/FindBuyersModule.tsx
│   │       ├── FPODashboard/FPODashboardModule.tsx
│   │       ├── InsightsHistory/InsightsHistoryModule.tsx
│   │       ├── ListProduce/ListProduceModule.tsx
│   │       ├── MarketPrices/MarketPriceModule.tsx
│   │       ├── MyCrops/MyCropsModule.tsx
│   │       ├── OfferComparison/OfferComparisonModule.tsx
│   │       ├── OrderTracking/OrderTrackingModule.tsx
│   │       ├── PaymentStatus/PaymentStatusModule.tsx
│   │       ├── PricePrediction/PricePredictionModule.tsx
│   │       ├── RatingsDisputes/RatingsDisputesModule.tsx
│   │       ├── SellNowVsWait/SellNowVsWaitModule.tsx
│   │       ├── SettingsProfile/SettingsProfileModule.tsx
│   │       ├── StorageSpoilage/StorageSpoilageModule.tsx
│   │       ├── TransportComparison/TransportComparisonModule.tsx
│   │       ├── VoiceAssistant/VoiceAssistantModal.tsx
│   │       └── WeatherAlerts/WeatherAlertsModule.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── MandiDataContext.tsx
│   │   └── VoiceContext.tsx
│   └── lib/
│       ├── calculations.ts
│       ├── mockData.ts
│       ├── storage.ts
│       ├── supabase.ts
│       ├── translations.ts
│       └── types.ts
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── TESTING_REPORT.md
```

---

## 🌾 Built for the Indian Farmer
*“सही निर्णय. समृद्ध किसान.” — MANDI MITRA AI*
