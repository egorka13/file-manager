import { resolve, dirname } from 'path';
import { stat } from 'fs';

function changeDirectory(currentDir, newDir, callback) {
  const targetDir = resolve(currentDir, newDir);
  stat(targetDir, (err, stats) => {
    if (err || !stats.isDirectory()) {
      callback('Operation failed');
    } else {
      callback(null, targetDir);
    }
  });
}

function goUp(currentDir, callback) {
  const parentDir = dirname(currentDir);
  if (parentDir === currentDir) {
    callback('Operation failed');
  } else {
    callback(null, parentDir);
  }
}

export { changeDirectory, goUp };
