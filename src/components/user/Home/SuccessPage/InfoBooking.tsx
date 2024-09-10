import React from 'react';

interface props{
  bookingId:string
}

const Info: React.FC<props> = ({ bookingId }) => {
  return (
    <>
      
      <div className='p-3'>
        <div className=" flex justify-start items-center  space-x-2">
          <p className='text-base text-green-900 font-PlusJakartaSans font-thin'>Your Flight ticket have been booked succesfully! confirmation number is {bookingId}</p>
          
        </div>
      </div>
      </>
    
  );
}

export default Info;
