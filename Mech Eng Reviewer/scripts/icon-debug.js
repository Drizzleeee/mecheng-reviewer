// Debug icon loading
document.addEventListener('DOMContentLoaded', function() {
  console.log('Checking icon configurations...');
  
  // Check if apple-touch-icon.png exists
  const appleIconTest = new Image();
  appleIconTest.onload = () => console.log('✅ apple-touch-icon.png loaded successfully');
  appleIconTest.onerror = () => console.error('❌ apple-touch-icon.png failed to load - please ensure this file exists in your images folder');
  appleIconTest.src = '/images/apple-touch-icon.png';
  
  // Check manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    console.log('Manifest link found:', manifestLink.href);
    fetch(manifestLink.href)
      .then(response => response.json())
      .then(data => {
        console.log('Manifest loaded:', data);
        if (data.icons) {
          console.log('Icons in manifest:', data.icons.length);
          data.icons.forEach((icon, index) => {
            console.log(`Icon ${index+1}:`, icon.src, icon.sizes, icon.type);
            // Test if icon loads
            const img = new Image();
            img.onload = () => console.log(`✅ Icon loaded: ${icon.src}`);
            img.onerror = () => console.log(`❌ Icon failed to load: ${icon.src}`);
            img.src = icon.src;
          });
        }
      })
      .catch(error => console.error('Error loading manifest:', error));
  } else {
    console.error('No manifest link found');
  }
  
  // Check Apple touch icons
  const appleIcons = document.querySelectorAll('link[rel="apple-touch-icon"]');
  console.log('Apple touch icons found:', appleIcons.length);
  appleIcons.forEach((icon, index) => {
    console.log(`Apple icon ${index+1}:`, icon.href, icon.sizes);
    // Test if icon loads
    const img = new Image();
    img.onload = () => console.log(`✅ Apple icon loaded: ${icon.href}`);
    img.onerror = () => console.log(`❌ Apple icon failed to load: ${icon.href}`);
    img.src = icon.href;
  });
});
