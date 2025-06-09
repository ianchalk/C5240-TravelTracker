import * as mongoose from 'mongoose';
import { IUserModel } from '../interfaces/IUserModel';

// User Schema for MongoDB
const UserSchema = new mongoose.Schema({
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
    timestamps: true  // Adds createdAt and updatedAt fields
});

// Create indexes for better performance
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });
UserSchema.index({ dateSignedUp: 1 });

// Create and export the User model
export const UserModel = mongoose.model<IUserModel>('User', UserSchema);

// Helper function to generate unique user ID
export const generateUserId = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${random}`;
};

export default UserModel;
