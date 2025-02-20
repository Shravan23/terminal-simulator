import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import TerminalComponent from './Terminal.jsx';
import Auth from './Auth.jsx';

export const App = () => {
  const { user, loading } = useTracker(() => ({
    user: Meteor.user(),
    loading: Meteor.loggingIn()
  }));

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Terminal Simulator</h1>
      {user ? <TerminalComponent /> : <Auth />}
    </div>
  );
};
