import { ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function HomeContent() {
  const navigate = useNavigate()
  return (
    <div className='mx-[11%] pt-8 pb-3  bg-transparent font-PlayfairDisplay'>
      <div className='mt-5'>
      <h1 className="text-3xl font-bold mb-3">Welcome to the Volare Administrator Dashboard</h1>
      <p className="text-base text-gray-700 w-[60%]">
  Welcome to the Airline Authority Dashboard. As an administrator, 
  you are responsible for overseeing and managing <span className='font-bold'> user accounts, 
  airline details, promotional offers, and banners</span>. 
  This platform allows you to efficiently control and update these elements, 
  ensuring that all information is accurate and current.   
</p>
      </div>
      <div className='flex space-x-6 mt-5'>
        <button onClick={()=>navigate('/admin/users')} className='text-xl font-bold p-2 border-2 border-black transition-all hover:scale-105 delay-100 duration-500'><div className='flex items-center space-x-2'><span>Users</span> <ArrowRightCircleIcon className='h-6'/>        </div>
        </button>
        <button onClick={()=>navigate('/admin/airlines')} className='text-xl font-bold p-2 border-2 border-black transition-all hover:scale-105 delay-100 duration-500'><div className='flex items-center space-x-2'><span>Airlines</span> <ArrowRightCircleIcon className='h-6'/>        </div>
        </button>
      </div>
  </div>
  )
}

export default HomeContent