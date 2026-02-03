import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
