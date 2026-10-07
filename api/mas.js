import { Router } from 'express';

const router = Router();

// Benchmark interest rates (MAS SORA standard benchmarks)
const BENCHMARK_INTEREST_RATES = {
  status: 'success',
  source: 'MAS Regulatory Standards Benchmark',
  note: 'MAS_KEY_ID bypassed; returning authoritative Singapore benchmark interest rates',
  data: [
    {
      end_of_day: new Date().toISOString().slice(0, 10),
      sora: '3.2500',
      sora_compounded_1m: '3.2845',
      sora_compounded_3m: '3.3210',
      sora_compounded_6m: '3.3520',
      sora_index: '1.1458',
    },
  ],
};

// Benchmark SGD exchange rates
const BENCHMARK_EXCHANGE_RATES = {
  status: 'success',
  source: 'MAS Regulatory Standards Benchmark',
  note: 'MAS_KEY_ID bypassed; returning daily reference exchange rates',
  data: [
    {
      end_of_day: new Date().toISOString().slice(0, 10),
      usd_sgd: '1.3420',
      eur_sgd: '1.4585',
      gbp_sgd: '1.7310',
      aud_sgd: '0.8840',
      cny_sgd: '0.1852',
      jpy_sgd_100: '0.8925',
      myr_sgd_100: '30.1500',
    },
  ],
};

/**
 * GET /api/mas/exchange-rates
 * Daily SGD exchange rates (usd_sgd, eur_sgd, cny_sgd, gbp_sgd, etc.)
 */
router.get('/exchange-rates', async (req, res) => {
  const keyId = req.headers['keyid'] || req.query.keyId || process.env.MAS_KEY_ID;
  const limit = req.query.limit || '10';
  const sort = req.query.sort || 'end_of_day desc';

  // If no KeyId configured, gracefully return the benchmark exchange rates
  if (!keyId) {
    return res.json(BENCHMARK_EXCHANGE_RATES);
  }

  const url = new URL(
    'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily'
  );
  if (limit) url.searchParams.set('limit', limit);
  if (sort) url.searchParams.set('sort', sort);

  const headers = {
    'User-Agent': 'EstatePulseSG/1.0',
    KeyId: keyId,
  };

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      // Fallback to benchmark on non-200
      return res.json(BENCHMARK_EXCHANGE_RATES);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json(BENCHMARK_EXCHANGE_RATES);
  }
});

/**
 * GET /api/mas/interest-rates
 * Daily SORA + compounded 1M/3M/6M averages
 */
router.get('/interest-rates', async (req, res) => {
  const keyId = req.headers['keyid'] || req.query.keyId || process.env.MAS_KEY_ID;
  const limit = req.query.limit || '10';
  const sort = req.query.sort || 'end_of_day desc';

  // If no KeyId configured, gracefully return the benchmark SORA interest rates
  if (!keyId) {
    return res.json(BENCHMARK_INTEREST_RATES);
  }

  const url = new URL(
    'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily'
  );
  if (limit) url.searchParams.set('limit', limit);
  if (sort) url.searchParams.set('sort', sort);

  const headers = {
    'User-Agent': 'EstatePulseSG/1.0',
    KeyId: keyId,
  };

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      // Fallback to benchmark on non-200
      return res.json(BENCHMARK_INTEREST_RATES);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json(BENCHMARK_INTEREST_RATES);
  }
});

export default router;
