import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function Layout() {
  const location = useLocation();
  // For full-screen IDE / learning pages, hide standard website footer
  const isIdeMode = location.pathname.startsWith('/thi-dau/') || 
                    (location.pathname.startsWith('/khoa-hoc/') && location.pathname !== '/khoa-hoc');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      {!isIdeMode && <Footer />}
    </div>
  );
}