import {
  createReadStream,
  createWriteStream,
  readdir,
  stat,
  unlink,
  writeFile,
  rename,
} from 'fs';
import { resolve, dirname, basename } from 'path';
import { homedir, EOL, cpus, userInfo, arch } from 'os';
import { createHash } from 'crypto';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import readline from 'readline';

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

function listFiles() {
  readdir(currentDir, (err, files) => {
    if (err) {
      console.error('Operation failed');
    } else {
      console.log(files.join('\n'));
    }
    printCurrentDir();
  });
}

function changeDirectory(newDir) {
  const targetDir = resolve(currentDir, newDir);
  stat(targetDir, (err, stats) => {
    if (err || !stats.isDirectory()) {
      console.error('Operation failed');
    } else {
      currentDir = targetDir;
    }
    printCurrentDir();
  });
}

function goUp() {
  const parentDir = dirname(currentDir);
  if (parentDir === currentDir) {
    console.error('Operation failed');
  } else {
    currentDir = parentDir;
  }
  printCurrentDir();
}

function readFile(filePath) {
  const fullPath = resolve(currentDir, filePath);
  const stream = createReadStream(fullPath, { encoding: 'utf-8' });

  stream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  stream.on('error', () => {
    console.error('Operation failed');
  });

  stream.on('end', () => {
    console.log();
    printCurrentDir();
  });
}

function addFile(fileName) {
  const fullPath = resolve(currentDir, fileName);
  writeFile(fullPath, '', (err) => {
    if (err) {
      console.error('Operation failed');
    } else {
      console.log(`${fileName} created successfully`);
    }
    printCurrentDir();
  });
}

function renameFile(oldPath, newFileName) {
  const oldFullPath = resolve(currentDir, oldPath);
  const newFullPath = resolve(currentDir, newFileName);

  rename(oldFullPath, newFullPath, (err) => {
    if (err) {
      console.error('Operation failed');
    } else {
      console.log(`File renamed to ${newFileName}`);
    }
    printCurrentDir();
  });
}

function deleteFile(filePath) {
  const fullPath = resolve(currentDir, filePath);
  unlink(fullPath, (err) => {
    if (err) {
      console.error('Operation failed');
    } else {
      console.log(`File ${filePath} deleted successfully`);
    }
    printCurrentDir();
  });
}

function copyFile(filePath, destDir) {
  const srcPath = resolve(currentDir, filePath);
  const destPath = resolve(currentDir, destDir, basename(filePath));

  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);

  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log(`File copied to ${destPath}`);
    printCurrentDir();
  });

  readStream.on('error', () => {
    console.error('Operation failed');
  });
}

function moveFile(filePath, destDir) {
  copyFile(filePath, destDir);
  deleteFile(filePath);
}

function getOsInfo(option) {
  switch (option) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      const cpuInfo = cpus();
      cpuInfo.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000}GHz`);
      });
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      console.error('Invalid input');
  }
  printCurrentDir();
}

function calculateHash(filePath) {
  const fullPath = resolve(currentDir, filePath);
  const hash = createHash('sha256');
  const stream = createReadStream(fullPath);

  stream.on('data', (chunk) => {
    hash.update(chunk);
  });

  stream.on('end', () => {
    console.log(hash.digest('hex'));
    printCurrentDir();
  });

  stream.on('error', () => {
    console.error('Operation failed');
  });
}

function compressFile(filePath, destPath) {
  const fullPath = resolve(currentDir, filePath);
  const destination = resolve(currentDir, destPath);

  const readStream = createReadStream(fullPath);
  const writeStream = createWriteStream(destination);
  const brotli = createBrotliCompress();

  readStream.pipe(brotli).pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('File compressed successfully');
    printCurrentDir();
  });

  readStream.on('error', () => {
    console.error('Operation failed');
  });
}

function decompressFile(filePath, destPath) {
  const fullPath = resolve(currentDir, filePath);
  const destination = resolve(currentDir, destPath);

  const readStream = createReadStream(fullPath);
  const writeStream = createWriteStream(destination);
  const brotli = createBrotliDecompress();

  readStream.pipe(brotli).pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('File decompressed successfully');
    printCurrentDir();
  });

  readStream.on('error', () => {
    console.error('Operation failed');
  });
}

rl.prompt();
rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'up':
      goUp();
      break;

    case 'cd':
      changeDirectory(args[0]);
      break;

    case 'ls':
      listFiles();
      break;

    case 'cat':
      readFile(args[0]);
      break;

    case 'add':
      addFile(args[0]);
      break;

    case 'rn':
      renameFile(args[0], args[1]);
      break;

    case 'rm':
      deleteFile(args[0]);
      break;

    case 'cp':
      copyFile(args[0], args[1]);
      break;

    case 'mv':
      moveFile(args[0], args[1]);
      break;

    case 'os':
      getOsInfo(args[0]);
      break;

    case 'hash':
      calculateHash(args[0]);
      break;

    case 'compress':
      compressFile(args[0], args[1]);
      break;

    case 'decompress':
      decompressFile(args[0], args[1]);
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
