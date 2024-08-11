import AdminNavbar from '../../../components/admin/Home/AdminNavbar';
import BannersList from '../../../components/admin/Home/BannersList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg';

function BannersPage() {
  const backgroundImage = `url(${cloudImage})`;
  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <AdminNavbar />
      <BannersList />
    </div>
  );
}

export default BannersPage;
