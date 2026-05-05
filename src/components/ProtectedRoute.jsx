import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="card">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles?.length && !roles.includes(user.role)) return <div className="card"><h1 className="text-xl font-bold">Access restricted</h1><p className="mt-2 text-slate-600">Your role does not have permission to open this page.</p></div>;
  return children;
}
