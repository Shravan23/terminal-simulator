import { Meteor } from 'meteor/meteor';
import { OutputCollection } from '/imports/api/links';
import pty from 'node-pty';

const shellProcesses = new Map();

Meteor.startup(() => {
  OutputCollection.removeAsync({});
});

Meteor.publish('terminalOutput', function () {
  if (!this.userId) {
    return this.ready();
  }
  return OutputCollection.find(
    { userId: this.userId },
    { 
      sort: { createdAt: 1 },
      limit: 1000
    }
  );
});

const initializeShell = (userId) => {
  if (shellProcesses.has(userId)) {
    return shellProcesses.get(userId);
  }

  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const shellProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: {
      TERM: 'xterm-256color',
      PATH: process.env.PATH,
    },
  });

  shellProcess.onData((data) => {
    OutputCollection.insertAsync({
      text: data,
      userId: userId,
      createdAt: new Date()
    });
  });

  shellProcesses.set(userId, shellProcess);
  return shellProcess;
};

Meteor.methods({
  initializeUserTerminal() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    return initializeShell(this.userId);
  },

  sendInputToShell(input) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    const shellProcess = shellProcesses.get(this.userId);
    if (!shellProcess) {
      throw new Meteor.Error('shell-error', 'Shell not running');
    }
    
    shellProcess.write(input);
  },

  cleanupUserTerminal() {
    if (!this.userId) return;
    
    const shellProcess = shellProcesses.get(this.userId);
    if (shellProcess) {
      shellProcess.kill();
      shellProcesses.delete(this.userId);
    }
  }
});