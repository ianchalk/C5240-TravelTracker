/**
 * Test script for Google Places Autocomplete integration in Travel Tracker
 * 
 * Instructions:
 * 1. Make sure the Angular app is running at http://localhost:4200
 * 2. Copy this entire script
 * 3. Navigate to the add-place page in your browser
 * 4. Open browser's developer tools (F12 or Ctrl+Shift+I)
 * 5. Paste and run this script in the console
 */

(function() {
    const startTime = new Date();
    console.log(`%c🔍 Testing Google Places Autocomplete Integration`, 'font-size:18px;color:#4CAF50');
    console.log(`Test started at ${startTime.toLocaleTimeString()}`);

    // Test 1: Check if Google Maps API is loaded
    const testGoogleMapsAPI = () => {
        console.log(`\n%c📋 Test 1: Google Maps API Loading`, 'font-weight:bold;color:#2196F3');
        
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            console.log(`%c✅ Google Maps API loaded successfully`, 'color:green');
            return true;
        } else {
            console.log(`%c❌ Google Maps API not loaded`, 'color:red');
            console.log(`🔧 Possible causes:
            - API key not set in environment.ts
            - Google Maps API script not loaded in index.html
            - Network error loading the script`);
            return false;
        }
    };

    // Test 2: Check if address input field exists
    const testAddressField = () => {
        console.log(`\n%c📋 Test 2: Address Input Field`, 'font-weight:bold;color:#2196F3');
        
        const addressField = document.getElementById('placeAddress');
        if (addressField) {
            console.log(`%c✅ Address input field found with id="placeAddress"`, 'color:green');
            return true;
        } else {
            console.log(`%c❌ Address input field not found`, 'color:red');
            console.log(`🔧 Make sure you're on the add-place page and the field has id="placeAddress"`);
            return false;
        }
    };

    // Test 3: Test component services
    const testComponentServices = () => {
        console.log(`\n%c📋 Test 3: Component and Services`, 'font-weight:bold;color:#2196F3');
        
        // Find Angular component instance
        const appElement = document.querySelector('app-add-place');
        if (!appElement) {
            console.log(`%c❌ Could not find app-add-place element`, 'color:red');
            return false;
        }
        
        const ngComponent = ng.getComponent(appElement);
        if (!ngComponent) {
            console.log(`%c❌ Could not access Angular component`, 'color:red');
            console.log(`🔧 Try using ng.getComponent(document.querySelector('app-add-place'))`);
            return false;
        }
        
        // Check for placesService
        if (ngComponent.placesService) {
            console.log(`%c✅ GooglePlacesAutocompleteService injected into component`, 'color:green');
        } else {
            console.log(`%c❌ GooglePlacesAutocompleteService not found in component`, 'color:red');
            return false;
        }
        
        return true;
    };

    // Test 4: Simulate autocomplete interaction
    const testAutocompleteInteraction = () => {
        console.log(`\n%c📋 Test 4: Autocomplete Interaction`, 'font-weight:bold;color:#2196F3');
        
        const addressField = document.getElementById('placeAddress');
        if (!addressField) return false;
        
        // Focus the field
        addressField.focus();
        console.log(`%c✅ Address field focused`, 'color:green');
        
        // Type a search term
        addressField.value = 'New York';
        addressField.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`%c✅ Typed "New York" in the field`, 'color:green');
        
        // Wait for autocomplete to appear
        console.log(`👀 Waiting for autocomplete dropdown to appear...`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                const dropdown = document.querySelector('.autocomplete-dropdown');
                if (dropdown) {
                    console.log(`%c✅ Autocomplete dropdown appeared`, 'color:green');
                    
                    const items = dropdown.querySelectorAll('.autocomplete-item');
                    console.log(`Found ${items.length} suggestions:`);
                    
                    Array.from(items).forEach((item, i) => {
                        const mainText = item.querySelector('.fw-bold')?.textContent.trim();
                        const secondaryText = item.querySelector('.text-muted')?.textContent.trim();
                        console.log(`   ${i+1}. ${mainText} (${secondaryText})`);
                    });
                    
                    resolve(true);
                } else {
                    console.log(`%c❌ Autocomplete dropdown did not appear`, 'color:red');
                    console.log(`🔧 Possible issues:
                    - onAddressInput event handler not triggered
                    - Google Places API request failed
                    - No results returned for the query
                    - CSS classes for dropdown not applied`);
                    resolve(false);
                }
            }, 2000);
        });
    };

    // Test 5: Test keyboard navigation
    const testKeyboardNavigation = async () => {
        console.log(`\n%c📋 Test 5: Keyboard Navigation`, 'font-weight:bold;color:#2196F3');
        
        const addressField = document.getElementById('placeAddress');
        if (!addressField) return false;
        
        // Press down arrow
        addressField.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        console.log(`%c✅ Pressed Down Arrow key`, 'color:green');
        
        // Wait for item to be selected
        return new Promise(resolve => {
            setTimeout(() => {
                const activeItem = document.querySelector('.autocomplete-item.active');
                if (activeItem) {
                    console.log(`%c✅ Item selected via keyboard navigation`, 'color:green');
                    
                    // Press Enter to select
                    addressField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    console.log(`%c✅ Pressed Enter key to select item`, 'color:green');
                    
                    // Check if item was selected
                    setTimeout(() => {
                        const preview = document.querySelector('.alert-success');
                        if (preview) {
                            console.log(`%c✅ Selected address preview appeared`, 'color:green');
                            console.log(`Selected address: ${preview.textContent.trim()}`);
                            resolve(true);
                        } else {
                            console.log(`%c❌ Address preview not shown after selection`, 'color:red');
                            resolve(false);
                        }
                    }, 1000);
                } else {
                    console.log(`%c❌ Keyboard navigation not working`, 'color:red');
                    resolve(false);
                }
            }, 1000);
        });
    };

    // Run all tests
    const runTests = async () => {
        let success = true;
        
        success = testGoogleMapsAPI() && success;
        success = testAddressField() && success;
        
        try {
            success = testComponentServices() && success;
            success = await testAutocompleteInteraction() && success;
            success = await testKeyboardNavigation() && success;
        } catch (error) {
            console.error(`%c❌ Error during tests:`, 'color:red', error);
            success = false;
        }
        
        // Display final results
        const endTime = new Date();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`\n${'-'.repeat(50)}`);
        console.log(`%c${success ? '✅ ALL TESTS COMPLETED SUCCESSFULLY' : '❌ SOME TESTS FAILED'}`, 
                   `font-size:16px;color:${success ? 'green' : 'red'};font-weight:bold`);
        console.log(`Test finished at ${endTime.toLocaleTimeString()} (duration: ${duration}s)`);
        
        if (!success) {
            console.log(`\n🔧 Troubleshooting Tips:
            1. Check browser console for any errors
            2. Verify API key is set correctly in environment.ts
            3. Make sure all event handlers are properly registered
            4. Check component initialization sequence
            5. Verify CSS selectors match the actual DOM`);
        }
    };

    // Start tests
    runTests();
})();
