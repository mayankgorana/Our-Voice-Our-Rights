import axios from 'axios';
const BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const fetchMgnrega = async ({ state_name, fin_year, limit = 1000, sort_field, sort_order }) => {
const resp = await axios.get(`${BASE}/api/mgnrega`, {
params: { state_name, fin_year, limit, sort_field, sort_order }
});
return resp.data;
};