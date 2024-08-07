import AirNavbar from '../../../components/airline/home/AirNavbar';
import MyScheduleList from '../../../components/airline/home/MyScheduleList';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'


function MySchedules() {


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <MyScheduleList/>
  </div>;
}

export default MySchedules;
