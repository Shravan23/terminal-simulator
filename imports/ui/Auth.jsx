import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login onToggleForm={() => setShowLogin(false)} />
  ) : (
    <SignUp onToggleForm={() => setShowLogin(true)} />
  );
};

export default Auth;
