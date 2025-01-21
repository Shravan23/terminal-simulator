import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import 'xterm/css/xterm.css';
import { Meteor } from 'meteor/meteor';

const TerminalComponent = () => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const inputBuffer = useRef('');

    useEffect(() => {
        // Initialize terminal
        term.current = new Terminal({
            cursorBlink: true,
        });
        term.current.open(terminalRef.current);

        // Handle user input
        term.current.onData((data) => {
            if (data === '\r') {
                // Enter key
                const command = inputBuffer.current.trim();
                inputBuffer.current = ''; // Clear input buffer
                term.current.write('\r\n'); // New line

                // Send the command to the server
                Meteor.call('runCommand', command, (err, res) => {
                    if (err) {
                        term.current.write(`Error: ${err}\r\n`);
                    } else {
                        term.current.write(`${res}\r\n`);
                    }
                    term.current.write('$ '); // Prompt
                });
            } else if (data === '\x7f') {
                // Backspace handling
                if (inputBuffer.current.length > 0) {
                    inputBuffer.current = inputBuffer.current.slice(0, -1);
                    term.current.write('\b \b');
                }
            } else {
                // Regular input
                inputBuffer.current += data;
                term.current.write(data);
            }
        });

        // Initial prompt
        term.current.write('$ ');

        return () => {
            // Cleanup terminal on unmount
            term.current.dispose();
        };
    }, []);

    return <div ref={terminalRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default TerminalComponent;