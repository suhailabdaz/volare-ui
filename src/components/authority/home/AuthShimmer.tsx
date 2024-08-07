import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function AuthShimmer() {
  return (
    <div className='flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent'>
      <div className='w-[100%] shadow-custom border-2 border-black'>
        <div className='px-10 py-6'>
          <div className='flex justify-between'>
            <div>
              <h1 className='font-extrabold text-3xl text-black'>Airport List</h1>
              <p className='mt-1'>Added (0) Airports</p>
            </div>
            <div>
             
            </div>
          </div>
          <div className='mt-8 text-gray-600 text-xs'>
            <ul className='space-y-6'>
              {[...Array(5)].map((_, index) => (
                <li key={index} className='mb-4 group animate-pulse'>
                  <div className='relative flex items-center text-black'>
                    <div className='font-bold mx-4 text-xl'>{index + 1}.</div>
                    <div className='border-2 border-gray-500 h-8 w-12 flex items-center text-lg justify-center text-black font-bold bg-gray-200'></div>
                    <div className='ml-4 flex-1'>
                      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    </div>
                    <div className='absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200'>
                      <div className='h-4 bg-gray-200 rounded w-20'></div>
                      <div className='h-4 bg-gray-200 rounded w-20'></div>
                    
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
          <div className='flex justify-center items-center px-4'>
            <button 
              disabled 
              className=' m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full disabled:opacity-50'
            >
              <ChevronLeftIcon className='h-6 font-bold'/>
            </button>
            <div className='text-center'>
              <span>Page 1 of 1</span>
            </div>
            <button 
              disabled 
              className='m-5 px-2 py-2 font-bold bg-gray-300 rounded-full text-black  disabled:opacity-50'
            >
              <ChevronRightIcon className='h-6 font-bold'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthShimmer;
