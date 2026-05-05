const API_BASE = '/.netlify/functions';
function token(){ return localStorage.getItem('industrypro_token'); }
export function query(params={}){ const q=new URLSearchParams(); Object.entries(params).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=='') q.set(k,v); }); return q.toString()?`?${q}`:''; }
export async function apiRequest(path, options={}) {
  const headers = { 'Content-Type':'application/json', ...(options.headers||{}) };
  const t = token(); if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}
export const api = {
  get:(p, params)=>apiRequest(`${p}${query(params)}`),
  post:(p,b)=>apiRequest(p,{method:'POST', body:JSON.stringify(b)}),
  put:(p,b)=>apiRequest(p,{method:'PUT', body:JSON.stringify(b)}),
  del:(p, params)=>apiRequest(`${p}${query(params)}`,{method:'DELETE'})
};
