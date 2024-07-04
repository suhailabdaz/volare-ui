import React from 'react';
import SideBar from '../../../components/user/Home/MyProfile/SideBar';
import Content from '../../../components/user/Home/MyProfile/Content';

function MyProfilePage() {
  return (
    <div className="flex">
      <div className="w-1/2 h-screen">
        <SideBar />
      </div>
      <div className="w-1/2 h-screen">
        <Content />
      </div>
    </div>
  );
}

export default MyProfilePage;
