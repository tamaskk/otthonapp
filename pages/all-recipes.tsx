import Sidebar from '@/component/sidebar'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const recipes = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
        <ToastContainer />
        <Sidebar />
    </div>
  )
}

export default recipes