import AuthNavbar from '../../../components/authority/home/AuthNavbar';
import AirlinesList from '../../../components/authority/home/AirlinesList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'


function Airlines() {

  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AuthNavbar/>
    <AirlinesList/>
  </div>;
}

export default Airlines;
