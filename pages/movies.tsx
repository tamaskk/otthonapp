import Movies from '@/component/Movies';
import Sidebar from '@/component/sidebar';
import React from 'react'
import { ToastContainer } from 'react-toastify';

const movies = () => {
  return (
    <div className="max-h-[100dvh] flex-1 overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <Movies />
    </div>
  );
}

export default movies