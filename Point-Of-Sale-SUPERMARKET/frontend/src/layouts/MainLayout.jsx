import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
export default function MainLayout({ user, onLogout }) { const navigate=useNavigate(); const logout=()=>{onLogout();navigate('/')}; return <div className="app-shell"><Navbar user={user} onLogout={logout}/><main className="main"><Outlet/></main></div>; }
