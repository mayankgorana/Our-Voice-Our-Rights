import dotenv from 'dotenv';
dotenv.config(); // ensure environment variables load before usage

import { getDataGovRecords } from '../services/dataGovService.js';

// Simple in-memory cache (replace with Redis for production)
const cache = new Map();

export async function fetchMgnregaFor(req, res) {
  try {
    const {
      state_name = '',
      fin_year = '',
      limit = 1000,
      sort_field = 'district_name',
      sort_order = 'asc', 
    } = req.query;

    if (!state_name)
      return res.status(400).json({ message: 'state_name is required' });

    const cacheKey = `${state_name}__${fin_year}__${limit}`;
    const now = Date.now();
    const ttl = parseInt(process.env.CACHE_TTL_SECONDS || '86400', 10) * 1000;

    // ✅ 1️⃣ Check cache first
    if (cache.has(cacheKey)) {
      const { ts, data } = cache.get(cacheKey);
      if (now - ts < ttl) {
        const sorted = sortRecords(data.records || [], sort_field, sort_order);
        console.log(`💾 Served from cache for ${state_name} ${fin_year}`);
        return res.json({ source: 'cache', records: sorted });
      }
    }

    // ✅ 2️⃣ Fetch from API
    console.log(`🌐 Fetching fresh data for ${state_name} ${fin_year}...`);
    const data = await getDataGovRecords({ state_name, fin_year, limit });

    if (!data || !data.records) {
      console.error('⚠️ Invalid data format received from data.gov.in');
      return res.status(502).json({ message: 'Invalid API response format' });
    }

    const sorted = sortRecords(data.records, sort_field, sort_order);

    // ✅ 3️⃣ Save to cache
    cache.set(cacheKey, { ts: now, data });

    return res.json({ source: 'api', records: sorted });
  } catch (err) {
    console.error('❌ Error fetching data:', err.message || err);

    // fallback to stale cache
    if (cache.has(cacheKey)) {
      const { data } = cache.get(cacheKey);
      const sorted = sortRecords(data.records || [], sort_field, sort_order);
      console.warn('⚠️ Using stale cached data');
      return res.json({ source: 'cache-stale', records: sorted });
    }

    return res.status(500).json({ message: 'Failed to fetch data' });
  }
}

// Sorting helper
function sortRecords(records, field, order) {
  const safeField = field || 'district_name';
  const dir = order === 'desc' ? -1 : 1;

  return records.slice().sort((a, b) => {
    const A = (a[safeField] || '').toString().toUpperCase();
    const B = (b[safeField] || '').toString().toUpperCase();
    return A < B ? -1 * dir : A > B ? 1 * dir : 0;
  });
}
