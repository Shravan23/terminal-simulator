import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { OutputCollection } from '../api/links';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(new FitAddon());

  useEffect(() => {
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
    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Handle window resizing
    const handleResize = () => fitAddon.current.fit();
    window.addEventListener('resize', handleResize);

    // Subscribe to server output
    const subHandle = Meteor.subscribe('terminalOutput');

    // Handle user input
    term.current.onData((data) => {
      // Send to server only - removed local echo to prevent double characters
      Meteor.call('sendInputToShell', data, (error) => {
        if (error) console.error('Failed to send input:', error);
      });
    });

    // Handle server output
    const query = OutputCollection.find({}, { sort: { createdAt: 1 } });
    const observer = query.observe({
      added: (doc) => {
        term.current.write(doc.text);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.stop();
      subHandle.stop();
      term.current.dispose();
    };
  }, []);

  return (
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
  );
};

export default TerminalComponent;