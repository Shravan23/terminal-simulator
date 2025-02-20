import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';

const SignUp = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    Accounts.createUser({ email, password }, (err) => {
      if (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <button type="button" onClick={onToggleForm}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
