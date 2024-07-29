import AirNavbar from '../../../components/airline/home/AirNavbar'
import HomeContent from '../../../components/airline/home/HomeContent';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'

const DashboardPage = () => {
  const backgroundImage = `url(${cloudImage})`;

  return (
    <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
      <AirNavbar />
      <HomeContent/>
    </div>
  );
};


export default DashboardPage