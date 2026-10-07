import { Router } from 'express';

const router = Router();

const ALLOWED_WEATHER_ENDPOINTS = [
  'two-hr-forecast',
  'twenty-four-hr-forecast',
  'four-day-outlook',
  'air-temperature',
  'rainfall',
  'psi',
  'pm25',
  'uv',
  'relative-humidity',
  'wind-speed',
];

/**
 * GET /api/realtime/weather/:endpoint
 * Or GET /api/realtime/weather?type=...
 * Proxies to https://api-open.data.gov.sg/v2/real-time/api/:endpoint
 */
router.get('/weather/:endpoint?', async (req, res) => {
  const endpoint = req.params.endpoint || req.query.type || 'two-hr-forecast';

  if (!ALLOWED_WEATHER_ENDPOINTS.includes(endpoint)) {
    return res.status(400).json({
      error: `Invalid endpoint "${endpoint}". Allowed: ${ALLOWED_WEATHER_ENDPOINTS.join(', ')}`,
    });
  }

  const url = `https://api-open.data.gov.sg/v2/real-time/api/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EstatePulseSG/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `api-open.data.gov.sg returned HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: `Failed to fetch weather data: ${err.message}`,
    });
  }
});

/**
 * GET /api/realtime/carpark-availability
 * Proxies to https://api.data.gov.sg/v1/transport/carpark-availability
 */
router.get('/carpark-availability', async (req, res) => {
  const date_time = req.query.date_time;
  const url = new URL('https://api.data.gov.sg/v1/transport/carpark-availability');
  if (date_time) url.searchParams.set('date_time', date_time);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'EstatePulseSG/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `api.data.gov.sg returned HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: `Failed to fetch carpark availability: ${err.message}`,
    });
  }
});

/**
 * GET /api/realtime/taxi-availability
 * Proxies to https://api.data.gov.sg/v1/transport/taxi-availability
 */
router.get('/taxi-availability', async (req, res) => {
  const date_time = req.query.date_time;
  const url = new URL('https://api.data.gov.sg/v1/transport/taxi-availability');
  if (date_time) url.searchParams.set('date_time', date_time);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'EstatePulseSG/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `api.data.gov.sg returned HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: `Failed to fetch taxi availability: ${err.message}`,
    });
  }
});

export default router;
