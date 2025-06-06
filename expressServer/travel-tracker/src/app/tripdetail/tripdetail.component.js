"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripDetailComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var address_model_1 = require("../models/address.model");
var interactive_map_component_1 = require("../interactive-map.component");
var environment_1 = require("../../environments/environment");
var TripDetailComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-tripdetail',
            standalone: true,
            imports: [common_1.CommonModule, common_1.DatePipe, router_1.RouterModule, http_1.HttpClientModule, interactive_map_component_1.InteractiveMapComponent],
            templateUrl: './tripdetail.component.html',
            styleUrls: ['./tripdetail.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripDetailComponent = _classThis = /** @class */ (function () {
        function TripDetailComponent_1(route, router, tripProxy, http) {
            this.route = route;
            this.router = router;
            this.tripProxy = tripProxy;
            this.http = http;
            this.trip = {
                id: '',
                name: '',
                date: '',
                amountSpent: 0,
                endDate: '',
                places: []
            };
            this.selectedPlaceIndex = 0;
            this.loading = true;
            this.error = false;
            this.errorMessage = '';
            this.isPhotoGalleryExpanded = false;
            // Permission system
            this.canEdit = false;
            this.navigationSource = 'public'; // 'public' or 'personal'
            this.isUploadingPhotos = false;
            // Google Maps API Key from environment
            this.googleMapsApiKey = environment_1.environment.googleMapsApiKey;
        }
        TripDetailComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            // Get trip ID from route parameter and listen for changes
            // This handles initial load and direct navigation with param changes.
            this.route.paramMap.subscribe(function (params) {
                var id = params.get('id');
                if (id) {
                    console.log('paramMap subscription triggered for ID:', id);
                    _this.fetchTripDetails(id);
                }
            });
            // Check query parameters for navigation source and set permissions
            this.route.queryParams.subscribe(function (queryParams) {
                _this.navigationSource = queryParams['source'] || 'public';
                _this.canEdit = _this.navigationSource === 'personal';
                console.log('Navigation source:', _this.navigationSource, '| Can edit:', _this.canEdit);
                // Handle refresh parameter if present
                if (queryParams['refresh']) {
                    var id = _this.route.snapshot.paramMap.get('id');
                    if (id) {
                        console.log('Refresh query parameter detected, forcing refresh for trip ID:', id);
                        _this.fetchTripDetails(id);
                        // Remove the refresh query param to avoid re-refresh on browser back/forward or page reload.
                        _this.router.navigate([], {
                            relativeTo: _this.route,
                            queryParams: { refresh: null, source: _this.navigationSource },
                            queryParamsHandling: 'merge', // Preserve other query params, if any
                            replaceUrl: true // Avoid adding this navigation to browser history
                        });
                    }
                }
            });
            // Subscribe to navigation events to refresh data, e.g., when returning from add-place
            this.navigationSubscription = this.router.events
                .pipe((0, operators_1.filter)(function (event) { return event instanceof router_1.NavigationEnd; }))
                .subscribe(function (navEvent) {
                var currentUrl = navEvent.urlAfterRedirects || navEvent.url;
                // Regex to match /tripdetail/:id (e.g., /tripdetail/123, /tripdetail/abc-def)
                // and not /tripdetail/:id/subpath (e.g., /tripdetail/123/add-place)
                var tripDetailBaseRoutePattern = /^\/tripdetail\/[^/?]+(\?.*)?$/;
                if (tripDetailBaseRoutePattern.test(currentUrl)) {
                    var urlSegments = currentUrl.split('?')[0].split('/');
                    var tripIdFromUrl = urlSegments[urlSegments.length - 1]; // Last segment is the ID
                    console.log('NavigationEnd: Detected navigation to trip detail base route:', currentUrl);
                    console.log('Attempting to refresh with ID from URL:', tripIdFromUrl);
                    // Potentially add a check here if tripIdFromUrl is the same as this.trip.id and data was recently fetched
                    // to avoid redundant calls, but for now, explicit refresh is safer.
                    _this.fetchTripDetails(tripIdFromUrl);
                }
            });
        };
        TripDetailComponent_1.prototype.ngOnDestroy = function () {
            // Clean up subscription
            if (this.navigationSubscription) {
                this.navigationSubscription.unsubscribe();
            }
        };
        // Add method to refresh trip data (useful when returning from add-place)
        TripDetailComponent_1.prototype.refreshTripData = function () {
            var id = this.route.snapshot.paramMap.get('id');
            if (id) {
                console.log('Manual refresh triggered for trip ID:', id);
                // Reset loading state
                this.loading = true;
                this.error = false;
                this.fetchTripDetails(id);
            }
        };
        TripDetailComponent_1.prototype.fetchTripDetails = function (tripId) {
            var _this = this;
            this.loading = true;
            this.error = false;
            console.log('=== STARTING fetchTripDetails ===');
            console.log('Received tripId parameter:', tripId);
            // Fetch the trip directly by ID (works for both public and private trips)
            this.tripProxy.getTripById(tripId).subscribe({
                next: function (tripData) {
                    console.log('Trip data received:', tripData);
                    console.log('Trip _id:', tripData._id);
                    console.log('Trip tripId:', tripData.tripId);
                    console.log('Trip id:', tripData.id);
                    // Initialize trip with basic data
                    _this.trip.id = tripId;
                    _this.trip.name = tripData.name || 'Unnamed Trip';
                    _this.trip.amountSpent = tripData.amount_spent || 0;
                    // Use tripId for locations lookup (this is the key field in the backend)
                    var locationLookupId = tripData.tripId || tripId;
                    console.log('Using ID for locations lookup:', locationLookupId);
                    // Now fetch the locations (places) for this trip
                    _this.fetchTripLocations(locationLookupId);
                },
                error: function (error) {
                    console.error('Error fetching trip details:', error);
                    _this.error = true;
                    _this.loading = false;
                    _this.errorMessage = 'Failed to load trip details from server';
                }
            });
        };
        TripDetailComponent_1.prototype.fetchTripLocations = function (tripId) {
            var _this = this;
            console.log('=== STARTING fetchTripLocations ===');
            console.log('Looking up locations for tripId:', tripId);
            // console.log('Expected URL:', 'http://localhost:8080/trip/' + tripId + '/locations'); // Original console log
            // Let's also test direct HTTP call to compare
            // this.http.get('http://localhost:8080/trip/' + tripId + '/locations').subscribe({ // Original HTTP test
            //   next: (directData: any) => {
            //     console.log('=== DIRECT HTTP TEST ===');
            //     console.log('Direct HTTP call success:', directData);
            //     console.log('Direct data has locations:', directData && directData.locations);
            //     console.log('Direct locations count:', directData && directData.locations ? directData.locations.length : 0);
            //   },
            //   error: (directError) => {
            //     console.log('=== DIRECT HTTP TEST ERROR ===');
            //     console.error('Direct HTTP call failed:', directError);
            //   }
            // });
            console.log('[fetchTripLocations] About to call tripProxy.getItems for tripId:', tripId);
            this.tripProxy.getItems(tripId).subscribe({
                next: function (locationData) {
                    console.log('=== LOCATION API RESPONSE ===');
                    console.log('Raw location data received from service:', JSON.stringify(locationData)); // Log entire raw data
                    if (locationData && locationData.locations) {
                        console.log('[fetchTripLocations] Received locations array from service:', JSON.stringify(locationData.locations));
                        console.log('[fetchTripLocations] Number of locations received:', locationData.locations.length);
                    }
                    else {
                        console.log('[fetchTripLocations] No "locations" property found in service response or it is empty.');
                    }
                    if (locationData && locationData.locations && locationData.locations.length > 0) {
                        // Don't calculate dates here - let the getCalculatedStartDate/EndDate functions handle it
                        // Just set default values for now
                        _this.trip.date = new Date().toISOString().split('T')[0];
                        _this.trip.endDate = new Date().toISOString().split('T')[0];
                        var previousPlacesCount = _this.trip.places ? _this.trip.places.length : 0;
                        // Map location data to Place objects
                        _this.trip.places = locationData.locations.map(function (location, index) {
                            console.log("[DEBUG] Location ".concat(index, ":"), {
                                name: location.name,
                                address: location.address,
                                location: location.location,
                                description: location.description,
                                startDate: location.startDate,
                                endDate: location.endDate,
                                dates: location.dates,
                                cost: location.cost,
                                notes: location.notes
                            });
                            // Handle legacy dates array format or new startDate/endDate format
                            var startDate = '';
                            var endDate = '';
                            if (location.startDate && location.endDate) {
                                // New format
                                startDate = location.startDate;
                                endDate = location.endDate;
                            }
                            else if (location.dates && Array.isArray(location.dates) && location.dates.length >= 2) {
                                // Legacy format - first date is start, last date is end
                                startDate = location.dates[0];
                                endDate = location.dates[location.dates.length - 1];
                            }
                            else if (location.dates && Array.isArray(location.dates) && location.dates.length === 1) {
                                // Single date - use as both start and end
                                startDate = location.dates[0];
                                endDate = location.dates[0];
                            }
                            return {
                                name: location.name || 'Unnamed Location',
                                notes: location.notes || location.description || '',
                                pictures: location.photos || [],
                                location: typeof location.address === 'string' ? location.address : (location.location || ''),
                                address: location.address || location.location || '',
                                startDate: startDate,
                                endDate: endDate,
                                description: location.description || location.notes || '',
                                cost: location.cost || location.price || 0
                            };
                        });
                        console.log('[fetchTripLocations] Mapped this.trip.places. New count:', _this.trip.places.length, '. Previous count:', previousPlacesCount);
                        console.log('[fetchTripLocations] Updated this.trip.places content:', JSON.stringify(_this.trip.places));
                    }
                    else {
                        // If no locations, set default values
                        console.log('[fetchTripLocations] No locations found in data or data.locations is empty. Resetting this.trip.places.');
                        _this.trip.date = new Date().toISOString().split('T')[0];
                        _this.trip.endDate = new Date().toISOString().split('T')[0];
                        _this.trip.places = [];
                        console.log('[fetchTripLocations] this.trip.places is now empty.');
                    }
                    // Reset selectedPlaceIndex to ensure carousel updates correctly
                    if (_this.trip.places.length > 0) {
                        _this.selectedPlaceIndex = 0;
                        console.log('[fetchTripLocations] Reset selectedPlaceIndex to 0 as places are available.');
                    }
                    else {
                        _this.selectedPlaceIndex = 0; // Or -1 if preferred for no selection state
                        console.log('[fetchTripLocations] Reset selectedPlaceIndex to 0 (no places).');
                    }
                    _this.loading = false;
                    console.log('[fetchTripLocations] Loading set to false.');
                    // Debug the places data
                    _this.debugPlacesDates();
                },
                error: function (err) {
                    console.log('=== LOCATION API ERROR ===');
                    console.error('Error fetching location details:', err);
                    console.error('Error status:', err.status);
                    console.error('Error statusText:', err.statusText);
                    console.error('Error message:', err.message);
                    console.error('Full error object:', err);
                    // Keep the basic trip data but mark that we had an error with locations
                    _this.error = true;
                    _this.loading = false;
                }
            });
        };
        TripDetailComponent_1.prototype.selectPlace = function (index) {
            this.selectedPlaceIndex = index;
        };
        TripDetailComponent_1.prototype.navigateBack = function () {
            // Navigate back to the appropriate page based on navigation source
            if (this.navigationSource === 'personal') {
                this.router.navigate(['/your-trips']);
            }
            else {
                this.router.navigate(['/trips']);
            }
        };
        TripDetailComponent_1.prototype.navigateToAddPlace = function () {
            // Only allow navigation to add place if user has edit permissions
            if (!this.canEdit) {
                alert('You do not have permission to add places to this trip.');
                return;
            }
            this.router.navigate(['/tripdetail', this.trip.id, 'add-place']);
        };
        TripDetailComponent_1.prototype.deleteCurrentPlace = function () {
            var _this = this;
            // Check permissions first
            if (!this.canEdit) {
                alert('You do not have permission to delete places from this trip.');
                return;
            }
            if (!this.trip.places || this.trip.places.length === 0) {
                alert('No places to delete.');
                return;
            }
            var currentPlace = this.trip.places[this.selectedPlaceIndex];
            if (!currentPlace) {
                alert('No place selected to delete.');
                return;
            }
            // Confirm deletion
            if (!confirm("Are you sure you want to delete \"".concat(currentPlace.name, "\"?"))) {
                return;
            }
            // Call the service to delete the place
            this.tripProxy.deleteLocation(this.trip.id, this.selectedPlaceIndex).subscribe({
                next: function (response) {
                    console.log('Place deleted successfully:', response);
                    // Remove the place from the local array
                    _this.trip.places.splice(_this.selectedPlaceIndex, 1);
                    // Adjust selectedPlaceIndex if necessary
                    if (_this.selectedPlaceIndex >= _this.trip.places.length && _this.trip.places.length > 0) {
                        _this.selectedPlaceIndex = _this.trip.places.length - 1;
                    }
                    else if (_this.trip.places.length === 0) {
                        _this.selectedPlaceIndex = 0;
                    }
                    // Show success message
                    alert('Place deleted successfully!');
                },
                error: function (error) {
                    console.error('Error deleting place:', error);
                    alert('Failed to delete place. Please try again.');
                }
            });
        };
        TripDetailComponent_1.prototype.togglePhotoGallery = function () {
            // Always allow toggling regardless of photo count
            this.isPhotoGalleryExpanded = !this.isPhotoGalleryExpanded;
        };
        TripDetailComponent_1.prototype.calculateDuration = function () {
            if (!this.trip || !this.trip.date || !this.trip.endDate) {
                return 0;
            }
            var startDate = new Date(this.trip.date);
            var endDate = new Date(this.trip.endDate);
            var diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        };
        // Debug function to see what data we have
        TripDetailComponent_1.prototype.debugPlacesDates = function () {
            console.log('=== DEBUG PLACES DATES ===');
            console.log('trip.places:', this.trip.places);
            if (this.trip.places) {
                this.trip.places.forEach(function (place, index) {
                    console.log("Place ".concat(index, ":"), {
                        name: place.name,
                        startDate: place.startDate,
                        endDate: place.endDate,
                        startDateType: typeof place.startDate,
                        endDateType: typeof place.endDate
                    });
                });
            }
            console.log('Original trip.date:', this.trip.date);
            console.log('Original trip.endDate:', this.trip.endDate);
            console.log('Calculated start date:', this.getCalculatedStartDate());
            console.log('Calculated end date:', this.getCalculatedEndDate());
        };
        // Helper function to parse dates in various formats
        TripDetailComponent_1.prototype.parseDate = function (dateString) {
            if (!dateString)
                return null;
            console.log('Parsing date:', dateString);
            // Handle MM/DD/YY format specifically (like "5/31/25")
            var mmddyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
            if (mmddyyMatch) {
                var month = mmddyyMatch[1], day = mmddyyMatch[2], year = mmddyyMatch[3];
                var fullYear = parseInt("20".concat(year)); // Assume 20xx for 2-digit years
                var monthNum = parseInt(month) - 1; // Month is 0-based in Date constructor
                var dayNum = parseInt(day);
                console.log("Creating date from MM/DD/YY: ".concat(month, "/").concat(day, "/").concat(year, " -> ").concat(fullYear, "-").concat(monthNum + 1, "-").concat(dayNum));
                var date_1 = new Date(fullYear, monthNum, dayNum);
                if (!isNaN(date_1.getTime())) {
                    console.log('Successfully parsed MM/DD/YY as:', date_1);
                    return date_1;
                }
            }
            // Handle MM/DD/YYYY format
            var mmddyyyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (mmddyyyyMatch) {
                var month = mmddyyyyMatch[1], day = mmddyyyyMatch[2], year = mmddyyyyMatch[3];
                var fullYear = parseInt(year);
                var monthNum = parseInt(month) - 1; // Month is 0-based in Date constructor
                var dayNum = parseInt(day);
                console.log("Creating date from MM/DD/YYYY: ".concat(month, "/").concat(day, "/").concat(year, " -> ").concat(fullYear, "-").concat(monthNum + 1, "-").concat(dayNum));
                var date_2 = new Date(fullYear, monthNum, dayNum);
                if (!isNaN(date_2.getTime())) {
                    console.log('Successfully parsed MM/DD/YYYY as:', date_2);
                    return date_2;
                }
            }
            // Try original format (might be ISO already)
            var date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                console.log('Successfully parsed original format as:', date);
                return date;
            }
            console.log('Failed to parse date:', dateString);
            return null;
        };
        // Calculate the earliest start date from all places
        TripDetailComponent_1.prototype.getCalculatedStartDate = function () {
            var _this = this;
            console.log('=== getCalculatedStartDate ===');
            console.log('trip.places:', this.trip.places);
            if (!this.trip.places || this.trip.places.length === 0) {
                console.log('No places found, returning trip.date:', this.trip.date);
                return this.trip.date || '';
            }
            // Log each place's start date
            this.trip.places.forEach(function (place, index) {
                console.log("Place ".concat(index, ": ").concat(place.name, ", startDate: ").concat(place.startDate));
            }); // Get all start dates from places that have them
            var startDates = this.trip.places
                .filter(function (place) { return place.startDate; })
                .map(function (place) { return _this.parseDate(place.startDate); })
                .filter(function (date) { return date !== null; });
            console.log('Valid start dates:', startDates);
            if (startDates.length === 0) {
                console.log('No valid start dates, returning trip.date:', this.trip.date);
                return this.trip.date || '';
            } // Sort dates in ascending order and get the first (earliest) one
            startDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
            var earliestDate = this.formatDateAsYYYYMMDD(startDates[0]);
            console.log('Calculated earliest start date:', earliestDate);
            return earliestDate;
        };
        // Calculate the latest end date from all places  
        TripDetailComponent_1.prototype.getCalculatedEndDate = function () {
            var _this = this;
            console.log('=== getCalculatedEndDate ===');
            console.log('trip.places:', this.trip.places);
            if (!this.trip.places || this.trip.places.length === 0) {
                console.log('No places found, returning trip.endDate:', this.trip.endDate);
                return this.trip.endDate || '';
            }
            // Log each place's end date
            this.trip.places.forEach(function (place, index) {
                console.log("Place ".concat(index, ": ").concat(place.name, ", endDate: ").concat(place.endDate));
            }); // Get all end dates from places that have them
            var endDates = this.trip.places
                .filter(function (place) { return place.endDate; })
                .map(function (place) { return _this.parseDate(place.endDate); })
                .filter(function (date) { return date !== null; });
            console.log('Valid end dates:', endDates);
            if (endDates.length === 0) {
                console.log('No valid end dates, returning trip.endDate:', this.trip.endDate);
                return this.trip.endDate || '';
            } // Sort dates in descending order and get the first (latest) one
            endDates.sort(function (a, b) { return b.getTime() - a.getTime(); });
            var latestDate = this.formatDateAsYYYYMMDD(endDates[0]);
            console.log('Calculated latest end date:', latestDate);
            return latestDate;
        };
        // Update the calculateDuration method to use calculated dates
        TripDetailComponent_1.prototype.calculateDurationFromPlaces = function () {
            var startDate = this.getCalculatedStartDate();
            var endDate = this.getCalculatedEndDate();
            if (!startDate || !endDate) {
                return 0;
            }
            var start = new Date(startDate);
            var end = new Date(endDate);
            var diffTime = Math.abs(end.getTime() - start.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        };
        // Address helper methods for enhanced display
        TripDetailComponent_1.prototype.getDisplayAddress = function (place) {
            if (place.address) {
                return address_model_1.AddressHelper.getDisplayAddress(place.address);
            }
            return place.location || 'No address available';
        };
        TripDetailComponent_1.prototype.getGoogleMapsUrl = function (place) {
            if (place.address) {
                return address_model_1.AddressHelper.getGoogleMapsUrl(place.address);
            }
            if (place.location) {
                return "https://www.google.com/maps/search/?api=1&query=".concat(encodeURIComponent(place.location));
            }
            return null;
        };
        TripDetailComponent_1.prototype.hasCoordinates = function (place) {
            if (place.address) {
                return address_model_1.AddressHelper.hasCoordinates(place.address);
            }
            return false;
        };
        // Enhanced map image generation
        TripDetailComponent_1.prototype.getMapImage = function () {
            if (!this.trip || !this.trip.places || this.trip.places.length === 0) {
                return 'https://via.placeholder.com/600x400?text=No+Locations';
            }
            // Collect addresses with coordinates
            var addressesWithCoords = this.trip.places
                .filter(function (place) { return place.address && address_model_1.AddressHelper.hasCoordinates(place.address); })
                .map(function (place) { return ({
                coordinates: address_model_1.AddressHelper.getCoordinates(place.address),
                formattedAddress: address_model_1.AddressHelper.getFormattedAddress(place.address)
            }); });
            if (addressesWithCoords.length > 0) {
                // Use Google Static Maps API if coordinates are available
                var width = 600;
                var height = 400;
                // Calculate center and zoom based on locations
                var coords = addressesWithCoords.map(function (addr) { return addr.coordinates; });
                var centerLat = coords.reduce(function (sum, coord) { return sum + coord.latitude; }, 0) / coords.length;
                var centerLng = coords.reduce(function (sum, coord) { return sum + coord.longitude; }, 0) / coords.length;
                var mapUrl_1 = "https://maps.googleapis.com/maps/api/staticmap?size=".concat(width, "x").concat(height, "&center=").concat(centerLat, ",").concat(centerLng, "&zoom=10");
                // Add markers for each location
                addressesWithCoords.forEach(function (addr, index) {
                    mapUrl_1 += "&markers=color:red%7Clabel:".concat(index + 1, "%7C").concat(addr.coordinates.latitude, ",").concat(addr.coordinates.longitude);
                });
                // Add Google Maps API key if available (would need to be configured)
                // mapUrl += `&key=${GOOGLE_MAPS_API_KEY}`;
                return mapUrl_1;
            }
            // Fallback for locations without coordinates
            var firstPlace = this.trip.places[0];
            var address = this.getDisplayAddress(firstPlace);
            if (address && address !== 'No address available') {
                var encodedAddress = encodeURIComponent(address);
                return "https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=".concat(encodedAddress);
            }
            return 'https://via.placeholder.com/600x400?text=Map+Unavailable';
        };
        // Delete the entire trip along with all places
        TripDetailComponent_1.prototype.deleteTrip = function () {
            var _this = this;
            var _a;
            // Check permissions first
            if (!this.canEdit) {
                alert('You do not have permission to delete this trip.');
                return;
            }
            if (!this.trip.name) {
                alert('No trip to delete.');
                return;
            }
            // Confirm deletion with user
            var confirmMessage = "Are you sure you want to delete the entire trip \"".concat(this.trip.name, "\"?\n\nThis will permanently delete:\n- The trip information\n- All ").concat(((_a = this.trip.places) === null || _a === void 0 ? void 0 : _a.length) || 0, " places in this trip\n- All photos and notes\n\nThis action cannot be undone.");
            if (!confirm(confirmMessage)) {
                return;
            }
            console.log('Deleting entire trip:', this.trip.id);
            // Call the service to delete the entire trip
            this.tripProxy.deleteTrip(this.trip.id).subscribe({
                next: function (response) {
                    console.log('Trip deleted successfully:', response);
                    alert("Trip \"".concat(_this.trip.name, "\" has been deleted successfully!"));
                    // Navigate back to trips list
                    _this.router.navigate(['/trips']);
                },
                error: function (error) {
                    console.error('Error deleting trip:', error);
                    alert('Failed to delete trip. Please try again.');
                }
            });
        };
        // Helper method to format date as YYYY-MM-DD without timezone issues
        TripDetailComponent_1.prototype.formatDateAsYYYYMMDD = function (date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return "".concat(year, "-").concat(month, "-").concat(day);
        };
        // Calculate total budget spent from all places
        TripDetailComponent_1.prototype.getCalculatedTotalBudget = function () {
            console.log('=== getCalculatedTotalBudget ===');
            console.log('trip.places:', this.trip.places);
            if (!this.trip.places || this.trip.places.length === 0) {
                console.log('No places found, returning trip.amountSpent:', this.trip.amountSpent);
                return this.trip.amountSpent || 0;
            }
            // Log each place's cost for debugging
            this.trip.places.forEach(function (place, index) {
                console.log("Place ".concat(index, ": ").concat(place.name, ", cost: ").concat(place.cost));
            });
            // Sum up all the costs from places that have them
            var totalCost = this.trip.places
                .filter(function (place) { return place.cost && place.cost > 0; }) // Only include places with valid costs
                .reduce(function (sum, place) { return sum + (place.cost || 0); }, 0);
            console.log('Calculated total budget from places:', totalCost);
            // If no places have costs, fall back to trip.amountSpent
            if (totalCost === 0) {
                console.log('No valid place costs found, falling back to trip.amountSpent:', this.trip.amountSpent);
                return this.trip.amountSpent || 0;
            }
            return totalCost;
        };
        // Method to open file dialog
        TripDetailComponent_1.prototype.openFileInput = function () {
            var _this = this;
            // Check permissions first
            if (!this.canEdit) {
                alert('You do not have permission to add photos to this trip.');
                return;
            }
            // Create a file input element dynamically
            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.multiple = true;
            this.fileInput.accept = 'image/*';
            // Add change event listener
            this.fileInput.addEventListener('change', function (event) {
                _this.handleFileSelection(event);
            });
            // Trigger the file dialog
            this.fileInput.click();
        };
        // Handle the file selection
        TripDetailComponent_1.prototype.handleFileSelection = function (event) {
            var files = event.target.files;
            if (files && files.length > 0) {
                this.uploadPhotos(files);
            }
        };
        // Process and upload photos
        TripDetailComponent_1.prototype.uploadPhotos = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var photoUrls, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.isUploadingPhotos = true;
                            return [4 /*yield*/, this.processPhotos(Array.from(files))];
                        case 1:
                            photoUrls = _a.sent();
                            // Add photos to the current place
                            this.tripProxy.addPhotosToPlace(this.trip.id, this.selectedPlaceIndex, photoUrls)
                                .subscribe({
                                next: function (response) {
                                    console.log('Photos added successfully:', response);
                                    // Refresh the trip data to show the new photos
                                    _this.fetchTripDetails(_this.trip.id);
                                    _this.isUploadingPhotos = false;
                                },
                                error: function (error) {
                                    console.error('Error adding photos:', error);
                                    alert('Failed to add photos: ' + error.message);
                                    _this.isUploadingPhotos = false;
                                }
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error processing photos:', error_1);
                            alert('Failed to process photos');
                            this.isUploadingPhotos = false;
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Convert File objects to Base64 strings
        TripDetailComponent_1.prototype.processPhotos = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var photoPromises, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!files || files.length === 0) {
                                return [2 /*return*/, []];
                            }
                            photoPromises = files.map(function (file) {
                                return new Promise(function (resolve, reject) {
                                    var reader = new FileReader();
                                    reader.onload = function () {
                                        if (reader.result) {
                                            resolve(reader.result);
                                        }
                                        else {
                                            reject(new Error('Failed to read file'));
                                        }
                                    };
                                    reader.onerror = function () { return reject(new Error('Error reading file')); };
                                    reader.readAsDataURL(file);
                                });
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all(photoPromises)];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Error processing photos:', error_2);
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return TripDetailComponent_1;
    }());
    __setFunctionName(_classThis, "TripDetailComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripDetailComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripDetailComponent = _classThis;
}();
exports.TripDetailComponent = TripDetailComponent;
//# sourceMappingURL=tripdetail.component.js.map