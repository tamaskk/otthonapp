import Movies from '@/component/Movies';
import Sidebar from '@/component/sidebar';
import React from 'react'
import { ToastContainer } from 'react-toastify';

const movies = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <Movies />
    </div>
  );
}

export default movies