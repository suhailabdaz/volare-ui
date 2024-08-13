import AuthNavbar from '../../../components/authority/home/AuthNavbar';
import AirportsList from '../../../components/authority/home/AirportsList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'


function LoaderAuth() {

  const backgroundImage = `url(${cloudImage})`;
  return <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
    <AuthNavbar/>
    <div className="flex-col gap-4 w-full flex items-center justify-center">
                        <div className="w-7 h-7 border-4 border-transparent text-gray-300 text-4xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full">
                          <div className="w-5 h-5 border-4 border-transparent text-gray-300 text-2xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full"></div>
                        </div>
                      </div>
  </div>;
}

export default LoaderAuth;
