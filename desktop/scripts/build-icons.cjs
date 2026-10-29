// Rasterize assets/icon.svg into desktop/assets/icon.png and a multi-size icon.ico using
// Electron's own renderer. Run: npx electron scripts/build-icons.cjs (from desktop/).
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const SVG = path.join(__dirname, '..', '..', 'assets', 'icon.svg');
const OUT = path.join(__dirname, '..', 'assets');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
  await win.loadURL('about:blank');
  const svg = fs.readFileSync(SVG, 'utf8');
  const frames = [];
  for (const size of [16, 24, 32, 48, 64, 128, 256, 512]) {
    const data = await win.webContents.executeJavaScript(`(async () => {
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(${JSON.stringify(svg)});
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = ${size};
      canvas.getContext('2d').drawImage(image, 0, 0, ${size}, ${size});
      return canvas.toDataURL('image/png').split(',')[1];
    })()`);
    const buffer = Buffer.from(data, 'base64');
    if (size === 512) fs.writeFileSync(path.join(OUT, 'icon.png'), buffer);
    else frames.push({ size, buffer });
  }
  const head = Buffer.alloc(6 + 16 * frames.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(frames.length, 4);
  let offset = head.length;
  frames.forEach(({ size, buffer }, i) => {
    const entry = 6 + i * 16;
    head[entry] = head[entry + 1] = size === 256 ? 0 : size;
    head.writeUInt16LE(1, entry + 4);
    head.writeUInt16LE(32, entry + 6);
    head.writeUInt32LE(buffer.length, entry + 8);
    head.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });
  fs.writeFileSync(path.join(OUT, 'icon.ico'), Buffer.concat([head, ...frames.map((f) => f.buffer)]));
  console.log('wrote icon.png and icon.ico');
  app.quit();
});
