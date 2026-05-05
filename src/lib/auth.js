export function saveAuth(token,user){ localStorage.setItem('industrypro_token',token); localStorage.setItem('industrypro_user',JSON.stringify(user)); }
export function clearAuth(){ localStorage.removeItem('industrypro_token'); localStorage.removeItem('industrypro_user'); }
export function getStoredUser(){ try { return JSON.parse(localStorage.getItem('industrypro_user') || 'null'); } catch { return null; } }
