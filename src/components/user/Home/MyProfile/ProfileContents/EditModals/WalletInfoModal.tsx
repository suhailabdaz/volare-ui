import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { XMarkIcon,ChevronDownIcon } from '@heroicons/react/24/outline';

interface WalletInfoProps {
  closeModal: () => void;
  openModal: (modalName: string) => void;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const items = [
    {
      title: 'How to Earn?',
      content: 'My Cash is the amount earned via cancellation refunds and reaching Volare milestones.',
    },
    {
      title: 'How to Use?',
      content: 'MyCash can be used completely on booking flights.',
    },
    {
      title: 'When Do They Expire?',
      content: 'My Cash earned via cancellation refunds does not expire. My Cash earned via Volare milestones will expire after 3 months of credit date.',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-2/5 rounded-lg">
          <div className="flex justify-between mb-8 items-end my-3 mt-2">
            <h2 className="text-3xl text-left font-PlusJakartaSans font-bold">
              What is 'My Cash'?
            </h2>
            <button type="button" onClick={() => closeModal()}>
              <XMarkIcon className="h-8" />
            </button>
          </div>

          <div className='space-y-4'>
            {items.map((item, index) => (
              <div key={index}>
                <div className="font-PlusJakartaSans text-gray-600 px-2 font-bold text-lg py-2 cursor-pointer flex justify-between space-x-1">
                  <h1>{item.title}</h1>
                  <button onClick={() => toggleAccordion(index)}><ChevronDownIcon className='h-6 text-blue-600'/></button>

                </div>
                {activeIndex === index && (
                  <div className="font-PlusJakartaSans text-md  px-4  pb-2">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Toaster position="top-center" expand={false} richColors />
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
