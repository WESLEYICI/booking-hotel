import React from 'react';
import DataPayments from './DataPayments';
import UserList from './UserList';
import Navdashboard from './Navdashboard';
import DataBookings from './DataBookings';
import Databoard from './Databoard';
import DataDiscount from './DataDiscount';
import { Route, Routes, Navigate } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-hotel-cream pt-20">
      <Navdashboard />
      <div className="md:ml-64 p-4 md:p-8">
        <Routes>
          <Route index element={<Databoard />} />
          <Route path="Userlist" element={<UserList />} />
          <Route path="Discount" element={<DataDiscount />} />
          <Route path="Databookings" element={<DataBookings />} />
          <Route path="DataPayments" element={<DataPayments />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
