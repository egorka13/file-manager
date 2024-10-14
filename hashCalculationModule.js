import { resolve } from 'path';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';

function calculateHash(currentDir, filePath, callback) {
  const fullPath = resolve(currentDir, filePath);
  const hash = createHash('sha256');
  const stream = createReadStream(fullPath);

  stream.on('data', (chunk) => {
    hash.update(chunk);
  });

  stream.on('end', () => {
    const hashValue = hash.digest('hex');
    callback(null, `SHA256 hash: ${hashValue}`);
  });

  stream.on('error', () => {
    callback('Operation failed');
  });
}

export { calculateHash };
