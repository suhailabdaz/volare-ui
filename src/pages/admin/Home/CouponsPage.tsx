import AdminNavbar from '../../../components/admin/Home/AdminNavbar';
import CouponsList from '../../../components/admin/Home/CouponList';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg';

function CouponsPage() {
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
      <CouponsList />
    </div>
  );
}

export default CouponsPage;
