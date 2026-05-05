import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
export default function Layout(){ return <div className="min-h-screen bg-slate-50 lg:flex"><Sidebar/><div className="min-w-0 flex-1"><Topbar/><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><Outlet/></main></div></div>; }
