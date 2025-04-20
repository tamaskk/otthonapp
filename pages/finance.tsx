import Finance from '@/component/Finance';
import Sidebar from '@/component/sidebar';
import React from 'react'
import { ToastContainer } from 'react-toastify';

const finance = () => {
  return (
        <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <Finance />
    </div>
  );
}

export default finance