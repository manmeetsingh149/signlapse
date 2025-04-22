const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

// Configuration
const config = {
  // Directories
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images/optimized'),
  // Image settings
  sizes: {
    large: { width: 1920, height: 1080 },
    medium: { width: 1280, height: 720 },
    small: { width: 640, height: 360 },
  },
  // File formats and extensions
  formats: ['jpg', 'jpeg', 'png', 'webp'],
  // Quality settings
  quality: 75,
  // Enable/disable features
  createWebp: true,   // Also create WebP versions
  preserveOriginals: true,
};

// Create optimized directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Get all image files recursively
function getImageFiles() {
  const patterns = config.formats.map(format => `${config.inputDir}/**/*.${format}`);
  let files = [];
  
  patterns.forEach(pattern => {
    const matchedFiles = glob.sync(pattern);
    files = [...files, ...matchedFiles];
  });
  
  return files.filter(file => !file.includes('/optimized/')); // Skip already optimized images
}

async function optimizeImage(inputPath, size = 'large', format = 'jpeg') {
  try {
    const filename = path.basename(inputPath);
    const extension = path.extname(inputPath);
    const nameWithoutExt = filename.replace(extension, '');
    
    // Skip files that already have size indicators
    if (nameWithoutExt.includes('-small') || 
        nameWithoutExt.includes('-medium') || 
        nameWithoutExt.includes('-large')) {
      return;
    }
    
    const outputFilename = format === 'webp' 
      ? `${nameWithoutExt}-${size}.webp` 
      : `${nameWithoutExt}-${size}${extension}`;
    const outputPath = path.join(config.outputDir, outputFilename);
    
    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Skipped (already exists): ${outputFilename}`);
      return;
    }
    
    // Get dimensions based on size
    const { width, height } = config.sizes[size];
    
    // Process the image
    const pipeline = sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    
    // Format-specific settings
    if (format === 'jpeg' || format === 'jpg') {
      await pipeline
        .jpeg({
          quality: config.quality,
          progressive: true,
          mozjpeg: true,
        })
        .toFile(outputPath);
    } else if (format === 'png') {
      await pipeline
        .png({
          quality: config.quality,
          progressive: true,
          compressionLevel: 9,
        })
        .toFile(outputPath);
    } else if (format === 'webp') {
      await pipeline
        .webp({
          quality: config.quality,
          reductionEffort: 6,
        })
        .toFile(outputPath);
    }
    
    console.log(`Optimized: ${outputFilename}`);
  } catch (error) {
    console.error(`Error optimizing ${path.basename(inputPath)}:`, error);
  }
}

async function optimizeAll() {
  const files = getImageFiles();
  console.log(`Found ${files.length} images to optimize`);
  
  for (const file of files) {
    // Standard formats
    for (const size of Object.keys(config.sizes)) {
      await optimizeImage(file, size);
    }
    
    // Create WebP versions if enabled
    if (config.createWebp) {
      for (const size of Object.keys(config.sizes)) {
        await optimizeImage(file, size, 'webp');
      }
    }
  }
  
  console.log('Image optimization complete!');
}

// Run the optimization
optimizeAll().catch(err => {
  console.error('Optimization failed:', err);
  process.exit(1);
});