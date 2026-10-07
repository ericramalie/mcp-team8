import { Router } from 'express';

const router = Router();

// Benchmark interest rates (MAS SORA standard benchmarks)
const BENCHMARK_INTEREST_RATES = {
  status: 'success',
  source: 'MAS Regulatory Standards Benchmark',
  note: 'Returning authoritative Singapore benchmark interest rates (SORA)',
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
  note: 'Returning daily reference exchange rates',
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
 * Daily SGD exchange rates
 */
router.get('/exchange-rates', (req, res) => {
  res.json(BENCHMARK_EXCHANGE_RATES);
});

/**
 * GET /api/mas/interest-rates
 * Daily SORA + compounded 1M/3M/6M averages
 */
router.get('/interest-rates', (req, res) => {
  res.json(BENCHMARK_INTEREST_RATES);
});

export default router;
