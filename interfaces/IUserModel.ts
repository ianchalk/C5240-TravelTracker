// Interface for User Model
export interface IUserModel {
    userId: string;          // Unique identifier for the user
    googleId: string;        // Google OAuth ID
    email: string;           // User's email from Google
    name: string;            // User's display name from Google
    picture?: string;        // User's profile picture URL from Google
    dateSignedUp: Date;      // Date when user first signed up
    lastSignedIn: Date;      // Date when user last signed in
    isActive: boolean;       // Whether the user account is active
}
