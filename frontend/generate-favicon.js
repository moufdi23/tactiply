import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SIZE = 64;
const RADIUS = 12;

const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

// Clip to rounded square
ctx.beginPath();
ctx.moveTo(RADIUS, 0);
ctx.lineTo(SIZE - RADIUS, 0);
ctx.arcTo(SIZE, 0, SIZE, RADIUS, RADIUS);
ctx.lineTo(SIZE, SIZE - RADIUS);
ctx.arcTo(SIZE, SIZE, SIZE - RADIUS, SIZE, RADIUS);
ctx.lineTo(RADIUS, SIZE);
ctx.arcTo(0, SIZE, 0, SIZE - RADIUS, RADIUS);
ctx.lineTo(0, RADIUS);
ctx.arcTo(0, 0, RADIUS, 0, RADIUS);
ctx.closePath();
ctx.clip();

// Gradient background: top-left #059669 → bottom-right #047857
const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
gradient.addColorStop(0, '#059669');
gradient.addColorStop(1, '#047857');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, SIZE, SIZE);

// Zap icon: 16px on 36px container → scaled proportionally to 64px canvas
// 16/36 * 64 ≈ 28px icon size; SVG viewBox is 24x24
const ICON_SIZE = Math.round((16 / 36) * SIZE); // ~28px
const ICON_OFFSET = (SIZE - ICON_SIZE) / 2;
const SCALE = ICON_SIZE / 24;

ctx.save();
ctx.translate(ICON_OFFSET, ICON_OFFSET);
ctx.scale(SCALE, SCALE);

// Zap SVG path: M13 2L3 14h9l-1 8 10-12h-9l1-8z (24x24 viewBox)
// Parsed points:
//   M(13,2) → L(3,14) → h9→(12,14) → l(-1,8)→(11,22)
//   → l(10,-12)→(21,10) → h(-9)→(12,10) → l(1,-8)→(13,2) → z
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.moveTo(13, 2);
ctx.lineTo(3, 14);
ctx.lineTo(12, 14);
ctx.lineTo(11, 22);
ctx.lineTo(21, 10);
ctx.lineTo(12, 10);
ctx.lineTo(13, 2);
ctx.closePath();
ctx.fill();

ctx.restore();

const outputPath = join(__dirname, 'public', 'favicon.png');
writeFileSync(outputPath, canvas.toBuffer('image/png'));
console.log(`Favicon saved to ${outputPath}`);
