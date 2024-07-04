import React from 'react';

function Popular() {
  return (
    <div className="mx-[13%] mt-8 p-6 border-2 rounded">
      <h2 className="text-2xl font-bold mb-6">Popular Flight Routes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 1</h3>
            <p>Details about route 1...</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 2</h3>
            <p>Details about route 2...</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 3</h3>
            <p>Details about route 3...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 4</h3>
            <p>Details about route 4...</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 5</h3>
            <p>Details about route 5...</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Route 6</h3>
            <p>Details about route 6...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popular;
