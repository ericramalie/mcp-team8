import { Router } from 'express';

const router = Router();

// In-memory token cache for today's URA token
let cachedTokenData = {
  token: null,
  date: null,
};

/**
 * Helper to obtain today's URA Token by trading the AccessKey
 */
async function getUraDailyToken(accessKey) {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (cachedTokenData.token && cachedTokenData.date === todayStr) {
    return cachedTokenData.token;
  }

  const tokenUrl = 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1';
  const response = await fetch(tokenUrl, {
    method: 'GET',
    headers: {
      AccessKey: accessKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`URA token trading failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.Status === 'Success' && data.Result) {
    cachedTokenData = {
      token: data.Result,
      date: todayStr,
    };
    return data.Result;
  } else {
    throw new Error(`URA returned error status: ${JSON.stringify(data)}`);
  }
}

/**
 * GET /api/ura/token
 * Returns today's active token or trading status
 */
router.get('/token', async (req, res) => {
  const accessKey = req.headers['accesskey'] || req.query.accessKey || process.env.URA_ACCESS_KEY;
  if (!accessKey) {
    return res.status(400).json({
      error: 'Missing AccessKey. Provide via header "AccessKey", query param "?accessKey=", or URA_ACCESS_KEY env variable.',
      configuredInEnv: Boolean(process.env.URA_ACCESS_KEY),
    });
  }

  try {
    const token = await getUraDailyToken(accessKey);
    res.json({
      status: 'Success',
      token,
      date: cachedTokenData.date,
      message: 'Token active for today',
    });
  } catch (err) {
    res.status(502).json({
      status: 'Error',
      error: err.message,
    });
  }
});

/**
 * GET /api/ura/transactions
 * Fetches private residential transactions (PMI_Resi_Transaction).
 * Supports ?batch=1..4 or ?merge=true (fetches all 4 batches and merges results)
 */
router.get('/transactions', async (req, res) => {
  const accessKey = req.headers['accesskey'] || req.query.accessKey || process.env.URA_ACCESS_KEY;
  const shouldMerge = req.query.merge === 'true' || req.query.all === 'true';
  const requestedBatch = req.query.batch || '1';

  if (!accessKey) {
    return res.status(400).json({
      error: 'Missing AccessKey. Provide via header "AccessKey" or URA_ACCESS_KEY env variable.',
      sampleUrl: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1',
      fallbackDataAvailable: true,
    });
  }

  try {
    const token = await getUraDailyToken(accessKey);

    if (shouldMerge) {
      // Fetch all 4 batches by postal district and merge
      const batches = [1, 2, 3, 4];
      const fetchPromises = batches.map(async (b) => {
        const url = `https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=${b}`;
        const response = await fetch(url, {
          headers: {
            AccessKey: accessKey,
            Token: token,
          },
        });
        if (!response.ok) return { batch: b, error: response.statusText, Result: [] };
        const data = await response.json();
        return { batch: b, Result: data.Result || [] };
      });

      const results = await Promise.all(fetchPromises);
      const mergedResult = results.flatMap((r) => r.Result);

      return res.json({
        Status: 'Success',
        totalBatches: 4,
        totalRecords: mergedResult.length,
        Result: mergedResult,
      });
    }

    // Single batch
    const url = `https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=${requestedBatch}`;
    const response = await fetch(url, {
      headers: {
        AccessKey: accessKey,
        Token: token,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      Status: 'Error',
      error: err.message,
    });
  }
});

/**
 * GET /api/ura/carparks
 * Fetches live carpark lots (Car_Park_Availability)
 */
router.get('/carparks', async (req, res) => {
  const accessKey = req.headers['accesskey'] || req.query.accessKey || process.env.URA_ACCESS_KEY;
  if (!accessKey) {
    return res.status(400).json({
      error: 'Missing AccessKey. Provide via header "AccessKey" or URA_ACCESS_KEY env variable.',
    });
  }

  try {
    const token = await getUraDailyToken(accessKey);
    const url = 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Availability';
    const response = await fetch(url, {
      headers: {
        AccessKey: accessKey,
        Token: token,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

/**
 * GET /api/ura/carpark-details
 * Fetches carpark rates and details (Car_Park_Details)
 */
router.get('/carpark-details', async (req, res) => {
  const accessKey = req.headers['accesskey'] || req.query.accessKey || process.env.URA_ACCESS_KEY;
  if (!accessKey) {
    return res.status(400).json({
      error: 'Missing AccessKey. Provide via header "AccessKey" or URA_ACCESS_KEY env variable.',
    });
  }

  try {
    const token = await getUraDailyToken(accessKey);
    const url = 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details';
    const response = await fetch(url, {
      headers: {
        AccessKey: accessKey,
        Token: token,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
