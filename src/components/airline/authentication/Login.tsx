import LoginModal from './LoginModal';
import neon from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';
import { useState } from 'react';
import SignupModal from './SignupModal';

function Login() {
  const [IsLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-[97.2vh] w-[98.9vw] font-PlayfairDisplay m-2">
      <img
        src={neon}
        alt=""
        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
      />
      <div className="absolute inset-0 bg-black opacity-30 rounded-3xl"></div>{' '}
      {/* Black shade overlay */}
      <div className="relative z-10 pt-4">
        {IsLogin ? (
          <LoginModal setIsLogin={setIsLogin} />
        ) : (
          <SignupModal setIsLogin={setIsLogin} />
        )}
      </div>
    </div>
  );
}

export default Login;
