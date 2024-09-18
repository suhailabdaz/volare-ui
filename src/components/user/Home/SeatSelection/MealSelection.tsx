import { useEffect, useState } from "react";
import { useGetAirlinesQuery } from "../../../../redux/apis/authorityApiSlice";
import { useGetChartedFlightQuery } from "../../../../redux/apis/userApiSlice";
import MealImage from '../../../../assets/images/pngtree-illustration-of-sandwich-and-soft-drink-vector-design-food-logo-png-image_7963585.png'
import { PlusIcon } from "@heroicons/react/24/outline";

interface meal{
  mealName:String,
  price:number
}

interface AirlineData{
  meals:meal[]
}

interface props {
  flightChartId: string;
}

const MealSelection: React.FC<props> = ({ flightChartId }) => {

  const [airlineData,setAirlineData] = useState<AirlineData | null>(null)

  const { data: airlineDetails } = useGetAirlinesQuery('airline', {
    refetchOnMountOrArgChange: true,
  });

  const { data: scheduleData } = useGetChartedFlightQuery(flightChartId,{
    refetchOnMountOrArgChange:true
  });

  
  useEffect(() => {
    if (airlineDetails && scheduleData) {
      const selectedAirline = airlineDetails.airlines.find(
        (airline: { _id: string | number }) =>
          airline._id === scheduleData.airlineId
      );
            if (selectedAirline) {
        setAirlineData({ meals: selectedAirline.meals });
      }
    }
  }, [airlineDetails, scheduleData]); 



  return (
<div>
      {airlineData?.meals ? (
        <ul className="meal-list py-5 px-5">
          {airlineData.meals.map((meal, index) => (
            <li key={index} className="meal-item  border-b-2 py-2 border-gray-100">
              <div className="flex justify-between items-center ">
                <div className="flex justify-start space-x-3">
              <img src={MealImage} className="h-14" alt="" />
              <div className=" w-full items-center space-y-1">
              <p className="meal-name font-PlusJakartaSans">{meal.mealName}</p> 
              <p className="meal-price text-sm font-bold  text-gray-600">₹{meal.price}</p>
              </div>
              </div>
              
              <button className="text-blue-500 items-center font-bold flex font-PlusJakartaSans bg-white shadow-custom_shadow px-4 rounded-md py-1 text-sm"><PlusIcon className="h-3"/>ADD</button>
              </div>
            </li>

          ))}
        </ul>
      ) : (
        <p>No meals available for this airline.</p>
      )}
    </div>  )
}

export default MealSelection