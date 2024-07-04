import React from 'react';

function About() {
  return (
    <div className="mx-[13%] mt-8 p-6  rounded">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="border rounded p-4 flex-1">
          <h3 className="text-lg font-bold mb-2">Feature 1</h3>
          <p>Explanation of feature 1...</p>
        </div>
        <div className="border rounded p-4 flex-1">
          <h3 className="text-lg font-bold mb-2">Feature 2</h3>
          <p>Explanation of feature 2...</p>
        </div>
        <div className="border rounded p-4 flex-1">
          <h3 className="text-lg font-bold mb-2">Feature 3</h3>
          <p>Explanation of feature 3...</p>
        </div>
      </div>
    </div>
  );
}

export default About;
