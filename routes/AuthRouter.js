"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
var express_1 = require("express");
var passport = require("passport");
var AuthRouter = /** @class */ (function () {
    function AuthRouter() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    AuthRouter.prototype.routes = function () {
        // Google OAuth login route
        this.router.get('/google', passport.authenticate('google', {
            scope: ['profile', 'email']
        }));
        // Google OAuth callback route
        this.router.get('/google/callback', passport.authenticate('google', {
            successRedirect: 'https://traveltracker2025.azurewebsites.net/', // Redirect to Angular welcome page on success
            failureRedirect: 'https://traveltracker2025.azurewebsites.net/' // Redirect to Angular home page on failure
        }));
        // Logout route
        this.router.get('/logout', function (req, res) {
            req.logout(function (err) {
                if (err) {
                    console.error('Error during logout:', err);
                    return res.status(500).json({ error: 'Logout failed' });
                }
                res.redirect('https://traveltracker2025.azurewebsites.net/'); // Redirect to Angular home page
            });
        });
        // Get current user route (for checking authentication status)
        this.router.get('/user', function (req, res) {
            if (req.isAuthenticated()) {
                res.json(req.user);
            }
            else {
                res.status(401).json({ message: 'Not authenticated' });
            }
        });
        // Check authentication status route
        this.router.get('/status', function (req, res) {
            res.json({
                isAuthenticated: req.isAuthenticated(),
                user: req.isAuthenticated() ? req.user : null
            });
        });
    };
    return AuthRouter;
}());
exports.AuthRouter = AuthRouter;
exports.default = AuthRouter;
//# sourceMappingURL=AuthRouter.js.map