import AirNavbar from '../../../components/airline/home/AirNavbar';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'
import MealsList from '../../../components/airline/home/MealsList';


function MealsMenu() {
  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <MealsList/>
  </div>;
}

export default MealsMenu