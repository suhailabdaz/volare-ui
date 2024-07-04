import React from 'react';

function Links() {
  return (
    <div className="mx-[13%] mt-8 p-6 border-2 rounded">
      <div className=" md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-blue-500 hover:underline">Home</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Flights</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Hotels</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Contact Us</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Support</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">About Site</h2>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-blue-500 hover:underline">About Us</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Terms of Service</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Careers</a></li>
            <li><a href="#" className="text-blue-500 hover:underline">Blog</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Links;
