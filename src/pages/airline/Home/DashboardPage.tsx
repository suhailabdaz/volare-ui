import AirNavbar from '../../../components/airline/home/AirNavbar'
import HomeContent from '../../../components/airline/home/HomeContent';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'

const DashboardPage = () => {
  const backgroundImage = `url(${cloudImage})`;

  return (
    <div className='min-h-screen' style={{ backgroundImage: backgroundImage, backgroundSize: 'cover',opacity:'0.99' }}>
      <AirNavbar />
      <HomeContent/>
    </div>
  );
};


export default DashboardPage