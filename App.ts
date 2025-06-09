// Using CommonJS require for all imports to avoid module resolution issues
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const session = require('express-session');
import { TripRouter } from './routes/TripRouter';
import { AuthRouter } from './routes/AuthRouter';
const passport = require('./config/GooglePassport');

// Import types for TypeScript
import { Application, Router } from 'express';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: Application;
  public tripRouter: Router;
  public authRouter: Router;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string) {
    this.express = express();
    this.middleware();
    this.tripRouter = new TripRouter(mongoDBConnection).router;
    this.authRouter = new AuthRouter().router;
    this.routes();
  }

  private middleware(): void {
    // Increase payload size limits for photo uploads
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    
    // Session configuration
    this.express.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Initialize Passport and session handling
    this.express.use(passport.initialize());
    this.express.use(passport.session());
    
    // CORS configuration
    this.express.use( (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:4200");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Credentials", "true");
      
      // Handle preflight OPTIONS request
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    // Authentication routes
    this.express.use('/auth', this.authRouter);
    
    // Trip management routes
    this.express.use('/trip', this.tripRouter);
    
    // Default route
    this.express.use('/', router);
  }

}

export {App}; 