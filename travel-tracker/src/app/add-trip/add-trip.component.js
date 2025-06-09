"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTripComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var address_model_1 = require("../models/address.model");
var rxjs_1 = require("rxjs");
var AddTripComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-add-trip',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, http_1.HttpClientModule],
            templateUrl: './add-trip.component.html',
            styleUrls: ['./add-trip.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AddTripComponent = _classThis = /** @class */ (function () {
        function AddTripComponent_1(fb, router, tripProxy, authService, placesService) {
            this.fb = fb;
            this.router = router;
            this.tripProxy = tripProxy;
            this.authService = authService;
            this.placesService = placesService;
            this.isSubmitting = false;
            this.submitError = '';
            this.submitSuccess = false;
            // Authentication properties
            this.isAuthenticated = false;
            this.currentUser = null;
            this.authSubscriptions = [];
            // Autocomplete properties - one set per place
            this.addressPredictions = {};
            this.selectedAddresses = {};
            this.showAutocomplete = {};
            this.isLoadingPredictions = {};
            this.selectedPredictionIndex = {};
            this.addressInputSubjects = {};
            this.destroy$ = new rxjs_1.Subject();
            this.autocompleteTimeouts = {};
            this.addTripForm = this.createForm();
        }
        AddTripComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            console.log('AddTripComponent initialized');
            // Initialize autocomplete for the first place (index 0)
            this.initializeAutocompleteForPlace(0);
            // Check authentication status
            var authSub = this.authService.isAuthenticated$.subscribe(function (isAuth) {
                _this.isAuthenticated = isAuth;
                console.log('Authentication status in AddTripComponent:', isAuth);
                if (!isAuth) {
                    console.log('User not authenticated, redirecting to trips page');
                    alert('Please sign in to add a new trip.');
                    _this.router.navigate(['/trips']);
                }
            });
            this.authSubscriptions.push(authSub);
            var userSub = this.authService.currentUser$.subscribe(function (user) {
                _this.currentUser = user;
                console.log('Current user in AddTripComponent:', user);
            });
            this.authSubscriptions.push(userSub);
        };
        AddTripComponent_1.prototype.ngOnDestroy = function () {
            this.destroy$.next();
            this.destroy$.complete();
            // Clean up autocomplete timeouts
            Object.values(this.autocompleteTimeouts).forEach(function (timeout) {
                if (timeout)
                    clearTimeout(timeout);
            });
            // Clean up subscriptions
            this.authSubscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        AddTripComponent_1.prototype.createForm = function () {
            return this.fb.group({
                // Trip Information
                name: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                description: ['', [forms_1.Validators.required, forms_1.Validators.minLength(10)]],
                isPublic: [false],
                // Places Array - at least one place required
                places: this.fb.array([this.createPlaceForm()], [forms_1.Validators.minLength(1)])
            });
        };
        AddTripComponent_1.prototype.createPlaceForm = function () {
            return this.fb.group({
                name: ['', [forms_1.Validators.required, forms_1.Validators.minLength(2)]],
                address: ['', [forms_1.Validators.required]],
                description: ['', [forms_1.Validators.required, forms_1.Validators.minLength(5)]],
                startDate: ['', [forms_1.Validators.required]],
                endDate: ['', [forms_1.Validators.required]],
                notes: [''],
                cost: [0, [forms_1.Validators.min(0)]],
                photos: [[]] // Array of files
            }, { validators: this.dateRangeValidator });
        };
        // Custom validator to ensure end date is after start date
        AddTripComponent_1.prototype.dateRangeValidator = function (control) {
            var startDate = control.get('startDate');
            var endDate = control.get('endDate');
            if (startDate && endDate && startDate.value && endDate.value) {
                var start = new Date(startDate.value);
                var end = new Date(endDate.value);
                if (end < start) {
                    return { dateRange: true };
                }
            }
            return null;
        };
        Object.defineProperty(AddTripComponent_1.prototype, "places", {
            get: function () {
                return this.addTripForm.get('places');
            },
            enumerable: false,
            configurable: true
        });
        // Calculate duration for a place
        AddTripComponent_1.prototype.calculateDuration = function (place) {
            var startDate = place.get('startDate').value;
            var endDate = place.get('endDate').value;
            if (startDate && endDate) {
                var start = new Date(startDate);
                var end = new Date(endDate);
                var diffTime = Math.abs(end.getTime() - start.getTime());
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            }
            return 0;
        };
        // Get duration display for a place
        AddTripComponent_1.prototype.getDurationDisplay = function (placeIndex) {
            var place = this.places.at(placeIndex);
            var duration = this.calculateDuration(place);
            return duration > 0 ? "".concat(duration, " day").concat(duration !== 1 ? 's' : '') : '';
        };
        AddTripComponent_1.prototype.addPlace = function () {
            var newIndex = this.places.length;
            this.places.push(this.createPlaceForm());
            this.initializeAutocompleteForPlace(newIndex);
        };
        AddTripComponent_1.prototype.removePlace = function (index) {
            if (this.places.length > 1) {
                this.places.removeAt(index);
                this.cleanupAutocompleteForPlace(index);
            }
        };
        AddTripComponent_1.prototype.onFileSelect = function (event, placeIndex) {
            var _a, _b;
            var files = event.target.files;
            if (files) {
                var place = this.places.at(placeIndex);
                var currentPhotos = ((_a = place.get('photos')) === null || _a === void 0 ? void 0 : _a.value) || [];
                var newPhotos = __spreadArray(__spreadArray([], currentPhotos, true), Array.from(files), true);
                (_b = place.get('photos')) === null || _b === void 0 ? void 0 : _b.setValue(newPhotos);
            }
        };
        AddTripComponent_1.prototype.removePhoto = function (placeIndex, photoIndex) {
            var _a, _b;
            var place = this.places.at(placeIndex);
            var photos = ((_a = place.get('photos')) === null || _a === void 0 ? void 0 : _a.value) || [];
            photos.splice(photoIndex, 1);
            (_b = place.get('photos')) === null || _b === void 0 ? void 0 : _b.setValue(photos);
        };
        AddTripComponent_1.prototype.getPhotoName = function (file) {
            return file.name;
        };
        AddTripComponent_1.prototype.onSubmit = function () {
            var _this = this;
            if (this.addTripForm.valid && !this.isSubmitting) {
                this.isSubmitting = true;
                this.submitError = '';
                this.submitSuccess = false;
                var formData_1 = this.addTripForm.value;
                // Process photos for all places
                this.processAllPhotos(formData_1.places).then(function (processedPlaces) {
                    var _a, _b;
                    // Transform the form data to match the API expectation
                    var tripData = {
                        name: formData_1.name,
                        description: formData_1.description,
                        isPublic: formData_1.isPublic,
                        userId: ((_a = _this.currentUser) === null || _a === void 0 ? void 0 : _a._id) || ((_b = _this.currentUser) === null || _b === void 0 ? void 0 : _b.userId) || null, // Use MongoDB _id or custom userId
                        places: processedPlaces.map(function (place, index) { return ({
                            name: place.name,
                            address: _this.selectedAddresses[index]
                                ? _this.selectedAddresses[index]
                                : address_model_1.AddressHelper.normalizeAddressForApi(place.address),
                            description: place.description,
                            startDate: new Date(place.startDate),
                            endDate: new Date(place.endDate),
                            duration: _this.calculateDuration(_this.places.at(index)),
                            notes: place.notes || '',
                            cost: place.cost || 0,
                            photos: place.photos // Include processed photos
                        }); })
                    };
                    console.log('Submitting trip data:', tripData);
                    console.log('Current user information:', _this.currentUser);
                    _this.tripProxy.createTripWithPlaces(tripData).subscribe({
                        next: function (response) {
                            console.log('Trip created successfully:', response);
                            _this.isSubmitting = false;
                            _this.submitSuccess = true;
                            // Navigate back to trips page after a short delay
                            setTimeout(function () {
                                _this.router.navigate(['/trips']);
                            }, 2000);
                        },
                        error: function (error) {
                            console.error('Error creating trip:', error);
                            _this.isSubmitting = false;
                            _this.submitError = 'Failed to create trip. Please try again.';
                        }
                    });
                }).catch(function (error) {
                    console.error('Error processing photos:', error);
                    _this.isSubmitting = false;
                    _this.submitError = 'Failed to process photos. Please try again.';
                });
            }
            else {
                // Mark all fields as touched to show validation errors
                this.markFormGroupTouched(this.addTripForm);
            }
        };
        AddTripComponent_1.prototype.markFormGroupTouched = function (formGroup) {
            var _this = this;
            Object.keys(formGroup.controls).forEach(function (field) {
                var control = formGroup.get(field);
                if (control instanceof forms_1.FormGroup || control instanceof forms_1.FormArray) {
                    _this.markFormGroupTouched(control);
                }
                else {
                    control === null || control === void 0 ? void 0 : control.markAsTouched();
                }
            });
        };
        AddTripComponent_1.prototype.onCancel = function () {
            this.router.navigate(['/trips']);
        };
        // Helper methods for validation display
        AddTripComponent_1.prototype.isFieldInvalid = function (fieldName) {
            var field = this.addTripForm.get(fieldName);
            return !!(field && field.invalid && (field.dirty || field.touched));
        };
        AddTripComponent_1.prototype.isPlaceFieldInvalid = function (placeIndex, fieldName) {
            var place = this.places.at(placeIndex);
            var field = place === null || place === void 0 ? void 0 : place.get(fieldName);
            return !!(field && field.invalid && (field.dirty || field.touched));
        };
        AddTripComponent_1.prototype.getFieldError = function (fieldName) {
            var field = this.addTripForm.get(fieldName);
            if (field === null || field === void 0 ? void 0 : field.errors) {
                if (field.errors['required'])
                    return "".concat(fieldName, " is required");
                if (field.errors['minlength'])
                    return "".concat(fieldName, " is too short");
            }
            return '';
        };
        AddTripComponent_1.prototype.getPlaceFieldError = function (placeIndex, fieldName) {
            var _a;
            var place = this.places.at(placeIndex);
            var field = place === null || place === void 0 ? void 0 : place.get(fieldName);
            if (field === null || field === void 0 ? void 0 : field.errors) {
                if (field.errors['required'])
                    return "".concat(fieldName, " is required");
                if (field.errors['minlength'])
                    return "".concat(fieldName, " is too short");
                if (field.errors['min'])
                    return "".concat(fieldName, " cannot be negative");
            }
            if (((_a = place === null || place === void 0 ? void 0 : place.errors) === null || _a === void 0 ? void 0 : _a['dateRange']) && (fieldName === 'startDate' || fieldName === 'endDate')) {
                return 'End date must be after start date';
            }
            return '';
        };
        // Process photos for all places - convert File objects to Base64 strings
        AddTripComponent_1.prototype.processAllPhotos = function (places) {
            return __awaiter(this, void 0, void 0, function () {
                var processedPlaces, _i, places_1, place, processedPhotos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            processedPlaces = [];
                            _i = 0, places_1 = places;
                            _a.label = 1;
                        case 1:
                            if (!(_i < places_1.length)) return [3 /*break*/, 4];
                            place = places_1[_i];
                            return [4 /*yield*/, this.processPhotos(place.photos || [])];
                        case 2:
                            processedPhotos = _a.sent();
                            processedPlaces.push(__assign(__assign({}, place), { photos: processedPhotos }));
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, processedPlaces];
                    }
                });
            });
        };
        // Process photos - convert File objects to Base64 strings
        AddTripComponent_1.prototype.processPhotos = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var photoPromises, error_1;
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
                            error_1 = _a.sent();
                            console.error('Error processing photos:', error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Google Places Autocomplete Methods
        AddTripComponent_1.prototype.initializeAutocompleteForPlace = function (placeIndex) {
            var _this = this;
            // Initialize autocomplete state for this place
            this.addressPredictions[placeIndex] = [];
            this.selectedAddresses[placeIndex] = null;
            this.showAutocomplete[placeIndex] = false;
            this.isLoadingPredictions[placeIndex] = false;
            this.selectedPredictionIndex[placeIndex] = -1;
            // Create new subject for this place
            this.addressInputSubjects[placeIndex] = new rxjs_1.Subject();
            // Set up debounced search for this place
            this.addressInputSubjects[placeIndex].pipe((0, rxjs_1.debounceTime)(300), (0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.takeUntil)(this.destroy$)).subscribe(function (searchTerm) {
                _this.searchAddresses(placeIndex, searchTerm);
            });
        };
        AddTripComponent_1.prototype.cleanupAutocompleteForPlace = function (placeIndex) {
            // Clean up autocomplete state for removed place
            delete this.addressPredictions[placeIndex];
            delete this.selectedAddresses[placeIndex];
            delete this.showAutocomplete[placeIndex];
            delete this.isLoadingPredictions[placeIndex];
            delete this.selectedPredictionIndex[placeIndex];
            if (this.addressInputSubjects[placeIndex]) {
                this.addressInputSubjects[placeIndex].complete();
                delete this.addressInputSubjects[placeIndex];
            }
            if (this.autocompleteTimeouts[placeIndex]) {
                clearTimeout(this.autocompleteTimeouts[placeIndex]);
                delete this.autocompleteTimeouts[placeIndex];
            }
        };
        AddTripComponent_1.prototype.onAddressInput = function (event, placeIndex) {
            var value = event.target.value;
            if (this.addressInputSubjects[placeIndex]) {
                this.addressInputSubjects[placeIndex].next(value);
            }
            if (value.length < 2) {
                this.hideAutocomplete(placeIndex);
            }
        };
        AddTripComponent_1.prototype.onAddressFocus = function (placeIndex) {
            var _a;
            var place = this.places.at(placeIndex);
            var addressValue = (_a = place === null || place === void 0 ? void 0 : place.get('address')) === null || _a === void 0 ? void 0 : _a.value;
            if (addressValue && addressValue.length >= 2) {
                this.showAutocomplete[placeIndex] = true;
            }
        };
        AddTripComponent_1.prototype.onAddressBlur = function (placeIndex) {
            var _this = this;
            // Delay hiding to allow for prediction selection
            this.autocompleteTimeouts[placeIndex] = setTimeout(function () {
                _this.hideAutocomplete(placeIndex);
            }, 300);
        };
        AddTripComponent_1.prototype.searchAddresses = function (placeIndex, query) {
            return __awaiter(this, void 0, void 0, function () {
                var predictions, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!query || query.length < 2) {
                                this.hideAutocomplete(placeIndex);
                                return [2 /*return*/];
                            }
                            this.isLoadingPredictions[placeIndex] = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.placesService.getPlacePredictions(query)];
                        case 2:
                            predictions = _a.sent();
                            this.addressPredictions[placeIndex] = predictions;
                            this.selectedPredictionIndex[placeIndex] = -1;
                            this.showAutocomplete[placeIndex] = predictions.length > 0;
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Error fetching address predictions:', error_2);
                            this.addressPredictions[placeIndex] = [];
                            this.showAutocomplete[placeIndex] = false;
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoadingPredictions[placeIndex] = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AddTripComponent_1.prototype.selectPrediction = function (placeIndex, prediction) {
            return __awaiter(this, void 0, void 0, function () {
                var place, placeDetails, googlePlaceAddress, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.autocompleteTimeouts[placeIndex]) {
                                clearTimeout(this.autocompleteTimeouts[placeIndex]);
                            }
                            place = this.places.at(placeIndex);
                            (_a = place === null || place === void 0 ? void 0 : place.get('address')) === null || _a === void 0 ? void 0 : _a.setValue(prediction.description);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.placesService.getPlaceDetails(prediction.place_id)];
                        case 2:
                            placeDetails = _b.sent();
                            if (placeDetails) {
                                googlePlaceAddress = this.placesService.convertPlaceToAddress(placeDetails);
                                // Convert to our frontend Address format
                                this.selectedAddresses[placeIndex] = address_model_1.AddressHelper.fromGooglePlace(googlePlaceAddress);
                                console.log('Selected address details for place', placeIndex, ':', this.selectedAddresses[placeIndex]);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _b.sent();
                            console.error('Error getting place details:', error_3);
                            return [3 /*break*/, 4];
                        case 4:
                            this.hideAutocomplete(placeIndex);
                            return [2 /*return*/];
                    }
                });
            });
        };
        AddTripComponent_1.prototype.hideAutocomplete = function (placeIndex) {
            this.showAutocomplete[placeIndex] = false;
            this.addressPredictions[placeIndex] = [];
            this.selectedPredictionIndex[placeIndex] = -1;
        };
        // Keyboard navigation for autocomplete
        AddTripComponent_1.prototype.onAddressKeydown = function (event, placeIndex) {
            if (!this.showAutocomplete[placeIndex] || !this.addressPredictions[placeIndex] || this.addressPredictions[placeIndex].length === 0) {
                return;
            }
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.selectedPredictionIndex[placeIndex] = Math.min(this.selectedPredictionIndex[placeIndex] + 1, this.addressPredictions[placeIndex].length - 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.selectedPredictionIndex[placeIndex] = Math.max(this.selectedPredictionIndex[placeIndex] - 1, -1);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.selectedPredictionIndex[placeIndex] >= 0 && this.selectedPredictionIndex[placeIndex] < this.addressPredictions[placeIndex].length) {
                        this.selectPrediction(placeIndex, this.addressPredictions[placeIndex][this.selectedPredictionIndex[placeIndex]]);
                    }
                    break;
                case 'Escape':
                    this.hideAutocomplete(placeIndex);
                    break;
            }
        };
        return AddTripComponent_1;
    }());
    __setFunctionName(_classThis, "AddTripComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AddTripComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AddTripComponent = _classThis;
}();
exports.AddTripComponent = AddTripComponent;
//# sourceMappingURL=add-trip.component.js.map