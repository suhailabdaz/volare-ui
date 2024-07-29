import AdminNavbar from '../../../components/admin/Home/AdminNavbar'
import HomeContent from '../../../components/admin/Home/HomeContent';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'

const DashboardPage = () => {
  const backgroundImage = `url(${cloudImage})`;

  return (
    <div style={{ backgroundImage: backgroundImage, backgroundSize: 'cover', height: '100vh' }}>
      <AdminNavbar />
      <HomeContent/>
    </div>
  );
};


export default DashboardPage