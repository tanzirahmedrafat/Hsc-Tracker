import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create beautiful Brand SVG
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#0f172a" />
  <circle cx="256" cy="256" r="180" fill="#1e293b" stroke="#334155" stroke-width="8" />
  <!-- Academic Cap / Book Motif -->
  <path d="M256 140 L380 205 L256 270 L132 205 Z" fill="#991b1b" stroke="#f8fafc" stroke-width="6" stroke-linejoin="round" />
  <path d="M180 232 V310 C180 345 332 345 332 310 V232" fill="none" stroke="#f8fafc" stroke-width="12" stroke-linecap="round" />
  <path d="M380 205 V295" stroke="#fbbf24" stroke-width="8" stroke-linecap="round" />
  <circle cx="380" cy="305" r="8" fill="#fbbf24" />
  <!-- Bengali text HSC / Book -->
  <rect x="200" y="360" width="112" height="24" rx="12" fill="#991b1b" />
  <text x="256" y="377" font-family="sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">HSC TRACKER</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), svg, 'utf-8');

// Function to generate raw uncompressed RGBA PNG
function createPng(width, height) {
  // Simple PNG encoder using Node's zlib
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression method 0
  ihdr.writeUInt8(0, 11); // filter method 0
  ihdr.writeUInt8(0, 12); // interlace method 0

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data: height scanlines, each begins with filter byte 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.32;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded navy/dark slate
      let r = 15, g = 23, b = 42, a = 255; // #0f172a

      if (dist < innerRadius) {
        // Red accent center: #991b1b
        r = 153; g = 27; b = 27; a = 255;
      } else if (dist < radius) {
        // Slate ring
        r = 30; g = 41; b = 59; a = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buf = Buffer.alloc(8 + length + 4);
  buf.writeUInt32BE(length, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + length));
  buf.writeUInt32BE(crc, 8 + length);
  return buf;
}

// Standard CRC32 implementation
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = c ^ buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
    }
  }
  return (~c) >>> 0;
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180));

console.log('Icons generated successfully in public/');
