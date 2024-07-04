import React, { useState } from 'react';

function Offers() {
  const [offerType, setOfferType] = useState('All');

  const handleOfferTypeChange = (type) => {
    setOfferType(type);
  };

  return (
    <div className="mx-[13%] mt-8 p-6 border-2 rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Offers</h2>
        <div className="space-x-4">
          <button
            onClick={() => handleOfferTypeChange('All')}
            className={`px-4 py-2 rounded ${
              offerType === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleOfferTypeChange('Flights')}
            className={`px-4 py-2 rounded ${
              offerType === 'Flights' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Flights
          </button>
          <button
            onClick={() => handleOfferTypeChange('Hotels')}
            className={`px-4 py-2 rounded ${
              offerType === 'Hotels' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Hotels
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example offer cards */}
        <div className="border rounded p-4">
          <h3 className="text-lg font-bold mb-2">Offer 1</h3>
          <p>Details about offer 1...</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="text-lg font-bold mb-2">Offer 2</h3>
          <p>Details about offer 2...</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="text-lg font-bold mb-2">Offer 3</h3>
          <p>Details about offer 3...</p>
        </div>
        {/* Add more offer cards as needed */}
      </div>
    </div>
  );
}

export default Offers;
