import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IncomeExpenses from './pages/IncomeExpenses.jsx';
import Stock from './pages/Stock.jsx';
import Employees from './pages/Employees.jsx';
import Attendance from './pages/Attendance.jsx';
import Payroll from './pages/Payroll.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="income-expenses" element={<IncomeExpenses />} />
        <Route path="stock" element={<Stock />} />
        <Route path="employees" element={<ProtectedRoute roles={['admin','manager']}><Employees /></ProtectedRoute>} />
        <Route path="attendance" element={<ProtectedRoute roles={['admin','manager']}><Attendance /></ProtectedRoute>} />
        <Route path="payroll" element={<ProtectedRoute roles={['admin']}><Payroll /></ProtectedRoute>} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
