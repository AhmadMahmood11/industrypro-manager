export function formatMoney(value, currency='USD'){ return new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:2}).format(Number(value||0)); }
export function todayISO(){ return new Date().toISOString().slice(0,10); }
export function currentMonth(){ return new Date().toISOString().slice(0,7); }
export function statusBadge(status){
  const map={paid:'bg-emerald-100 text-emerald-700',unpaid:'bg-amber-100 text-amber-700',active:'bg-emerald-100 text-emerald-700',inactive:'bg-slate-100 text-slate-700',present:'bg-emerald-100 text-emerald-700',absent:'bg-red-100 text-red-700',late:'bg-yellow-100 text-yellow-700',leave:'bg-blue-100 text-blue-700',income:'bg-emerald-100 text-emerald-700',expense:'bg-red-100 text-red-700'};
  return map[status] || 'bg-slate-100 text-slate-700';
}
