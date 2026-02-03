import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Re-using dashboard aggregation for now as it has everything. 
        // In real app, might want a specific /students endpoint with pagination.
        const res = await api.get('/admin/dashboard'); 
        setStudents(res.data);
      } catch (e) {
        console.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <Layout>
      <header className="top-bar">
        <h1>All Students</h1>
      </header>
      
       <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Room</th>
                <th>Fee Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.rollNumber || 'N/A'}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.roomNumber || 'Unassigned'}</td>
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
    </Layout>
  );
};

export default Students;
