import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const {login}=useAuth(); const navigate=useNavigate(); const location=useLocation();
  async function submit(e){ e.preventDefault(); setError(''); setLoading(true); try{ await login(email,password); navigate(location.state?.from?.pathname||'/dashboard',{replace:true}); }catch(err){ setError(err.message); }finally{ setLoading(false); } }
  return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4"><div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><div className="mb-8 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-black text-white">IP</div><h1 className="text-2xl font-black text-slate-900">Login to IndustryPro Manager</h1><p className="mt-2 text-sm text-slate-500">Manage finance, stock, attendance, and payroll.</p></div>{error&&<div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}<form onSubmit={submit} className="space-y-4"><div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div><button className="btn-primary w-full" disabled={loading}>{loading?'Logging in...':'Login'}</button></form><p className="mt-6 text-center text-sm text-slate-500">New business? <Link className="font-bold text-brand-700" to="/register">Create account</Link></p></div></div>;
}
