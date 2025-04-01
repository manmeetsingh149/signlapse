const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = ['slide1.jpg', 'slide2.jpg'];
const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 75,
        progressive: true
      })
      .toFile(outputPath);
    console.log(`Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`Error optimizing ${path.basename(inputPath)}:`, error);
  }
}

async function optimizeAll() {
  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const outputPath = path.join(outputDir, image);
    await optimizeImage(inputPath, outputPath);
  }
}

optimizeAll(); 