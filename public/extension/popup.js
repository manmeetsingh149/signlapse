// Get DOM elements
const dragHandle = document.getElementById('dragHandle');
const closeButton = document.getElementById('closeButton');
const videoElement = document.getElementById('videoElement');
const placeholderContent = document.getElementById('placeholderContent');
const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const controls = document.getElementById('controls');
const playPauseButton = document.getElementById('playPauseButton');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');

// Show video immediately
videoElement.style.display = 'block';
placeholderContent.style.display = 'none';
controls.style.display = 'flex';

// Make the popup draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;

// Get the window object
const win = chrome.windows ? chrome : window;

dragHandle.addEventListener('mousedown', e => {
  isDragging = true;
  initialX = e.clientX;
  initialY = e.clientY;

  // Get current window position
  if (chrome.windows) {
    chrome.windows.getCurrent(window => {
      currentX = window.left;
      currentY = window.top;
    });
  }
});

document.addEventListener('mousemove', e => {
  if (isDragging) {
    e.preventDefault();
    
    const dx = e.clientX - initialX;
    const dy = e.clientY - initialY;

    if (chrome.windows) {
      chrome.windows.getCurrent(window => {
        chrome.windows.update(window.id, {
          left: currentX + dx,
          top: currentY + dy
        });
      });
    }
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Handle video upload
uploadButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.style.display = 'block';
    placeholderContent.style.display = 'none';
    controls.style.display = 'flex';
    videoElement.play();
    updatePlayPauseButton();
  }
});

// Handle video controls
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updatePlayPauseButton() {
  playPauseButton.innerHTML = videoElement.paused ? 
    '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' :
    '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
}

playPauseButton.addEventListener('click', () => {
  if (videoElement.paused) {
    videoElement.play();
  } else {
    videoElement.pause();
  }
  updatePlayPauseButton();
});

videoElement.addEventListener('timeupdate', () => {
  const percent = (videoElement.currentTime / videoElement.duration) * 100;
  progress.style.width = percent + '%';
  timestamp.textContent = `${formatTime(videoElement.currentTime)} / ${formatTime(videoElement.duration)}`;
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  videoElement.currentTime = pos * videoElement.duration;
});

// Add close functionality
closeButton.addEventListener('click', () => {
  window.close();
}); 