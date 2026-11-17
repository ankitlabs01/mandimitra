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
- **AI & ML Integration:** Server-side NVIDIA NIM / Nemotron Architecture (`src/lib/ai/nvidiaService.ts`), `/api/ai/chat`, `/api/ai/decision`, `/api/ai/predict`, with deterministic agricultural advisory fallback engine when API keys are absent.
- **Voice System:** Web Speech API (SpeechRecognition + SpeechSynthesis)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ or v20+
- npm v9+
- A Supabase Project (cloud or self-hosted)

### 2. Environment Configuration
Create a `.env.local` file (or duplicate `.env.example`):
```env
# Application Meta
NEXT_PUBLIC_APP_NAME="Mandi Mitra AI"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Official Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Server-Side Only Keys (Never expose to frontend)
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# NVIDIA NIM / Nemotron AI (Leave blank during development; fallback active)
NVIDIA_API_KEY=""
NVIDIA_NIM_ENDPOINT="https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"

# Weather API Key (Optional; Open-Meteo & IMD fallback active)
WEATHER_API_KEY=""
```

> **Note on In-App Setup:** You can also configure your Supabase URL & Key directly inside the running application by clicking the **"Supabase"** badge in the header or opening the Database tab in the User Profile modal.

### 3. Database Setup (Supabase SQL Editor)
Run the following SQL migration scripts located in the `/supabase` folder:
1. **`supabase/schema.sql`**: Creates all relational tables (`profiles`, `crops`, `mandis`, `mandi_prices`, `produce_listings`, `buyer_offers`, `orders`, `disputes`, `storage_facilities`, `storage_reservations`, `transport_options`, `transport_bookings`, `weather_alerts`, `fpo_members_crops`), triggers (`on_auth_user_created`), and base Row Level Security (RLS) policies.
2. **`supabase/seed.sql`**: Seeds reference data (Central India APMC mandis, commodities, historical prices, buyers, cold storages, transport options).
3. **`supabase/migrations/001_enhanced_security_and_rls.sql`**: Applies hardened owner-level RLS policies and unique constraints to prevent duplicate entries.

### 4. Installation
```bash
npm install
```

### 5. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Production Build & Deployment
```bash
npm run build
npm start
```
The application is preconfigured for zero-config deployment on **Vercel**. Simply import the GitHub repository and supply `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Vercel Project Settings under Environment Variables.

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
