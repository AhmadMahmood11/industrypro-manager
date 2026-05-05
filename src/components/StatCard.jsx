export default function StatCard({ title, value, subtitle, tone='slate' }) {
  const tones={slate:'bg-slate-50 text-slate-700',green:'bg-emerald-50 text-emerald-700',red:'bg-red-50 text-red-700',amber:'bg-amber-50 text-amber-700',blue:'bg-blue-50 text-blue-700'};
  return <div className="card"><p className="text-sm font-semibold text-slate-500">{title}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p>{subtitle&&<span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{subtitle}</span>}</div>;
}
