
import LoginModal from './LoginModal';
import  cloudimage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg'


function Login() {
  

  
  return (
<div className="relative min-h-screen w-full bg-gray-100 font-PlayfairDisplay">
  <img src={cloudimage} alt="" className="absolute inset-0 w-full h-full object-cover" />
  <div className="relative z-10 pt-4">
    <LoginModal />
  </div>
</div>

  );
}

export default Login;
