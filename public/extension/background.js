// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openVideoPlayer') {
    // Create a popup window with the video player
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 640,
      height: 360,
      focused: true
    });
  } else if (message.action === 'startServer') {
    // Start the Flask server
    chrome.runtime.sendNativeMessage('com.signapse.server', { action: 'start' }, function(response) {
      if (response && response.success) {
        // Server started successfully
        if (message.callback) {
          message.callback();
        }
      } else {
        console.error('Failed to start server:', response);
      }
    });
  }
}); 