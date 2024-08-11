import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store'; 
import ModalManager from './Modals/ModalManager';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import createAxios from '../../../services/axios/AdminAxios';
import { adminEndpoints } from '../../../services/endpoints/AdminEndpoints';
import { setUsers } from '../../../redux/slices/adminSlice';
import { toast } from 'sonner';
import ProfileShimmer from './AdminShimmer'

function UsersList() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  const userData = useSelector((state: RootState) => state.AdminAuth.users);
  const [isLoading, setIsLoading] = useState(true);
  const adminState = useSelector((state: RootState) => state.AdminAuth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsersData = async()=>{
      try{
          if(adminState && (!userData || userData.length===0)){
            const response = await createAxios(dispatch).get(adminEndpoints.getUsers,{
              params:{
                role:"user"
              }
            })
            dispatch(setUsers(response.data.users));
          }

      }catch(err){
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    }
    if(adminState && (!userData || userData.length===0)){
      fetchUsersData();
    }else{
      setIsLoading(false);
    }
   
  }, [adminState, dispatch, userData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }

  const openModal = (modalName: string, userId: string | null = null) => {
    setActiveModal(modalName);
    if (userId) {
      setSelectedUserId(userId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUserId(null);
  };

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-r from-white to-white-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const truncateEmail = (email: string, maxLength: number) => {
    return email.length > maxLength ? email.slice(0, maxLength) + '...' : email;
  };

  // Calculate pagination
  const totalPages = Math.ceil(userData.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = userData.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='flex mx-[11%] justify-center font-PlayfairDisplay my-7 bg-transparent' id='myTravellers'>
      <div className='w-[100%] shadow-custom border-2 border-black'>
        <div className='px-10 py-6'>
          <div className='flex justify-between'>
            <div>
              <h1 className='font-extrabold text-3xl text-black'>Users List</h1>
              <p className='mt-1'>Currently: ({userData.length}) users</p>
            </div>
          </div>
          <div className='mt-8 text-gray-600 text-xs'>
            <ul className='space-y-6'>
              {paginatedUsers.map((user: any, index: any) => (
                <li key={user._id} className='mb-4 group'>
                  <div className='relative flex items-center text-black'>
                    <div className='font-bold mx-4 text-xl'>{startIndex + index + 1}.  </div>
                    <div className={`border-2 border-black h-8 w-12 flex items-center text-lg justify-center text-black font-bold ${getRandomGradient()}`}>
                      {`${user.name?.charAt(0).toUpperCase()}${user.name?.split(' ')[1]?.charAt(0).toUpperCase() || user.name?.charAt(1).toUpperCase()}`}
                    </div>
                    <div className='ml-4 flex-1'>
                      <div className='font-bold text-base'>
                        {user.name}
                      </div>
                    </div>
                    <div className='absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200'>
                      <div className='text-base pr-12 font-semibold text-left'> {user.name}</div>
                      <div className='text-base pr-28 font-semibold'>{truncateEmail(user.email, 20)}</div>
                      <div className='text-base pr-12 font-semibold text-left'>
                        {user.status ? 'Active' : 'Blocked'}
                      </div>            
                      <button onClick={() => openModal('viewUser', user._id)}>
                        <span className='p-1 border border-black invisible text-base font-bold text-black-500 group-hover:visible'>View details</span>
                      </button>
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
          {/* Pagination controls */}
          <div className='flex justify-center items-center mt-4'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
              disabled={currentPage === 1}
            >
                            <ChevronLeftIcon className='h-6 font-bold'/>

            </button>
            <div className='text-base font-semibold'>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`m-5 px-2 py-2 font-bold bg-gray-300 text-black rounded-full ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
              disabled={currentPage === totalPages}
            >
                            <ChevronRightIcon className='h-6 font-bold'/>

            </button>
          </div>
        </div>
      </div>
      <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} userId={selectedUserId || ""} />
    </div>
  );
}

export default UsersList;
