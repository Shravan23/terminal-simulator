import { Meteor } from 'meteor/meteor';
import { OutputCollection } from '/imports/api/links';
import pty from 'node-pty';

let shellProcess = null;

Meteor.startup(() => {
  OutputCollection.removeAsync({});

  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

  shellProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: {
      TERM: 'xterm-256color',
      PATH: process.env.PATH,
    },
  });

  console.log('Shell started:', shell);

  shellProcess.onData((data) => {
    console.log('RAW output:', data);
    OutputCollection.insertAsync({
      text: data,
      createdAt: new Date()
    });
  });

  Meteor.publish('terminalOutput', function () {
    return OutputCollection.find({}, { 
      sort: { createdAt: 1 },
      limit: 1000
    });
  });
});

Meteor.methods({
  sendInputToShell(input) {
    console.log('Input received:', input);
    if (!shellProcess) {
      throw new Meteor.Error('shell-error', 'Shell not running');
    }
    shellProcess.write(input);
  },
});