import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
         <h2>HCL Hostel</h2>
         <span className="role-badge">{user?.role || 'User'}</span>
      </div>
      <nav>
        <button 
          className={`nav-item ${isActive('/dashboard')}`} 
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button 
          className={`nav-item ${isActive('/students')}`}
          onClick={() => navigate('/students')}
        >
          <Users size={20} /> Students
        </button>
        <button 
          className={`nav-item ${isActive('/fees')}`}
          onClick={() => navigate('/fees')}
        >
          <CreditCard size={20} /> Fees
        </button>
      </nav>
      <button onClick={handleLogout} className="logout-btn"><LogOut size={20} /> Logout</button>
    </aside>
  );
};

export default Sidebar;
