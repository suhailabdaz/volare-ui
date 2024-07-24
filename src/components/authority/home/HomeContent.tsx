import { ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

function HomeContent() {
  const navigate = useNavigate()
  return (
    <div className='mx-[11%] pt-8 pb-3  bg-transparent font-PlayfairDisplay'>
      <div className='mt-5'>
      <h1 className="text-3xl font-bold mb-3">Welcome to the Airline Authority Dashboard</h1>
      <p className= " text-base text-gray-700 w-[60%]">Welcome to the Airline Authority Dashboard. Here, you can efficiently manage <span className='font-bold'>airports </span>  and flight <span className='font-bold'>schedules </span> , 
        ensuring all operations run smoothly and are updated in real-time. We provide a comprehensive 
        interface to oversee every aspect of airline management while strictly adhering to aviation <span className='font-bold'>regulations </span> 
        and standards.</p>
      </div>
      <div className='flex space-x-6 mt-5'>
        <button onClick={()=>navigate('/authority/airports')} className='text-xl font-bold p-2 border-2 border-black transition-all hover:scale-105 delay-100 duration-500'><div className='flex items-center space-x-2'><span>Airports</span> <ArrowRightCircleIcon className='h-6'/>        </div>
        </button>
        <button onClick={()=>navigate('/authority/schedules')} className='text-xl font-bold p-2 border-2 border-black transition-all hover:scale-105 delay-100 duration-500'><div className='flex items-center space-x-2'><span>Schedules</span> <ArrowRightCircleIcon className='h-6'/>        </div>
        </button>
      </div>
  </div>
  )
}

export default HomeContent