// Listen for clicks on buttons
document.addEventListener('click', function(event) {
  // Check if the clicked element has the class 'get-extension-button'
  if (event.target.matches('.get-extension-button')) {
    // Send message to background script to open video player
    chrome.runtime.sendMessage({ action: 'openVideoPlayer' });
  }
  
  // Check if the clicked element has the class 'audio-translation-button'
  if (event.target.matches('.audio-translation-button')) {
    // Send message to start the Flask server
    chrome.runtime.sendMessage({ 
      action: 'startServer',
      callback: function() {
        // After server starts, redirect to the 3D model page
        window.location.href = 'http://localhost:5000';
      }
    });
  }
}); 