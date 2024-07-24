import React from 'react'
import ProfileDetails from './ProfileContents/ProfileDetails'
import LoginDetails from './ProfileContents/LoginDetails'
import TravellersDetails from './ProfileContents/TravellersDetails'
import WalletDetails from './ProfileContents/WalletDetails'


function Content () {
  return (
  <div className="items-center justify-center min-h-screen mb-28">
    <ProfileDetails/>
    <LoginDetails/>
    <TravellersDetails/>
    <WalletDetails/>
  </div>
  )
}

export default Content