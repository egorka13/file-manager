import { resolve, basename } from 'path';
import {
  createReadStream,
  createWriteStream,
  unlink,
  writeFile,
  rename,
} from 'fs';

function addFile(currentDir, fileName, callback) {
  const fullPath = resolve(currentDir, fileName);
  writeFile(fullPath, '', (err) => {
    if (err) {
      callback('Operation failed');
    } else {
      callback(null, `${fileName} created successfully`);
    }
  });
}

function renameFile(currentDir, oldPath, newFileName, callback) {
  const oldFullPath = resolve(currentDir, oldPath);
  const newFullPath = resolve(currentDir, newFileName);

  rename(oldFullPath, newFullPath, (err) => {
    if (err) {
      callback('Operation failed');
    } else {
      callback(null, `File renamed to ${newFileName}`);
    }
  });
}

function deleteFile(currentDir, filePath, callback) {
  const fullPath = resolve(currentDir, filePath);
  unlink(fullPath, (err) => {
    if (err) {
      callback('Operation failed');
    } else {
      callback(null, `File ${filePath} deleted successfully`);
    }
  });
}

function copyFile(currentDir, filePath, destDir, callback) {
  const srcPath = resolve(currentDir, filePath);
  const destPath = resolve(currentDir, destDir, basename(filePath));

  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(destPath);

  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    callback(null, `File copied to ${destPath}`);
  });

  readStream.on('error', () => {
    callback('Operation failed');
  });
}

function moveFile(currentDir, filePath, destDir, callback) {
  copyFile(currentDir, filePath, destDir, callback);
  deleteFile(currentDir, filePath, callback);
}

export { addFile, renameFile, deleteFile, copyFile, moveFile };
