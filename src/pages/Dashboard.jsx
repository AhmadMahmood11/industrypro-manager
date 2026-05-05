import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import { api } from '../lib/api.js';
import { formatMoney, statusBadge } from '../lib/utils.js';

export default function Dashboard(){
  const [data,setData]=useState(null); const [error,setError]=useState('');
  useEffect(()=>{ api.get('/dashboard-summary').then(setData).catch(e=>setError(e.message)); },[]);
  if(error) return <div className="card text-red-700">{error}</div>;
  if(!data) return <div className="card">Loading dashboard...</div>;
  const currency=data.settings?.currency||'USD';
  return <div className="space-y-6"><div><h1 className="text-2xl font-black text-slate-900">Dashboard</h1><p className="text-slate-500">Live overview of finance, stock, staff, and payroll.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Income" value={formatMoney(data.totalIncome,currency)} subtitle="Income" tone="green"/>
      <StatCard title="Total Expenses" value={formatMoney(data.totalExpenses,currency)} subtitle="Expenses" tone="red"/>
      <StatCard title="Net Profit" value={formatMoney(data.netProfit,currency)} subtitle={data.netProfit>=0?'Profitable':'Loss'} tone={data.netProfit>=0?'green':'red'}/>
      <StatCard title="Stock Value" value={formatMoney(data.totalStockValue,currency)} subtitle={`${data.lowStockCount} low stock`} tone="amber"/>
      <StatCard title="Employees" value={data.totalEmployees} subtitle="Active staff" tone="blue"/>
      <StatCard title="Present Today" value={data.presentToday} subtitle="Attendance" tone="green"/>
      <StatCard title="Absent Today" value={data.absentToday} subtitle="Attendance" tone="red"/>
      <StatCard title="Pending Salary" value={formatMoney(data.pendingSalary,currency)} subtitle="Unpaid payroll" tone="amber"/>
    </div>
    <div className="grid gap-6 lg:grid-cols-2"><section className="card"><h2 className="mb-4 text-lg font-extrabold">Recent Transactions</h2><div className="space-y-3">{data.recentTransactions.length===0&&<p className="text-sm text-slate-500">No transactions yet.</p>}{data.recentTransactions.map(item=><div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div><p className="font-bold">{item.category||'General'}</p><p className="text-xs text-slate-500">{item.transaction_date}</p></div><div className="text-right"><span className={`badge ${statusBadge(item.type)}`}>{item.type}</span><p className="mt-1 font-bold">{formatMoney(item.amount,currency)}</p></div></div>)}</div></section>
    <section className="card"><h2 className="mb-4 text-lg font-extrabold">Recent Stock Activity</h2><div className="space-y-3">{data.recentStockActivity.length===0&&<p className="text-sm text-slate-500">No stock movement yet.</p>}{data.recentStockActivity.map(item=><div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div><p className="font-bold">{item.products?.name||'Product'}</p><p className="text-xs text-slate-500">{item.movement_date}</p></div><div className="text-right"><span className="badge bg-slate-100 text-slate-700">{item.movement_type}</span><p className="mt-1 font-bold">Qty: {item.quantity}</p></div></div>)}</div></section></div>
  </div>;
}
