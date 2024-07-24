import AuthNavbar from '../../../components/authority/home/AuthNavbar'
import HomeContent from '../../../components/authority/home/HomeContent';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'

const DashboardPage = () => {
  const backgroundImage = `url(${cloudImage})`;

  return (
    <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
      <AuthNavbar />
      <HomeContent/>
    </div>
  );
};


export default DashboardPage