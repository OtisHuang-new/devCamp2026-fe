import Brand from './Components/Brand';
import Body from './Components/Body';

import imgBackGround from './Assets/backGround.jpg';
import { useState } from 'react';

import Login from '../auth/Login';
import Register from '../auth/Register';

function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div
      className="relative min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${imgBackGround})`, backgroundPosition: 'center calc(50%)' }}
    >
      {/**filter màu xanh */}
      <div className="absolute inset-0 bg-primary/[0.88]"></div>
      <div className="relative z-10 flex flex-col w-full">
        <Brand />
        <Body onOpenLogin={() => setIsLoginOpen(true)} />
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}

export default LandingPage;
