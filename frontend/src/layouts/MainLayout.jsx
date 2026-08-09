import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-body" id="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
