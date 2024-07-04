import React from 'react';

function Sidebar() {
  return (
    <div className="bg-gray-200 h-screen w-[13%] fixed left-0 top-0">
      <div className="p-4">
        {/* User Image */}
        <div className="mb-4">
          <img src="user-image-url" alt="User" className="w-16 h-16 rounded-full mx-auto" />
        </div>
        {/* Sidebar Sections */}
        <nav>
          <ul className="space-y-2">
            <li><a href="#" className="block py-2 px-4 text-gray-800 hover:bg-gray-300">My Account</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-800 hover:bg-gray-300">My Travelers</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-800 hover:bg-gray-300">My Trips</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-800 hover:bg-gray-300">Wallet</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-800 hover:bg-gray-300">Logout</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
