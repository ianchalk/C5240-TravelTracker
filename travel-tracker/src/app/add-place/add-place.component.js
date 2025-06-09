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
exports.AddPlaceComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var address_model_1 = require("../models/address.model");
var rxjs_1 = require("rxjs");
var AddPlaceComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-add-place',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, http_1.HttpClientModule],
            templateUrl: './add-place.component.html',
            styleUrls: ['./add-place.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AddPlaceComponent = _classThis = /** @class */ (function () {
        function AddPlaceComponent_1(fb, route, router, tripProxy, placesService) {
            this.fb = fb;
            this.route = route;
            this.router = router;
            this.tripProxy = tripProxy;
            this.placesService = placesService;
            this.tripId = '';
            this.tripName = '';
            this.isSubmitting = false;
            this.submitError = '';
            this.submitSuccess = false;
            // Autocomplete properties
            this.addressPredictions = [];
            this.selectedAddress = null;
            this.showAutocomplete = false;
            this.isLoadingPredictions = false;
            this.selectedPredictionIndex = -1;
            this.addressInputSubject = new rxjs_1.Subject();
            this.destroy$ = new rxjs_1.Subject();
            this.addPlaceForm = this.createForm();
        }
        AddPlaceComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            console.log('AddPlaceComponent initialized');
            // Initialize address input debouncing
            this.addressInputSubject.pipe((0, rxjs_1.debounceTime)(300), (0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.takeUntil)(this.destroy$)).subscribe(function (searchTerm) {
                _this.searchAddresses(searchTerm);
            });
            // Get trip ID from route parameters
            this.route.paramMap.subscribe(function (params) {
                console.log('Route params:', params);
                console.log('All route params keys:', params.keys);
                var id = params.get('tripId');
                console.log('Extracted tripId from route:', id);
                if (id) {
                    _this.tripId = id;
                    console.log('Set this.tripId to:', _this.tripId);
                    _this.loadTripInfo();
                }
                else {
                    console.error('No trip ID found in route parameters');
                    _this.submitError = 'No trip ID provided';
                }
            });
        };
        AddPlaceComponent_1.prototype.ngOnDestroy = function () {
            this.destroy$.next();
            this.destroy$.complete();
            if (this.autocompleteTimeout) {
                clearTimeout(this.autocompleteTimeout);
            }
        };
        AddPlaceComponent_1.prototype.loadTripInfo = function () {
            var _this = this;
            console.log('Loading trip info for tripId:', this.tripId);
            // Get trip name for display
            this.tripProxy.getListsIndex().subscribe({
                next: function (trips) {
                    console.log('All trips loaded:', trips);
                    var trip = trips.find(function (t) { return t._id === _this.tripId || t.tripId === _this.tripId; });
                    console.log('Found matching trip:', trip);
                    if (trip) {
                        _this.tripName = trip.name || 'Unknown Trip';
                        console.log('Set trip name to:', _this.tripName);
                    }
                    else {
                        console.error('No trip found with ID:', _this.tripId);
                    }
                },
                error: function (err) {
                    console.error('Error loading trip info:', err);
                }
            });
        };
        AddPlaceComponent_1.prototype.createForm = function () {
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
        AddPlaceComponent_1.prototype.dateRangeValidator = function (control) {
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
        // Calculate duration for the place
        AddPlaceComponent_1.prototype.calculateDuration = function () {
            var _a, _b;
            var startDate = (_a = this.addPlaceForm.get('startDate')) === null || _a === void 0 ? void 0 : _a.value;
            var endDate = (_b = this.addPlaceForm.get('endDate')) === null || _b === void 0 ? void 0 : _b.value;
            if (startDate && endDate) {
                var start = new Date(startDate);
                var end = new Date(endDate);
                var diffTime = Math.abs(end.getTime() - start.getTime());
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            }
            return 0;
        };
        // Get duration display
        AddPlaceComponent_1.prototype.getDurationDisplay = function () {
            var duration = this.calculateDuration();
            return duration > 0 ? "".concat(duration, " day").concat(duration !== 1 ? 's' : '') : '';
        };
        AddPlaceComponent_1.prototype.onFileSelect = function (event) {
            var _a, _b;
            var files = event.target.files;
            if (files) {
                var currentPhotos = ((_a = this.addPlaceForm.get('photos')) === null || _a === void 0 ? void 0 : _a.value) || [];
                var newPhotos = __spreadArray(__spreadArray([], currentPhotos, true), Array.from(files), true);
                (_b = this.addPlaceForm.get('photos')) === null || _b === void 0 ? void 0 : _b.setValue(newPhotos);
            }
        };
        AddPlaceComponent_1.prototype.removePhoto = function (photoIndex) {
            var _a, _b;
            var photos = ((_a = this.addPlaceForm.get('photos')) === null || _a === void 0 ? void 0 : _a.value) || [];
            photos.splice(photoIndex, 1);
            (_b = this.addPlaceForm.get('photos')) === null || _b === void 0 ? void 0 : _b.setValue(photos);
        };
        AddPlaceComponent_1.prototype.getPhotoName = function (file) {
            return file.name;
        };
        // Process photos - convert File objects to Base64 strings
        AddPlaceComponent_1.prototype.processPhotos = function (files) {
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
        AddPlaceComponent_1.prototype.onSubmit = function () {
            var _this = this;
            console.log('Form submission started');
            console.log('Form valid:', this.addPlaceForm.valid);
            console.log('Form value:', this.addPlaceForm.value);
            console.log('Trip ID:', this.tripId);
            if (this.addPlaceForm.valid && !this.isSubmitting) {
                this.isSubmitting = true;
                this.submitError = '';
                this.submitSuccess = false;
                var formData_1 = this.addPlaceForm.value;
                // Process photos - convert File objects to Base64 strings
                this.processPhotos(formData_1.photos || []).then(function (photoUrls) {
                    var _a, _b, _c;
                    // Transform the form data to match the API expectation
                    var placeData = {
                        tripId: _this.tripId,
                        name: formData_1.name,
                        address: _this.selectedAddress
                            ? _this.selectedAddress
                            : address_model_1.AddressHelper.normalizeAddressForApi(formData_1.address),
                        description: formData_1.description,
                        startDate: formData_1.startDate, // Keep as string for API
                        endDate: formData_1.endDate, // Keep as string for API
                        notes: formData_1.notes || '',
                        cost: formData_1.cost || 0,
                        photos: photoUrls // Include processed photos
                    };
                    // Ensure address has all required fields per server-side model
                    if (placeData.address) {
                        // If we have a selected address from Google Places, it should already be normalized
                        if (!_this.selectedAddress) {
                            // For manually entered addresses, ensure required fields
                            if (!placeData.address.formattedAddress) {
                                placeData.address.formattedAddress = typeof formData_1.address === 'string' ? formData_1.address : '';
                            }
                            if (!placeData.address.city) {
                                placeData.address.city = 'Unknown';
                            }
                            if (!placeData.address.country) {
                                placeData.address.country = 'Unknown';
                            }
                        }
                    }
                    else {
                        // Fallback if address is somehow null
                        placeData.address = {
                            formattedAddress: typeof formData_1.address === 'string' ? formData_1.address : '',
                            city: 'Unknown',
                            country: 'Unknown'
                        };
                    }
                    console.log('Submitting place with address:', JSON.stringify(placeData.address, null, 2));
                    console.log('Required address fields check:');
                    console.log('- formattedAddress:', ((_a = placeData.address) === null || _a === void 0 ? void 0 : _a.formattedAddress) || 'MISSING');
                    console.log('- city:', ((_b = placeData.address) === null || _b === void 0 ? void 0 : _b.city) || 'MISSING');
                    console.log('- country:', ((_c = placeData.address) === null || _c === void 0 ? void 0 : _c.country) || 'MISSING');
                    console.log('Submitting place data:', JSON.stringify(placeData, null, 2));
                    _this.tripProxy.createPlaceForTrip(placeData).subscribe({
                        next: function (response) {
                            console.log('Place created successfully:', response);
                            _this.isSubmitting = false;
                            _this.submitSuccess = true;
                            // Navigate back to trip detail page after a short delay with refresh parameter
                            setTimeout(function () {
                                _this.router.navigate(['/tripdetail', _this.tripId], {
                                    queryParams: { refresh: Date.now() }
                                });
                            }, 1500);
                        },
                        error: function (error) {
                            console.error('Error creating place:', error);
                            console.error('Full error details:', error);
                            console.error('Error status:', error.status);
                            console.error('Error message:', error.message);
                            _this.isSubmitting = false;
                            _this.submitError = "Failed to create place: ".concat(error.status, " - ").concat(error.message || 'Please try again.');
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
                console.log('Form is invalid, marking all fields as touched');
                this.markFormGroupTouched(this.addPlaceForm);
            }
        };
        AddPlaceComponent_1.prototype.markFormGroupTouched = function (formGroup) {
            Object.keys(formGroup.controls).forEach(function (field) {
                var control = formGroup.get(field);
                control === null || control === void 0 ? void 0 : control.markAsTouched();
            });
        };
        AddPlaceComponent_1.prototype.onCancel = function () {
            this.router.navigate(['/tripdetail', this.tripId]);
        };
        // Helper methods for validation display
        AddPlaceComponent_1.prototype.isFieldInvalid = function (fieldName) {
            var field = this.addPlaceForm.get(fieldName);
            return !!(field && field.invalid && (field.dirty || field.touched));
        };
        AddPlaceComponent_1.prototype.getFieldError = function (fieldName) {
            var _a;
            var field = this.addPlaceForm.get(fieldName);
            if (field === null || field === void 0 ? void 0 : field.errors) {
                if (field.errors['required'])
                    return "".concat(fieldName, " is required");
                if (field.errors['minlength'])
                    return "".concat(fieldName, " is too short");
                if (field.errors['min'])
                    return "".concat(fieldName, " cannot be negative");
            }
            if (((_a = this.addPlaceForm.errors) === null || _a === void 0 ? void 0 : _a['dateRange']) && (fieldName === 'startDate' || fieldName === 'endDate')) {
                return 'End date must be after start date';
            }
            return '';
        };
        // Google Places Autocomplete Methods
        AddPlaceComponent_1.prototype.onAddressInput = function (event) {
            var value = event.target.value;
            this.addressInputSubject.next(value);
            if (value.length < 2) {
                this.hideAutocomplete();
            }
        };
        AddPlaceComponent_1.prototype.onAddressFocus = function () {
            var _a;
            var addressValue = (_a = this.addPlaceForm.get('address')) === null || _a === void 0 ? void 0 : _a.value;
            if (addressValue && addressValue.length >= 2) {
                this.showAutocomplete = true;
            }
        };
        AddPlaceComponent_1.prototype.onAddressBlur = function () {
            var _this = this;
            // Delay hiding to allow for prediction selection
            this.autocompleteTimeout = setTimeout(function () {
                _this.hideAutocomplete();
            }, 300);
        };
        AddPlaceComponent_1.prototype.searchAddresses = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var predictions, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!query || query.length < 2) {
                                this.hideAutocomplete();
                                return [2 /*return*/];
                            }
                            this.isLoadingPredictions = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.placesService.getPlacePredictions(query)];
                        case 2:
                            predictions = _a.sent();
                            this.addressPredictions = predictions;
                            this.selectedPredictionIndex = -1;
                            this.showAutocomplete = predictions.length > 0;
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Error fetching address predictions:', error_2);
                            this.addressPredictions = [];
                            this.showAutocomplete = false;
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoadingPredictions = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AddPlaceComponent_1.prototype.selectPrediction = function (prediction) {
            return __awaiter(this, void 0, void 0, function () {
                var placeDetails, googlePlaceAddress, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.autocompleteTimeout) {
                                clearTimeout(this.autocompleteTimeout);
                            }
                            // Update the form control with the description
                            (_a = this.addPlaceForm.get('address')) === null || _a === void 0 ? void 0 : _a.setValue(prediction.description);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.placesService.getPlaceDetails(prediction.place_id)];
                        case 2:
                            placeDetails = _b.sent();
                            if (placeDetails) {
                                googlePlaceAddress = this.placesService.convertPlaceToAddress(placeDetails);
                                // Convert to our frontend Address format
                                this.selectedAddress = address_model_1.AddressHelper.fromGooglePlace(googlePlaceAddress);
                                console.log('Selected address details:', this.selectedAddress);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _b.sent();
                            console.error('Error getting place details:', error_3);
                            return [3 /*break*/, 4];
                        case 4:
                            this.hideAutocomplete();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AddPlaceComponent_1.prototype.hideAutocomplete = function () {
            this.showAutocomplete = false;
            this.addressPredictions = [];
            this.selectedPredictionIndex = -1;
        };
        // Keyboard navigation for autocomplete
        AddPlaceComponent_1.prototype.onAddressKeydown = function (event) {
            if (!this.showAutocomplete || this.addressPredictions.length === 0) {
                return;
            }
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.selectedPredictionIndex = Math.min(this.selectedPredictionIndex + 1, this.addressPredictions.length - 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.selectedPredictionIndex = Math.max(this.selectedPredictionIndex - 1, -1);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.selectedPredictionIndex >= 0 && this.selectedPredictionIndex < this.addressPredictions.length) {
                        this.selectPrediction(this.addressPredictions[this.selectedPredictionIndex]);
                    }
                    break;
                case 'Escape':
                    this.hideAutocomplete();
                    break;
            }
        };
        return AddPlaceComponent_1;
    }());
    __setFunctionName(_classThis, "AddPlaceComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AddPlaceComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AddPlaceComponent = _classThis;
}();
exports.AddPlaceComponent = AddPlaceComponent;
//# sourceMappingURL=add-place.component.js.map