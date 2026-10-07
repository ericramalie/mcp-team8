import { Router } from 'express';

const router = Router();

/**
 * Helper to ping an endpoint with timeout
 */
async function pingService(name, url, options = {}) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'EstatePulseSG-HealthCheck/1.0',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;

    return {
      service: name,
      ok: response.status < 500,
      status: response.status,
      latencyMs,
      message: response.status === 200 ? 'Operational' : `Responded with HTTP ${response.status}`,
    };
  } catch (err) {
    return {
      service: name,
      ok: false,
      status: 0,
      latencyMs: Date.now() - start,
      message: err.name === 'AbortError' ? 'Timeout (>4000ms)' : err.message,
    };
  }
}

/**
 * GET /api/health
 * Comprehensive monitoring endpoint for all integrated Singapore Government APIs
 */
router.get('/', async (req, res) => {
  const timestamp = new Date().toISOString();

  // Run live probes concurrently
  const [hdbCheck, realtimeWeatherCheck, realtimeCarparkCheck] = await Promise.all([
    // 1. Data.gov.sg HDB Resale
    pingService(
      'HDB Resale (Data.gov.sg)',
      'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=1'
    ),
    // 2. Real-Time SG Weather (api-open.data.gov.sg)
    pingService(
      'Real-Time SG Weather (v2)',
      'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast'
    ),
    // 3. Real-Time SG Carpark (api.data.gov.sg)
    pingService(
      'Real-Time SG Carpark (v1)',
      'https://api.data.gov.sg/v1/transport/carpark-availability'
    ),
  ]);

  // Auth & Key configuration statuses for key-gated APIs
  const uraStatus = {
    service: 'URA Space API',
    hasAccessKey: Boolean(process.env.URA_ACCESS_KEY),
    endpoint: 'https://eservice.ura.gov.sg/uraDataService',
    status: process.env.URA_ACCESS_KEY ? 'Configured' : 'Awaiting URA_ACCESS_KEY',
    message: process.env.URA_ACCESS_KEY
      ? 'Access key loaded, daily token rotation ready'
      : 'Provide URA_ACCESS_KEY or pass via AccessKey header for private transactions & URA carparks',
  };

  const onemapStatus = {
    service: 'OneMap SLA API',
    hasCredentials: Boolean(process.env.ONEMAP_TOKEN || (process.env.ONEMAP_EMAIL && process.env.ONEMAP_PASSWORD)),
    endpoint: 'https://www.onemap.gov.sg/api',
    status: (process.env.ONEMAP_TOKEN || process.env.ONEMAP_EMAIL) ? 'Configured' : 'Awaiting Token or Credentials',
    message: process.env.ONEMAP_TOKEN
      ? 'Bearer token configured'
      : process.env.ONEMAP_EMAIL
      ? 'Credentials configured for 3-day token minting'
      : 'Provide ONEMAP_TOKEN or Bearer token for routing & geocoding',
  };

  const masStatus = {
    service: 'MAS API Gateway',
    hasKeyId: Boolean(process.env.MAS_KEY_ID),
    endpoint: 'https://eservices.mas.gov.sg/apimg-gw',
    status: process.env.MAS_KEY_ID ? 'Configured' : 'Awaiting MAS_KEY_ID',
    message: process.env.MAS_KEY_ID
      ? 'KeyId loaded for daily exchange rates & SORA interest rates'
      : 'Provide MAS_KEY_ID or pass via KeyId header for exchange & SORA rates',
  };

  const liveChecks = [hdbCheck, realtimeWeatherCheck, realtimeCarparkCheck];
  const allLiveOk = liveChecks.every((c) => c.ok);

  const overallStatus = allLiveOk ? 'healthy' : 'degraded';

  res.status(allLiveOk ? 200 : 200).json({
    status: overallStatus,
    timestamp,
    system: 'EstatePulse SG API Gateway',
    version: '1.0.0',
    summary: {
      liveOpenApisHealthy: allLiveOk,
      totalServicesTracked: 6,
    },
    livePublicServices: {
      hdbResale: hdbCheck,
      realtimeWeather: realtimeWeatherCheck,
      realtimeCarpark: realtimeCarparkCheck,
    },
    authenticatedServices: {
      uraSpace: uraStatus,
      onemap: onemapStatus,
      masGateway: masStatus,
    },
  });
});

export default router;
