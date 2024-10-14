import { homedir } from 'os';
import readline from 'readline';

import { listFiles, readFile } from './readModule.js';
import { changeDirectory, goUp } from './navigationModule.js';
import {
  addFile,
  renameFile,
  deleteFile,
  copyFile,
  moveFile,
} from './fileOperationsModule.js';
import { getOsInfo } from './systemInfoModule.js';
import { calculateHash } from './hashCalculationModule.js';
import { compressFile, decompressFile } from './compressionModule.js';

const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Username';

console.log(`Welcome to the File Manager, ${username}!`);

let currentDir = homedir();
printCurrentDir();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

function printCurrentDir() {
  console.log(`You are currently in ${currentDir}`);
}

rl.prompt();
rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'up':
      goUp(currentDir, (err, newDir) => {
        if (err) {
          console.error(err);
        } else {
          currentDir = newDir;
        }
        printCurrentDir();
      });
      break;

    case 'cd':
      changeDirectory(currentDir, args[0], (err, newDir) => {
        if (err) {
          console.error(err);
        } else {
          currentDir = newDir;
        }
        printCurrentDir();
      });
      break;

    case 'ls':
      listFiles(currentDir, (err, fileDetails) => {
        if (err) {
          console.error(err);
        } else {
          console.table(fileDetails);
        }
        printCurrentDir();
      });
      break;

    case 'cat':
      readFile(currentDir, args[0], (err) => {
        if (err) {
          console.error(err);
        }
        printCurrentDir();
      });
      break;

    case 'add':
      addFile(currentDir, args[0], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'rn':
      renameFile(currentDir, args[0], args[1], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'rm':
      deleteFile(currentDir, args[0], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'cp':
      copyFile(currentDir, args[0], args[1], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'mv':
      moveFile(currentDir, args[0], args[1], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'os':
      getOsInfo(args[0]);
      printCurrentDir();
      break;

    case 'hash':
      calculateHash(currentDir, args[0], (err, hash) => {
        if (err) {
          console.error(err);
        } else {
          console.log(hash);
        }
        printCurrentDir();
      });
      break;

    case 'compress':
      compressFile(currentDir, args[0], args[1], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'decompress':
      decompressFile(currentDir, args[0], args[1], (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(message);
        }
        printCurrentDir();
      });
      break;

    case 'exit':
    case '.exit':
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      process.exit(0);

    default:
      console.error('Invalid input');
      printCurrentDir();
  }

  rl.prompt();
}).on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
