import AirNavbar from '../../../components/airline/home/AirNavbar';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'
import BaggagePoliciesList from '../../../components/airline/home/BaggagePoliciesList';


function BaggagePolicies() {
  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <BaggagePoliciesList/>
  </div>;
}

export default BaggagePolicies