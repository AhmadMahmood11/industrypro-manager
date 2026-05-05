import { NavLink } from 'react-router-dom';
import { Boxes, CalendarCheck, DollarSign, FileText, Home, Settings, Users, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
const items=[
  {to:'/dashboard',label:'Dashboard',icon:Home},
  {to:'/income-expenses',label:'Income & Expenses',icon:DollarSign},
  {to:'/stock',label:'Stock',icon:Boxes},
  {to:'/employees',label:'Employees',icon:Users,roles:['admin','manager']},
  {to:'/attendance',label:'Attendance',icon:CalendarCheck,roles:['admin','manager']},
  {to:'/payroll',label:'Payroll',icon:WalletCards,roles:['admin']},
  {to:'/reports',label:'Reports',icon:FileText},
  {to:'/settings',label:'Settings',icon:Settings,roles:['admin']}
];
export default function Sidebar(){
  const {user}=useAuth(); const visible=items.filter(i=>!i.roles||i.roles.includes(user?.role));
  return <aside className="sticky top-0 z-20 border-b border-slate-200 bg-white lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
    <div className="flex h-16 items-center border-b border-slate-100 px-5"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">IP</div><div className="ml-3"><p className="font-extrabold text-slate-900">IndustryPro</p><p className="text-xs text-slate-500">Manager</p></div></div>
    <nav className="flex gap-2 overflow-x-auto p-3 lg:block lg:space-y-1 lg:overflow-visible">{visible.map(item=>{const Icon=item.icon; return <NavLink key={item.to} to={item.to} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap ${isActive?'bg-brand-50 text-brand-700':'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18}/>{item.label}</NavLink>;})}</nav>
  </aside>;
}
