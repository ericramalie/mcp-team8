# Project Prompts & Instructions Log

This document records all user prompts submitted during the development of the Singapore Real Estate Intelligence Portal (**EstatePulse SG**).

---

### Prompt 1: Initial Business Model Canvas Specification
*(Provided via Business Model Canvas diagram)*
- **Core Product**: Singapore Real Estate Intelligence platform synthesizing official data.
- **Key Partners & Data Sources**:
  - **URA Space**: Master plan zones, private caveat transactions, median PSF benchmarks.
  - **OneMap SLA**: Geospatial distances, Primary Schools within 1km/2km, MRT stations.
  - **Datasets (HDB Resale txn)**: HDB resale transactions, remaining lease countdown, price index.
  - **Real-time SG**: Live carpark lot availability.
  - **MAS**: True total cost and affordability calculator (TDSR 55%, MSR 30%, LTV limits, BSD/ABSD).
- **Customer Segments**: Family Mode (schools & 3-5 beds), Young Professionals Mode (CBD & <500m MRT access).
- **Key Categories**: Private New Launch, Latest BTO Exercise (Standard, Plus, Prime), Condo Resale, HDB Resale Flats, Landed Homes.
- **Revenue Model**: Monthly or yearly membership.
- **Channels**: Once a week mailer digest.

---

### Prompt 2: Development Continuation
```text
Continue
```

---

### Prompt 3: Git Repository Setup & Push
```text
git push https://<GITHUB_TOKEN>@github.com/ericramalie/mcp-team8.git
```

---

### Prompt 4: Backend API Architecture & Government Services Integration
```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate URA Space # 1. Each day, trade the AccessKey for today's Token:
#    (header: AccessKey: )
https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1

# 2. Data calls send BOTH headers (AccessKey + Token):
# Private residential transactions (4 batches by postal district - fetch all, merge):
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1

# Live carpark lots + rates:
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Availability
https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details
4) integrate Onemap # Mint a token (POST, JSON body {"email":"...","password":"..."}; lasts 3 days):
https://www.onemap.gov.sg/api/auth/post/getToken

# Geocode / search (Authorization header now officially required):
https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1

# Reverse geocode (token required):
https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All

# Routing: walk | drive | cycle | pt (token required):
https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk
5) integrate # First 5 resale transactions (dataset: HDB resale prices, Jan 2017 onwards):
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5

# Filtered: 4-room flats in Tampines
# (filters is URL-encoded {"town":"TAMPINES","flat_type":"4 ROOM"})
https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5&filters=%7B%22town%22%3A%22TAMPINES%22%2C%22flat_type%22%3A%224%20ROOM%22%7D

# Dataset metadata (field names and types):
https://api-production.data.gov.sg/v2/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/metadata
6) integrate Real Time SG # Weather & environment (v2 host, wrapped responses) - all keyless, all live:
https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast
https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook
https://api-open.data.gov.sg/v2/real-time/api/air-temperature
https://api-open.data.gov.sg/v2/real-time/api/rainfall
https://api-open.data.gov.sg/v2/real-time/api/psi
https://api-open.data.gov.sg/v2/real-time/api/pm25
https://api-open.data.gov.sg/v2/real-time/api/uv
https://api-open.data.gov.sg/v2/real-time/api/relative-humidity
https://api-open.data.gov.sg/v2/real-time/api/wind-speed

# Carparks & taxis (v1 host ONLY - never migrated to v2, bare responses):
https://api.data.gov.sg/v1/transport/carpark-availability
https://api.data.gov.sg/v1/transport/taxi-availability
7) integrate MAS # Daily SGD exchange rates, end of period (usd_sgd, eur_sgd, ...):
https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily

# Daily SORA + compounded 1M/3M/6M averages:
https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily

# All requests need the header:  KeyId:
```

---

### Prompt 5: Environment Variables Optimization
```text
remove ONEMAP_EMAIL and add API name in .env.example with Datasets and Realtime_SG
```

---

### Prompt 6: Vercel Configuration & MAS Key Bypass
```text
ignore MAS_KEY_ID we have updated URA_ACCESS_KEY and ONEMAP_PASSWORD in vercel
```

---

### Prompt 7: Health Endpoint Validation
```text
please check if i type api/health is it working
```

---

### Prompt 8: Environment Key Minimization
```text
please only use this key URA_ACCESS_KEY and ONEMAP_PASSWORD then remove the rest
```

---

### Prompt 9: Property Listing Imagery Refresh
```text
refresh the images on the property listing from https://www.propertyguru.com.sg/
```

---

### Prompt 10: Prompt Documentation
```text
create a prompt.md containing all my prompt located at project main
```
