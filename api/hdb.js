import { Router } from 'express';

const router = Router();
const HDB_RESALE_RESOURCE_ID = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';

/**
 * GET /api/hdb/resale
 * Queries HDB resale transactions with optional filters (town, flat_type, street_name, limit, offset, q)
 * Example: /api/hdb/resale?town=TAMPINES&flat_type=4%20ROOM&limit=10
 */
router.get('/resale', async (req, res) => {
  const limit = req.query.limit || '5';
  const offset = req.query.offset || '0';
  const q = req.query.q || '';
  const town = req.query.town;
  const flatType = req.query.flat_type;

  const url = new URL('https://data.gov.sg/api/action/datastore_search');
  url.searchParams.set('resource_id', HDB_RESALE_RESOURCE_ID);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);

  if (q) {
    url.searchParams.set('q', q);
  }

  // Construct filters
  let filtersObj = {};
  if (req.query.filters) {
    try {
      filtersObj = typeof req.query.filters === 'string' ? JSON.parse(req.query.filters) : req.query.filters;
    } catch {
      // ignore parse error
    }
  }

  if (town) filtersObj.town = town.toUpperCase();
  if (flatType) filtersObj.flat_type = flatType.toUpperCase();

  if (Object.keys(filtersObj).length > 0) {
    url.searchParams.set('filters', JSON.stringify(filtersObj));
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'EstatePulseSG/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Data.gov.sg returned HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      success: false,
      error: `Failed to fetch HDB transactions: ${err.message}`,
    });
  }
});

/**
 * GET /api/hdb/metadata
 * Fetches dataset metadata (field names, types, description)
 * URL: https://api-production.data.gov.sg/v2/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/metadata
 */
router.get('/metadata', async (req, res) => {
  const url = `https://api-production.data.gov.sg/v2/public/api/datasets/${HDB_RESALE_RESOURCE_ID}/metadata`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EstatePulseSG/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Metadata API returned HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      success: false,
      error: `Failed to fetch dataset metadata: ${err.message}`,
    });
  }
});

export default router;
