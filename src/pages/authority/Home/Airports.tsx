import AuthNavbar from '../../../components/authority/home/AuthNavbar';
import AirportsList from '../../../components/authority/home/AirportsList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'


function Airports() {

 


  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AuthNavbar/>
    <AirportsList/>
  </div>;
}

export default Airports;
