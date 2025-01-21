import React from "react";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm"
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    useEffect(() => {
        term.current = new Terminal({
            cursorBlink: true,
        });
        term.current.open(terminalRef.current);

        term.current.onData((data) => {
            if(data === '\r') {
                term.current.write('\r\n'); // New line
            } else {
                term.current.write(data); // Echo input back to the terminal
            }
        })
        term.current.write('Welcome to the xterm.js Terminal!\r\n');
        return () => {
            // Cleanup terminal on unmount
            term.current.dispose();
        };
    },[]);
    return <div ref={terminalRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default TerminalComponent;