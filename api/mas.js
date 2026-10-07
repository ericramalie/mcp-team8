import { Router } from 'express';

const router = Router();

/**
 * GET /api/mas/exchange-rates
 * Daily SGD exchange rates (usd_sgd, eur_sgd, cny_sgd, gbp_sgd, etc.)
 * URL: https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily
 */
router.get('/exchange-rates', async (req, res) => {
  const keyId = req.headers['keyid'] || req.query.keyId || process.env.MAS_KEY_ID;
  const limit = req.query.limit || '10';
  const sort = req.query.sort || 'end_of_day desc';

  const url = new URL(
    'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily'
  );
  if (limit) url.searchParams.set('limit', limit);
  if (sort) url.searchParams.set('sort', sort);

  const headers = {
    'User-Agent': 'EstatePulseSG/1.0',
  };
  if (keyId) {
    headers['KeyId'] = keyId;
  }

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `MAS gateway returned HTTP ${response.status}: ${response.statusText}`,
        requiresKeyId: !keyId,
        message: 'Ensure KeyId header is provided or MAS_KEY_ID is configured in environment.',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: `Failed to fetch MAS exchange rates: ${err.message}`,
    });
  }
});

/**
 * GET /api/mas/interest-rates
 * Daily SORA + compounded 1M/3M/6M averages
 * URL: https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily
 */
router.get('/interest-rates', async (req, res) => {
  const keyId = req.headers['keyid'] || req.query.keyId || process.env.MAS_KEY_ID;
  const limit = req.query.limit || '10';
  const sort = req.query.sort || 'end_of_day desc';

  const url = new URL(
    'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily'
  );
  if (limit) url.searchParams.set('limit', limit);
  if (sort) url.searchParams.set('sort', sort);

  const headers = {
    'User-Agent': 'EstatePulseSG/1.0',
  };
  if (keyId) {
    headers['KeyId'] = keyId;
  }

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `MAS gateway returned HTTP ${response.status}: ${response.statusText}`,
        requiresKeyId: !keyId,
        message: 'Ensure KeyId header is provided or MAS_KEY_ID is configured in environment.',
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: `Failed to fetch MAS SORA interest rates: ${err.message}`,
    });
  }
});

export default router;
