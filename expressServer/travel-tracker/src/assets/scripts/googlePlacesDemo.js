/**
 * Google Places Autocomplete Demo Script
 * 
 * This script can be run in the browser console to test the Google Places Autocomplete functionality.
 * Run this on the add-place page after the application is loaded.
 */

(function() {
  console.log('🚀 Running Google Places Autocomplete Demo');

  // Function to test if Google Maps API is loaded
  function checkGoogleMapsLoaded() {
    if (typeof google !== 'undefined' && google.maps) {
      console.log('✅ Google Maps API loaded successfully!');
      return true;
    } else {
      console.log('❌ Google Maps API not detected.');
      return false;
    }
  }

  // Function to test the autocomplete input
  function testAutocompleteInput() {
    const addressInput = document.getElementById('placeAddress');
    if (!addressInput) {
      console.log('❌ Address input field not found. Make sure you are on the Add Place page.');
      return;
    }

    console.log('✅ Found address input field');
    console.log('🔍 Simulating user typing "New York"...');
    
    // Set the value and trigger the input event
    addressInput.value = 'New York';
    addressInput.dispatchEvent(new Event('input', { bubbles: true }));
    addressInput.dispatchEvent(new Event('focus', { bubbles: true }));

    // Wait for the autocomplete dropdown to appear
    setTimeout(() => {
      const dropdown = document.querySelector('.autocomplete-dropdown');
      if (dropdown) {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        console.log(`✅ Autocomplete dropdown appeared with ${items.length} suggestions!`);
        
        if (items.length > 0) {
          console.log('🔍 Suggestions:');
          Array.from(items).forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.textContent.trim().replace(/\s+/g, ' ')}`);
          });
        }
      } else {
        console.log('❌ Autocomplete dropdown did not appear.');
      }
    }, 1000);
  }

  // Function to test keyboard navigation
  function testKeyboardNavigation() {
    const addressInput = document.getElementById('placeAddress');
    if (!addressInput) return;
    
    console.log('🔍 Testing keyboard navigation...');
    
    // Simulate down arrow key press
    setTimeout(() => {
      addressInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      
      // Check if the first item got selected
      setTimeout(() => {
        const activeItem = document.querySelector('.autocomplete-item.active');
        if (activeItem) {
          console.log('✅ Keyboard navigation works! Item selected:', activeItem.textContent.trim().replace(/\s+/g, ' '));
        } else {
          console.log('❌ Keyboard navigation not working properly.');
        }
        
        // Simulate selection with Enter
        setTimeout(() => {
          addressInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          
          // Check if the item was selected and dropdown disappeared
          setTimeout(() => {
            const dropdown = document.querySelector('.autocomplete-dropdown');
            if (!dropdown) {
              console.log('✅ Selection with Enter key works! Dropdown closed.');
              
              // Check if the address preview appears
              const preview = document.querySelector('.alert-success');
              if (preview) {
                console.log('✅ Address preview displayed:', preview.textContent.trim().replace(/\s+/g, ' '));
              } else {
                console.log('❌ Address preview not displayed after selection.');
              }
            } else {
              console.log('❌ Selection with Enter key not working properly.');
            }
          }, 500);
        }, 500);
      }, 500);
    }, 1500);
  }

  // Run the demo tests
  console.log('🔍 Step 1: Checking if Google Maps API is loaded...');
  if (checkGoogleMapsLoaded()) {
    console.log('🔍 Step 2: Testing autocomplete input field...');
    testAutocompleteInput();
    
    console.log('🔍 Step 3: Testing keyboard navigation (will run in 3 seconds)...');
    setTimeout(testKeyboardNavigation, 3000);
  } else {
    console.log('❗ Cannot proceed with tests - Google Maps API not loaded.');
    console.log('💡 Tips:');
    console.log('   1. Check if the API key is correctly set in the environment file');
    console.log('   2. Check browser console for API loading errors');
    console.log('   3. Make sure the Google Places API is enabled in your Google Cloud Console');
  }
})();
