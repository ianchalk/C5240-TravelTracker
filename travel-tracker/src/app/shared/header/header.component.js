"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var HeaderComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-header',
            standalone: true,
            imports: [router_1.RouterModule, common_1.CommonModule],
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _onDocumentClick_decorators;
    var HeaderComponent = _classThis = /** @class */ (function () {
        function HeaderComponent_1(authService, elementRef) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.elementRef = elementRef;
            this.isAuthenticated = false;
            this.currentUser = null;
            this.isMobileMenuOpen = false;
            this.isUserDropdownOpen = false;
            this.subscriptions = [];
        }
        HeaderComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            console.log('HeaderComponent initialized');
            // Refresh authentication status when component loads
            this.authService.checkAuthStatus().subscribe();
            // Subscribe to authentication status
            var authSub = this.authService.isAuthenticated$.subscribe(function (isAuth) {
                console.log('Authentication status changed:', isAuth);
                _this.isAuthenticated = isAuth;
            });
            // Subscribe to current user
            var userSub = this.authService.currentUser$.subscribe(function (user) {
                console.log('Current user changed:', user);
                _this.currentUser = user;
            });
            this.subscriptions.push(authSub, userSub);
        };
        HeaderComponent_1.prototype.ngOnDestroy = function () {
            this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        HeaderComponent_1.prototype.loginWithGoogle = function () {
            this.authService.loginWithGoogle();
        };
        HeaderComponent_1.prototype.logout = function () {
            this.authService.logout();
        };
        HeaderComponent_1.prototype.toggleMobileMenu = function () {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        };
        HeaderComponent_1.prototype.closeMobileMenu = function () {
            this.isMobileMenuOpen = false;
        };
        HeaderComponent_1.prototype.toggleUserDropdown = function () {
            this.isUserDropdownOpen = !this.isUserDropdownOpen;
        };
        HeaderComponent_1.prototype.closeUserDropdown = function () {
            this.isUserDropdownOpen = false;
        };
        HeaderComponent_1.prototype.onDocumentClick = function (event) {
            var target = event.target;
            if (!this.elementRef.nativeElement.contains(target)) {
                this.closeUserDropdown();
                this.closeMobileMenu();
            }
        };
        // Debug method to manually check authentication status
        HeaderComponent_1.prototype.debugCheckAuth = function () {
            console.log('=== DEBUG: Manual Auth Check ===');
            console.log('Current isAuthenticated:', this.isAuthenticated);
            console.log('Current user:', this.currentUser);
            this.authService.checkAuthStatus().subscribe({
                next: function (status) {
                    console.log('Auth check response:', status);
                },
                error: function (error) {
                    console.error('Auth check error:', error);
                }
            });
        };
        return HeaderComponent_1;
    }());
    __setFunctionName(_classThis, "HeaderComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _onDocumentClick_decorators = [(0, core_1.HostListener)('document:click', ['$event'])];
        __esDecorate(_classThis, null, _onDocumentClick_decorators, { kind: "method", name: "onDocumentClick", static: false, private: false, access: { has: function (obj) { return "onDocumentClick" in obj; }, get: function (obj) { return obj.onDocumentClick; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HeaderComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HeaderComponent = _classThis;
}();
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map