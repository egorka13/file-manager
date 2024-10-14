import { resolve } from 'path';
import { createReadStream, readdir, stat } from 'fs';

function listFiles(currentDir, callback) {
  readdir(currentDir, (err, files) => {
    if (err) {
      callback('Operation failed');
      return;
    }

    const fileDetails = [];

    let pending = files.length;
    if (!pending) {
      callback(null, fileDetails);
      return;
    }

    files.forEach((file) => {
      const fullPath = resolve(currentDir, file);
      stat(fullPath, (err, stats) => {
        if (err) {
          callback('Operation failed');
          return;
        }

        const type = stats.isDirectory() ? 'directory' : 'file';
        fileDetails.push({ Name: file, Type: type });

        if (!--pending) {
          fileDetails.sort((a, b) => a.Type.localeCompare(b.Type));

          callback(null, fileDetails);
        }
      });
    });
  });
}

function readFile(currentDir, filePath, callback) {
  const fullPath = resolve(currentDir, filePath);
  const stream = createReadStream(fullPath, { encoding: 'utf-8' });

  stream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  stream.on('error', () => {
    callback('Operation failed');
  });

  stream.on('end', () => {
    callback(null);
  });
}

export { listFiles, readFile };
