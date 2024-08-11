import AdminNavbar from '../../../components/admin/Home/AdminNavbar';
import UsersList from '../../../components/admin/Home/UsersList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg';

function AirlinesPage() {
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
      <UsersList />
    </div>
  );
}

export default AirlinesPage;
