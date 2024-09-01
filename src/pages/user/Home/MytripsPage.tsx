import React, { useState } from 'react'
import Navbar from '../../../components/user/Home/Homepage/PrNavbar'
import MytripsList from '../../../components/user/Home/Mytrips/MytripsList'

function MytripsPage() {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <div className='h-[30%]'>
          <MytripsList />
        </div>
        <div className='h-[70%] bg-purple-50'>
          {/* Content for the bottom section */}
        </div>
      </div>
    </div>
  )
}

export default MytripsPage