import ExerciseSettingsComponent from '@/component/ExerciseSettings'
import Sidebar from '@/component/sidebar'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const ExerciseSettings = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <ExerciseSettingsComponent />
    </div>
  )
}

export default ExerciseSettings