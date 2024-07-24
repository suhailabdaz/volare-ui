import React from 'react';
import Navbar from '../../../components/admin/Home/Navbar';
import Sidebar from '../../../components/admin/Home/Sidebar';
import Content from '../../../components/admin/Home/Content';

function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-4">
          <Content />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
