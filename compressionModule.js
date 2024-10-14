import { resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

function compressFile(currentDir, filePath, destPath, callback) {
  const fullPath = resolve(currentDir, filePath);
  const destination = resolve(currentDir, destPath);

  const readStream = createReadStream(fullPath);
  const writeStream = createWriteStream(destination);
  const brotli = createBrotliCompress();

  readStream.pipe(brotli).pipe(writeStream);

  writeStream.on('finish', () => {
    callback(null, 'File compressed successfully');
  });

  readStream.on('error', () => {
    callback('Operation failed');
  });
}

function decompressFile(currentDir, filePath, destPath) {
  const fullPath = resolve(currentDir, filePath);
  const destination = resolve(currentDir, destPath);

  const readStream = createReadStream(fullPath);
  const writeStream = createWriteStream(destination);
  const brotli = createBrotliDecompress();

  readStream.pipe(brotli).pipe(writeStream);

  writeStream.on('finish', () => {
    callback(null, 'File decompressed successfully');
  });

  readStream.on('error', () => {
    callback('Operation failed');
  });
}

export { compressFile, decompressFile };
