import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'ADMIN') {
           const res = await api.get('/admin/dashboard');
           setStats(res.data);
           const unpaidRes = await api.get('/admin/unpaid');
           setUnpaid(unpaidRes.data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
           <h2>HCL Hostel</h2>
           <span className="role-badge">{user.role}</span>
        </div>
        <nav>
          <button className="nav-item active"><LayoutDashboard size={20} /> Dashboard</button>
          <button className="nav-item"><Users size={20} /> Students</button>
          <button className="nav-item"><CreditCard size={20} /> Fees</button>
        </nav>
        <button onClick={handleLogout} className="logout-btn"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="content">
        <header className="top-bar">
          <h1>Overview</h1>
          <div className="user-profile">
            <span>{user.name}</span>
            <div className="avatar">{user.name.charAt(0)}</div>
          </div>
        </header>

        {loading ? <p>Loading...</p> : (
          <div className="dashboard-grid">
             <div className="stat-card">
               <h3>Total Students</h3>
               <p className="stat-value">{stats.length}</p>
             </div>
             <div className="stat-card danger">
               <h3>Unpaid Fees</h3>
               <p className="stat-value">{unpaid.length}</p>
             </div>
             
             <div className="data-table-container">
                <h3>Recent Students</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Room</th>
                      <th>Mess Status</th>
                      <th>Fee Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.slice(0, 5).map(student => (
                      <tr key={student._id}>
                        <td>{student.firstName} {student.lastName}</td>
                        <td>{student.roomNumber}</td>
                        <td>
                          <span className={`status-pill ${student.messStatus ? 'success' : 'warning'}`}>
                            {student.messStatus ? 'Registered' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${student.feeStatus === 'PAID' ? 'success' : 'danger'}`}>
                            {student.feeStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
