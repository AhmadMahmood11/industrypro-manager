import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { clearAuth, getStoredUser, saveAuth } from '../lib/auth.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user,setUser]=useState(getStoredUser());
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ const t=localStorage.getItem('industrypro_token'); if(!t){setLoading(false);return;} api.get('/auth-current-user').then(d=>{setUser(d.user);saveAuth(t,d.user);}).catch(()=>{clearAuth();setUser(null);}).finally(()=>setLoading(false)); },[]);
  async function login(email,password){ const d=await api.post('/auth-login',{email,password}); saveAuth(d.token,d.user); setUser(d.user); return d.user; }
  async function register(payload){ const d=await api.post('/auth-register',payload); saveAuth(d.token,d.user); setUser(d.user); return d.user; }
  function logout(){ clearAuth(); setUser(null); }
  const value=useMemo(()=>({user,loading,login,register,logout,isAuthenticated:!!user}),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const c=useContext(AuthContext); if(!c) throw new Error('useAuth must be used inside AuthProvider'); return c; }
