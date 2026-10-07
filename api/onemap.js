import { Router } from 'express';

const router = Router();

// In-memory cache for OneMap token (valid for 3 days)
let cachedOneMapToken = {
  token: null,
  expiry: 0,
};

/**
 * Mint a token via OneMap API
 */
async function getOneMapToken(email, password) {
  const now = Date.now();
  if (cachedOneMapToken.token && cachedOneMapToken.expiry > now + 60000) {
    return cachedOneMapToken.token;
  }

  const tokenUrl = 'https://www.onemap.gov.sg/api/auth/post/getToken';
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OneMap token request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.access_token) {
    // Expires in approx 3 days (or default to 72 hours)
    const ttlSeconds = data.expiry_timestamp ? (new Date(data.expiry_timestamp).getTime() - now) / 1000 : 3 * 24 * 3600;
    cachedOneMapToken = {
      token: data.access_token,
      expiry: now + (ttlSeconds > 0 ? ttlSeconds * 1000 : 3 * 86400 * 1000),
    };
    return data.access_token;
  } else {
    throw new Error(`OneMap authentication failed: ${JSON.stringify(data)}`);
  }
}

/**
 * POST /api/onemap/token
 * Manually mints or refreshes a token with credentials
 */
router.post('/token', async (req, res) => {
  const email = req.body?.email || process.env.ONEMAP_EMAIL;
  const password = req.body?.password || process.env.ONEMAP_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing credentials. Provide email & password in request body or ONEMAP_EMAIL / ONEMAP_PASSWORD env variables.',
    });
  }

  try {
    const token = await getOneMapToken(email, password);
    res.json({
      status: 'Success',
      access_token: token,
      expiry_timestamp: new Date(cachedOneMapToken.expiry).toISOString(),
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

/**
 * GET /api/onemap/search
 * Geocode / Search address or landmark
 * URL: https://www.onemap.gov.sg/api/common/elastic/search?searchVal=...&returnGeom=Y&getAddrDetails=Y&pageNum=1
 */
router.get('/search', async (req, res) => {
  const searchVal = req.query.searchVal || req.query.q || 'raffles place';
  const returnGeom = req.query.returnGeom || 'Y';
  const getAddrDetails = req.query.getAddrDetails || 'Y';
  const pageNum = req.query.pageNum || '1';

  let token =
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    process.env.ONEMAP_TOKEN ||
    cachedOneMapToken.token;

  if (!token && req.body?.email && req.body?.password) {
    try {
      token = await getOneMapToken(req.body.email, req.body.password);
    } catch {
      // Continue to try if unauthenticated or return clear guidance
    }
  }

  const queryUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
  queryUrl.searchParams.set('searchVal', searchVal);
  queryUrl.searchParams.set('returnGeom', returnGeom);
  queryUrl.searchParams.set('getAddrDetails', getAddrDetails);
  queryUrl.searchParams.set('pageNum', pageNum);

  const headers = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  try {
    const response = await fetch(queryUrl.toString(), { headers });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

/**
 * GET /api/onemap/revgeocode
 * Reverse geocoding (coordinates to address)
 * URL: https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 */
router.get('/revgeocode', async (req, res) => {
  const location = req.query.location || '1.3,103.8';
  const buffer = req.query.buffer || '40';
  const addressType = req.query.addressType || 'All';

  let token =
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    process.env.ONEMAP_TOKEN ||
    cachedOneMapToken.token;

  if (!token) {
    return res.status(401).json({
      error: 'Token required for reverse geocoding. Provide Authorization header or set ONEMAP_TOKEN.',
    });
  }

  const url = `https://www.onemap.gov.sg/api/public/revgeocode?location=${encodeURIComponent(location)}&buffer=${buffer}&addressType=${addressType}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

/**
 * GET /api/onemap/route
 * Routing: walk | drive | cycle | pt
 * URL: https://www.onemap.gov.sg/api/public/routingsvc/route?start=...&end=...&routeType=walk
 */
router.get('/route', async (req, res) => {
  const start = req.query.start || '1.320981,103.844150';
  const end = req.query.end || '1.326762,103.8559';
  const routeType = req.query.routeType || 'walk'; // walk, drive, cycle, pt

  let token =
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    process.env.ONEMAP_TOKEN ||
    cachedOneMapToken.token;

  if (!token) {
    return res.status(401).json({
      error: 'Token required for OneMap routing service. Provide Authorization header or set ONEMAP_TOKEN.',
    });
  }

  const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
