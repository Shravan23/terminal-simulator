import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useTracker } from 'meteor/react-meteor-data';
import 'xterm/css/xterm.css';
import { OutputCollection } from '../api/links';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(new FitAddon());
  
  const user = useTracker(() => Meteor.user());
  const { loading } = useTracker(() => {
    const handle = Meteor.subscribe('terminalOutput');
    return {
      loading: !handle.ready()
    };
  });

  useEffect(() => {
    if (!user || !terminalRef.current) return;

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Initialize terminal
      term.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'monospace',
        convertEol: true,
        theme: {
          background: '#000000',
          foreground: '#ffffff',
        }
      });

      term.current.loadAddon(fitAddon.current);
      
      // Check if the element exists before opening
      if (terminalRef.current) {
        term.current.open(terminalRef.current);
        fitAddon.current.fit();

        // Initialize user's terminal session
        Meteor.call('initializeUserTerminal', (error) => {
          if (error) console.error('Failed to initialize terminal:', error);
        });

        // Handle window resizing
        const handleResize = () => fitAddon.current.fit();
        window.addEventListener('resize', handleResize);

        // Handle user input
        term.current.onData((data) => {
          Meteor.call('sendInputToShell', data, (error) => {
            if (error) console.error('Failed to send input:', error);
          });
        });

        // Handle server output
        const query = OutputCollection.find(
          { userId: user._id }, 
          { sort: { createdAt: 1 } }
        );
        const observer = query.observe({
          added: (doc) => {
            if (term.current) {
              term.current.write(doc.text);
            }
          }
        });

        return () => {
          window.removeEventListener('resize', handleResize);
          observer.stop();
          if (term.current) {
            term.current.dispose();
          }
          Meteor.call('cleanupUserTerminal');
        };
      }
    }, 100); // 100ms delay

  }, [user]);

  if (!user) return <div>Please log in to use the terminal.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="terminal-header">
        <button onClick={() => Meteor.logout()}>Logout</button>
      </div>
      <div
        ref={terminalRef}
        style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: 'black',
          padding: '10px',
          borderRadius: '5px'
        }}
      />
    </div>
  );
};

export default TerminalComponent;