import React from 'react';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className="landing-shell">
      <Outlet />
    </div>
  );
};

export default LandingLayout;
