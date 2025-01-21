import { Meteor } from 'meteor/meteor';
import { spawn } from 'child_process';

let shellProcess = null;

function stripAnsiCodes(text) {
    return text.replace(/\x1b\[[0-9;]*m/g, ''); // Removes ANSI escape codes
}

Meteor.startup(() => {
    // Start a persistent shell process
    shellProcess = spawn(process.env.SHELL || 'bash', [], { stdio: ['pipe', 'pipe', 'pipe'] });

    console.log('Persistent shell process started');

    // Log errors from the shell process
    shellProcess.on('error', (err) => {
        console.error('Shell process error:', err);
    });

    // Handle process exit
    shellProcess.on('exit', (code) => {
        console.log('Shell process exited with code:', code);
        shellProcess = null;
    });
});

Meteor.methods({
    runCommand(command) {
        return new Promise((resolve, reject) => {
            if (!shellProcess) {
                return reject('Shell process not running');
            }

            let output = '';
            let error = '';

            // Write command to the shell's stdin
            shellProcess.stdin.write(`${command}\n`);

            // Capture stdout and stderr output
            const handleStdout = (data) => {
                output += data.toString();
                shellProcess.stdout.off('data', handleStdout); // Ensure single event handling
            };

            const handleStderr = (data) => {
                error += data.toString();
                shellProcess.stderr.off('data', handleStderr); // Ensure single event handling
            };

            shellProcess.stdout.once('data', handleStdout);
            shellProcess.stderr.once('data', handleStderr);

            // Resolve or reject based on the output
            setTimeout(() => {
                if (error) {
                    reject(stripAnsiCodes(error).replace(/\n/g, '\r\n').trim());
                } else {
                    resolve(stripAnsiCodes(output).replace(/\n/g, '\r\n').trim());
                }
            }, 300); // Adjust the timeout if needed for larger outputs
        });
    }
});