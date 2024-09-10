import AirNavbar from '../../../components/airline/home/AirNavbar';
import cloudImage from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'
import CancelationList from '../../../components/airline/home/CancelationList';


function CancellationPolicies() {
  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AirNavbar/>
    <CancelationList/>
  </div>;
}

export default CancellationPolicies