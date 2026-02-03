import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuth();
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

  return (
    <Layout>
        <header className="top-bar">
          <h1>Overview</h1>
          <div className="user-profile">
            <span>{user.name}</span>
            <div className="avatar">{user.name.charAt(0)}</div>
          </div>
        </header>

        {loading ? <p>Loading...</p> : (
          <div className="dashboard-grid">
             {/* ADMIN VIEW */}
             {user.role === 'ADMIN' && (
               <>
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
               </>
             )}

             {/* STUDENT VIEW */}
             {user.role === 'STUDENT' && (
                <div className="student-dashboard" style={{gridColumn: '1 / -1'}}>
                   <div className="stat-card" style={{maxWidth: '400px', margin: '0 auto'}}>
                      <h3>Fee Status</h3>
                      <div style={{margin: '1.5rem 0', fontSize: '1.2rem'}}>
                        Current Month: <span style={{fontWeight: 'bold'}}>{new Date().toLocaleString('default', { month: 'long' })}</span>
                      </div>
                      
                      {/* Placeholder for actual fee check. Assuming unpaid for simplified flow as per request */}
                      <div className="fee-actions" style={{textAlign: 'center'}}>
                         <div className="status-pill danger" style={{display: 'inline-block', marginBottom: '1rem', fontSize: '1rem', padding: '0.5rem 1rem'}}>
                            PENDING
                         </div>
                         <br/>
                         <button 
                            className="login-btn"
                            onClick={() => alert("Redirecting to Payment Gateway... (Simulation)")}
                         >
                            Pay Hostel Fee (₹ 5,000)
                         </button>
                      </div>
                   </div>
                   
                   <div style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                      <p>Room: Not Assigned</p>
                      <p>Mess: Not Registered</p>
                   </div>
                </div>
             )}
          </div>
        )}
    </Layout>
  );
};

export default Dashboard;

