import AirNavbar from '../../../components/airline/home/AirNavbar';
import FreeScheduleList from '../../../components/airline/home/FreeScheduleList';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'


function Freeschedules() {


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <FreeScheduleList/>
  </div>;
}

export default Freeschedules;
