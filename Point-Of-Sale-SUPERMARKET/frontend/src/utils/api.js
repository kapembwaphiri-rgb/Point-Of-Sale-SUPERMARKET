import axios from 'axios';
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' });
client.interceptors.request.use(config => { const token = localStorage.getItem('pos_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export async function api(path, options = {}) { try { const response = await client({ url: path, ...options, data: options.body ? JSON.parse(options.body) : options.data }); return response.data; } catch (error) { throw new Error(error.response?.data?.error || error.message || 'Request failed'); } }
export const apiClient = client;
export function queueSale(payload){ const queue=JSON.parse(localStorage.getItem('pos_queue') || '[]'); queue.push(payload); localStorage.setItem('pos_queue',JSON.stringify(queue)); }
export function queuedCount(){ return JSON.parse(localStorage.getItem('pos_queue') || '[]').length; }
