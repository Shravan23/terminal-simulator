import { Meteor } from 'meteor/meteor';
import { exec } from 'child_process';

Meteor.methods({
  runCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message)
        } else {
          resolve(stdout)
        }
      })
    })
  }
})
Meteor.startup(async () => {
});
