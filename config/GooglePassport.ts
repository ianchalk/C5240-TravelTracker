import * as passport from 'passport';
import * as dotenv from 'dotenv';


let GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;

const { UserModel, generateUserId } = require('../model/UserModel');

class GooglePassport {

    googleClientId: string;
    googleClientSecret: string;
    
  constructor() {
    this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.CALLBACK_URL || "http://localhost:8080/auth/google/callback";

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
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        console.log('🔍 Google OAuth Profile received:', {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName
        });

        // Check if user already exists in database
        let user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          // User exists - update last sign-in time
          console.log('Existing user found, updating last sign-in time');
          user.lastSignedIn = new Date();
          user.isActive = true;
          await user.save();
          console.log('User updated:', user.userId);
        } 
        
        else {
          // New user - create in database
          console.log('Creating new user in database');
          const newUserData = {
            userId: generateUserId(),
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || '',
            picture: profile.photos?.[0]?.value || '',
            dateSignedUp: new Date(),
            lastSignedIn: new Date(),
          isActive: true
          };

          user = new UserModel(newUserData);
          await user.save();
          console.log('New user created:', user.userId);
        }

        // Return the user for session storage
        return done(null, user);
      } 
    
      catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
      }
    }));

    // Serialize user for the session - store only the user ID
    passport.serializeUser((user: any, done) => {
      console.log('Serializing user for session:', user._id || user.userId);
      done(null, user._id || user.userId);
    });

    // Deserialize user from the session - retrieve full user from database
    passport.deserializeUser(async (id: string, done) => {
      try {
        console.log('Deserializing user from session:', id);
        
        // Try to find by MongoDB _id first, then by custom userId
        let user = await UserModel.findById(id);
        if (!user) {
          user = await UserModel.findOne({ userId: id });
        }
        
        if (user) {
          console.log('User deserialized successfully:', user.userId);
          done(null, user);
        } 
        else {
          console.log('User not found during deserialization:', id);
          done(null, false);
        }
      } 
      catch (error) {
        console.error('Error deserializing user:', error);
            done(error, null);
      }
    });
  }
}
export default GooglePassport;