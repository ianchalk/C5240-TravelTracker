"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;
var _a = require('../model/UserModel'), UserModel = _a.UserModel, generateUserId = _a.generateUserId;
var GooglePassport = /** @class */ (function () {
    function GooglePassport() {
        var _this = this;
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        var callbackURL = process.env.CALLBACK_URL || "http://localhost:8080/auth/google/callback";
        if (!this.googleClientId || !this.googleClientSecret) {
            console.error('Google OAuth credentials not found in environment variables!');
            console.error('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
            process.exit(1);
        }
        console.log('Google OAuth configured with callback URL:', callbackURL);
        passport.use(new GoogleStrategy({
            clientID: this.googleClientId,
            clientSecret: this.googleClientSecret,
            callbackURL: callbackURL
        }, function (accessToken, refreshToken, profile, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, newUserData, error_1;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 6, , 7]);
                        console.log('🔍 Google OAuth Profile received:', {
                            id: profile.id,
                            email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                            name: profile.displayName
                        });
                        return [4 /*yield*/, UserModel.findOne({ googleId: profile.id })];
                    case 1:
                        user = _g.sent();
                        if (!user) return [3 /*break*/, 3];
                        // User exists - update last sign-in time
                        console.log('Existing user found, updating last sign-in time');
                        user.lastSignedIn = new Date();
                        user.isActive = true;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _g.sent();
                        console.log('User updated:', user.userId);
                        return [3 /*break*/, 5];
                    case 3:
                        // New user - create in database
                        console.log('Creating new user in database');
                        newUserData = {
                            userId: generateUserId(),
                            googleId: profile.id,
                            email: ((_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || '',
                            name: profile.displayName || '',
                            picture: ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || '',
                            dateSignedUp: new Date(),
                            lastSignedIn: new Date(),
                            isActive: true
                        };
                        user = new UserModel(newUserData);
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _g.sent();
                        console.log('New user created:', user.userId);
                        _g.label = 5;
                    case 5: 
                    // Return the user for session storage
                    return [2 /*return*/, done(null, user)];
                    case 6:
                        error_1 = _g.sent();
                        console.error('Error in Google OAuth strategy:', error_1);
                        return [2 /*return*/, done(error_1, null)];
                    case 7: return [2 /*return*/];
                }
            });
        }); }));
        // Serialize user for the session - store only the user ID
        passport.serializeUser(function (user, done) {
            console.log('Serializing user for session:', user._id || user.userId);
            done(null, user._id || user.userId);
        });
        // Deserialize user from the session - retrieve full user from database
        passport.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('Deserializing user from session:', id);
                        return [4 /*yield*/, UserModel.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, UserModel.findOne({ userId: id })];
                    case 2:
                        user = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (user) {
                            console.log('User deserialized successfully:', user.userId);
                            done(null, user);
                        }
                        else {
                            console.log('User not found during deserialization:', id);
                            done(null, false);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error deserializing user:', error_2);
                        done(error_2, null);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    return GooglePassport;
}());
exports.default = GooglePassport;
//# sourceMappingURL=GooglePassport.js.map