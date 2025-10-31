import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722';
const API_KEY = process.env.DATA_GOV_API_KEY;

export async function getDataGovRecords({ state_name, fin_year, limit = 1000 }) {
  try {
    if (!API_KEY) {
      console.error('❌ DATA_GOV_API_KEY missing from environment');
      throw new Error('Missing API key');
    }

    // Construct proper filters
    const filters = [];
    if (state_name) filters.push(`filters[state_name]=${encodeURIComponent(state_name)}`);
    if (fin_year) filters.push(`filters[fin_year]=${encodeURIComponent(fin_year)}`);

    // ✅ Build final encoded URL exactly like official API
    const finalUrl = `${DATA_GOV_API_URL}?api-key=${API_KEY}&format=json&limit=${limit}&${filters.join('&')}`;

    console.log('🔗 Final Encoded URL:', finalUrl);

    const response = await axios.get(finalUrl);
    return response.data;
  } catch (err) {
    console.error('❌ Error fetching from data.gov.in:', err.message);
    throw err;
  }
}
