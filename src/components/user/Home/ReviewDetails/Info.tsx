import React from 'react';
import Warning from '../../../../assets/images/icons8-high-importance-48.png';

function Info() {
  return (
    <div className="bg-white rounded w-[99%] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5" id='important_info'>
      <h1 className="font-PlusJakartaSans1000 text-xl">
        Important Information
      </h1>
      <div className='my-4 space-y-2 pr-3 py-2'>
        <div className=" flex justify-start items-center  space-x-2">
          <img src={Warning} className="h-5" alt="i" />
          <p className='text-sm font-PlusJakartaSans1000'>Check travel guidelines and baggage information :</p>
          
        </div>
        <ul className='flex justify-start items-center mx-6'>
            <li className='list-disc text-xs'>Carry no more than 1 check-in baggage and 1 hand baggage per passenger. If violated, airline may levy extra charges.
            </li>
          </ul>
      </div>
      <div className='my-4 space-y-2 pr-3 py-2'>
        <div className=" flex justify-start items-center  space-x-2">
          <img src={Warning} className="h-5" alt="i" />
          <p className='text-sm font-PlusJakartaSans1000'>Unaccompanied Minors Travelling:</p>
          
        </div>
        <ul className=' space-y-2 items-center mx-6'>
            <li className='list-disc text-xs'>An unaccompanied minor usually refers to a child traveling without an adult aged 18 or older.
            </li>
            <li className='list-disc text-xs'>Please check with the airline for their rules and regulations regarding unaccompanied minors, as these can differ between airlines.
            </li>

          </ul>
      </div>
      </div>
    
  );
}

export default Info;
