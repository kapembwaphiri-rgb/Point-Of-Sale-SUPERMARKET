import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function Protected({ user, children, managerOnly = false }) {
  if (!user) return <Navigate to="/" replace />;
  if (managerOnly && user.role !== 'MANAGER') return <Navigate to="/checkout" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => { const cached = localStorage.getItem('pos_user'); if (cached) setUser(JSON.parse(cached)); }, []);
  const logout = () => { localStorage.clear(); setUser(null); };
  return <BrowserRouter><Routes><Route element={<MainLayout user={user} onLogout={logout} />}><Route path="/" element={<HomePage user={user} onLogin={setUser} />} /><Route path="/checkout" element={<Protected user={user}><CheckoutPage /></Protected>} /><Route path="/dashboard" element={<Protected user={user} managerOnly><DashboardPage /></Protected>} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></BrowserRouter>;
}
