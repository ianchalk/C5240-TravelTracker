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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AuthService = function () {
    var _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(http) {
            var _this = this;
            this.http = http;
            this.baseUrl = 'http://localhost:8080/auth';
            this.currentUserSubject = new rxjs_1.BehaviorSubject(null);
            this.isAuthenticatedSubject = new rxjs_1.BehaviorSubject(false);
            this.currentUser$ = this.currentUserSubject.asObservable();
            this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
            console.log('AuthService initialized');
            // Check authentication status on service initialization
            this.checkAuthStatus().subscribe();
            // Check authentication status when the page becomes visible again
            document.addEventListener('visibilitychange', function () {
                if (!document.hidden) {
                    console.log('Page became visible - checking auth status');
                    _this.checkAuthStatus().subscribe();
                }
            });
        }
        // Check if user is currently authenticated
        AuthService_1.prototype.checkAuthStatus = function () {
            var _this = this;
            return this.http.get("".concat(this.baseUrl, "/status"), { withCredentials: true })
                .pipe((0, operators_1.tap)(function (status) {
                console.log('Auth status check result:', status);
                _this.isAuthenticatedSubject.next(status.isAuthenticated);
                _this.currentUserSubject.next(status.user);
            }), (0, operators_1.catchError)(function (error) {
                console.error('Auth status check failed:', error);
                _this.isAuthenticatedSubject.next(false);
                _this.currentUserSubject.next(null);
                return (0, rxjs_1.of)({ isAuthenticated: false, user: null });
            }));
        };
        // Get current user information
        AuthService_1.prototype.getCurrentUser = function () {
            return this.http.get("".concat(this.baseUrl, "/user"), { withCredentials: true })
                .pipe((0, operators_1.catchError)(function (error) {
                console.error('Get current user failed:', error);
                throw error;
            }));
        };
        // Initiate Google OAuth login
        AuthService_1.prototype.loginWithGoogle = function () {
            console.log('Initiating Google login...');
            window.location.href = "".concat(this.baseUrl, "/google");
        };
        // Logout user
        AuthService_1.prototype.logout = function () {
            var _this = this;
            console.log('Logging out...');
            this.http.get("".concat(this.baseUrl, "/logout"), { withCredentials: true })
                .pipe((0, operators_1.tap)(function () {
                _this.isAuthenticatedSubject.next(false);
                _this.currentUserSubject.next(null);
            }), (0, operators_1.catchError)(function (error) {
                console.error('Logout failed:', error);
                // Even if logout request fails, clear local state
                _this.isAuthenticatedSubject.next(false);
                _this.currentUserSubject.next(null);
                return (0, rxjs_1.of)(null);
            }))
                .subscribe(function () {
                window.location.href = '/';
            });
        };
        Object.defineProperty(AuthService_1.prototype, "currentUser", {
            // Get current user value (synchronous)
            get: function () {
                return this.currentUserSubject.value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AuthService_1.prototype, "isAuthenticated", {
            // Get authentication status (synchronous)
            get: function () {
                return this.isAuthenticatedSubject.value;
            },
            enumerable: false,
            configurable: true
        });
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map