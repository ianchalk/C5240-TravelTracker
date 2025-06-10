"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = exports.UserModel = void 0;
var mongoose = require("mongoose");
// User Schema for MongoDB
var UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    dateSignedUp: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastSignedIn: {
        type: Date,
        default: Date.now,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    collection: 'users',
    timestamps: true // Adds createdAt and updatedAt fields
});
// Create indexes for better performance
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });
UserSchema.index({ dateSignedUp: 1 });
// Create and export the User model
exports.UserModel = mongoose.model('User', UserSchema);
// Helper function to generate unique user ID
var generateUserId = function () {
    var timestamp = Date.now().toString();
    var random = Math.random().toString(36).substring(2, 15);
    return "user_".concat(timestamp, "_").concat(random);
};
exports.generateUserId = generateUserId;
exports.default = exports.UserModel;
//# sourceMappingURL=UserModel.js.map