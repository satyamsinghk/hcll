import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Fees = () => {
  const [unpaid, setUnpaid] = useState([]);
  
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get('/admin/unpaid');
        setUnpaid(res.data);
      } catch (e) {
        console.error("Failed to fetch fees");
      }
    };
    fetchFees();
  }, []);

  return (
    <Layout>
       <header className="top-bar">
        <h1>Fee Management</h1>
      </header>

      <div className="stat-card danger" style={{maxWidth: '300px', marginBottom: '2rem'}}>
         <h3>Total Pending Payments</h3>
         <p className="stat-value">{unpaid.length}</p>
      </div>

       <div className="data-table-container">
          <h3>Unpaid Students</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount Due</th>
                <th>Month</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unpaid.map(student => (
                <tr key={student._id}>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>₹ 5,000</td>
                  <td>{new Date().toLocaleString('default', { month: 'long' })}</td>
                  <td>
                    <button 
                      className="login-btn" 
                      style={{width: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.8rem'}}
                      onClick={() => alert(`Marking payment for ${student.firstName}... (Coming Soon)`)}
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
              {unpaid.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>No pending fees! 🎉</td></tr>}
            </tbody>
          </table>
       </div>
    </Layout>
  );
};

export default Fees;
