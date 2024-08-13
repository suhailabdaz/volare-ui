import AirNavbar from '../../../components/airline/home/AirNavbar';
import FlightList from '../../../components/airline/home/FlightList';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'


function Flights() {
  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <FlightList/>
  </div>;
}

export default Flights;
