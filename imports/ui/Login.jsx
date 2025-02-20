import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const Login = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onToggleForm}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
