// Script to generate PNG icons from SVG for PWA
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Sunset-themed icon SVG - circular with gradient
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#c4c8d8"/>
      <stop offset="30%" style="stop-color:#d4c0b8"/>
      <stop offset="65%" style="stop-color:#f0c8a0"/>
      <stop offset="100%" style="stop-color:#e89868"/>
    </linearGradient>
    <linearGradient id="circle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.15)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.0)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>

  <!-- Subtle overlay for depth -->
  <rect width="512" height="512" rx="115" fill="url(#circle)"/>

  <!-- Central ring / knob motif -->
  <circle cx="256" cy="256" r="130" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <circle cx="256" cy="256" r="100" fill="rgba(255,255,255,0.12)"/>
  <circle cx="256" cy="256" r="100" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

  <!-- Indicator dot at top (like the knob pointer) -->
  <circle cx="256" cy="148" r="10" fill="rgba(255,255,255,0.9)"/>

  <!-- Tick marks around ring -->
  <g stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round">
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(-120 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(-90 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(-60 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(-30 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(0 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(30 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(60 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(90 256 256)"/>
    <line x1="256" y1="118" x2="256" y2="108" transform="rotate(120 256 256)"/>
  </g>

  <!-- "5000" label -->
  <text x="256" y="272" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="52" font-weight="600" fill="rgba(255,255,255,0.9)"
        letter-spacing="-1">5000</text>

  <!-- Small subtitle -->
  <text x="256" y="310" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="18" font-weight="400" fill="rgba(255,255,255,0.6)"
        letter-spacing="3">WELLNESS</text>
</svg>
`;

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32,  name: 'favicon-32x32.png' },
];

const publicDir = join(__dirname, 'public');
mkdirSync(publicDir, { recursive: true });

for (const { size, name } of sizes) {
  const svg = iconSvg.replace('width="512" height="512"', `width="${size}" height="${size}"`);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  });
  const png = resvg.render().asPng();
  writeFileSync(join(publicDir, name), png);
  console.log(`Generated ${name} (${size}x${size})`);
}

console.log('All icons generated!');
