import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setClassState,
  updateTravellers,
} from '../../../../../redux/slices/HeroSlice';
import { RootState } from '../../../../../redux/store/store';

interface ModalProps {
  closeModal: () => any;
}

const TravAndClass: React.FC<ModalProps> = ({ closeModal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const travellers = useSelector(
    (state: RootState) => state.HeroAuth.travellers
  );
  const classState = useSelector(
    (state: RootState) => state.HeroAuth.classState
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'adults' | 'children' | 'infants'
  ) => {
    const value = Number(event.target.value);
    dispatch(updateTravellers({ [field]: value }));
  };

  const handleClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(setClassState(value));
  };

  return (
    <div className="relative z-50 font-PlusJakartaSans">
      <div
        className="absolute -bottom-32 right-6 w-[600px]   bg-white rounded-lg p-4 shadow-custom_shadow"
        ref={modalRef}
      >
        <div className="modal-body">
          <div className="h-72">
            <div className=" text-sm justify-between m-5 mb-1 select-none">
              <div className="text-left">
                <p className="font-bold text-xs">ADULTS (12y +)</p>
                <p className="mb-1 text-[0.6rem] font-PlusJakartaSans1000 text-gray-500">
                  On the Day of travel
                </p>
              </div>
              <div className="flex w-fit bg-gray-100 rounded-lg">
                {Array.from({ length: 9 }, (_, i) => (
                  <label
                    key={i+1}
                    className="radio flex items-center justify-center"
                  >
                    <input
                      type="radio"
                      name="adults"
                      value={i+1}
                      checked={travellers.adults === i+1}
                      onChange={(event) => handleChange(event, 'adults')}
                      className="peer hidden "
                    />
                    <span
                      className={`font-normal p-3 text-center items-center rounded-md bg-gray-100 tracking-widest text-xs transition duration-300 ease-in-out cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white
              }`}
                    >
                      {i+1}
                    </span>
                  </label>
                ))}
              </div>
                      
            </div>
            <div className="flex">
              <div className=" text-sm justify-between m-5 select-none">
                <div className="text-left">
                  <p className="font-bold text-xs">CHILDREN (2 - 12y)</p>
                  <p className="mb-1 text-[0.6rem] font-PlusJakartaSans1000 text-gray-500">
                    On the Day of travel
                  </p>
                </div>
                <div className="flex w-fit bg-gray-100 rounded-lg">
                  {Array.from({ length: 7 }, (_, i) => (
                    <label
                      key={i}
                      className="radio flex items-center justify-center"
                    >
                      <input
                        type="radio"
                        name="children"
                        value={i}
                        checked={travellers.children === i}
                        onChange={(event) => handleChange(event, 'children')}
                        className="peer hidden "
                      />
                      <span
                        className={`font-normal p-3 text-center items-center rounded-md bg-gray-100 tracking-widest text-xs transition duration-300 ease-in-out cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white
              }`}
                      >
                        {i}
                      </span>
                    </label>
                  ))}
                </div>
                        
              </div>
              <div className=" text-sm justify-between m-5 select-none">
                <div className="text-left">
                  <p className="font-bold text-xs">INFANTS (BELOW 2y)</p>
                  <p className="mb-1 text-[0.6rem] font-PlusJakartaSans1000 text-gray-500">
                    On the Day of travel
                  </p>
                </div>
                <div className="flex w-fit bg-gray-100 rounded-lg">
                  {Array.from({ length: 7 }, (_, i) => (
                    <label
                      key={i}
                      className="radio flex items-center justify-center"
                    >
                      <input
                        type="radio"
                        name="infants"
                        value={i}
                        checked={travellers.infants === i}
                        onChange={(event) => handleChange(event, 'infants')}
                        className="peer hidden "
                      />
                      <span
                        className={`font-normal p-3 text-center items-center rounded-md bg-gray-100 tracking-widest text-xs transition duration-300 ease-in-out cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white
              }`}
                      >
                        {i}
                      </span>
                    </label>
                  ))}
                </div>
                        
              </div>
            </div>
            <div className=" text-sm justify-between m-5 mt-1 select-none">
              <div className="text-left">
                <p className="font-bold text-xs mb-2">CHOOSE TRAVEL CLASS</p>
              </div>
              <div className="flex w-fit bg-gray-100 rounded-lg">
                <label className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer">
                  <input
                    type="radio"
                    name="class"
                    value="Economy"
                    checked={classState === 'Economy'}
                    onChange={handleClassChange}
                    className="peer hidden"
                  />
                  <span className=" font-bold peer-checked:bg-blue-500 peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-300 ease-in-out">
                    Economy
                  </span>
                </label>
                <label className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer">
                  <input
                    type="radio"
                    name="class"
                    value="FirstClass"
                    checked={classState === 'FirstClass'}
                    onChange={handleClassChange}
                    className="peer hidden"
                  />
                  <span className="font-bold  peer-checked:bg-blue-500 peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-300 ease-in-out">
                    First Class
                  </span>
                </label>
                <label className="radio flex items-center justify-center rounded-lg p-1 cursor-pointer">
                  <input
                    type="radio"
                    name="class"
                    value="Business"
                    checked={classState === 'Business'}
                    onChange={handleClassChange}
                    className="peer hidden"
                  />
                  <span className="font-bold  peer-checked:bg-blue-500 peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-300 ease-in-out">
                    Business Class
                  </span>
                </label>
              </div>
                      
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravAndClass;
