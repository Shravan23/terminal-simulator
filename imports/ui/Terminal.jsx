import React from "react";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm"
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const inputBuffer = useRef('');
    useEffect(() => {
        term.current = new Terminal({
            cursorBlink: true,
        });
        term.current.open(terminalRef.current);
        term.current.onData((data) => {
            if (data === '\r') {
                term.current.write('\r\n');
                inputBuffer.current = '';
            } else if (data === '\x7f') {
                if (inputBuffer.current.length > 0) {
                    inputBuffer.current = inputBuffer.current.slice(0, -1);
                    term.current.write('\b \b');
                }
            }
            else {
                inputBuffer.current += data;
                term.current.write(data);
            }
        })
        term.current.write('Welcome to the xterm.js Terminal!\r\n');
        return () => {
            term.current.dispose();
        };
    }, []);
    return <div ref={terminalRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default TerminalComponent;