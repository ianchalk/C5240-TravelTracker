import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as path from 'path';

import { TripRouter } from './routes/TripRouter';
import { AuthRouter } from './routes/AuthRouter';
import GooglePassportObj from './config/GooglePassport';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  public tripRouter: express.Router;
  public authRouter: express.Router;
  public googlePassportObj:GooglePassportObj;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string, sessionSecret:string) {
    this.googlePassportObj = new GooglePassportObj();

    this.express = express();
    this.middleware(sessionSecret);
    this.tripRouter = new TripRouter(mongoDBConnection).router;
    this.authRouter = new AuthRouter().router;
    this.routes();
  }

  // Configure Express middleware.
  private middleware(sessionSecret:string): void {
    // Increased payload size limits for photo uploads
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    
    // Session configuration
    this.express.use(session({
      secret: sessionSecret,
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
      res.header("Access-Control-Allow-Origin", "*");
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

    // Authentication routes
    this.express.use('/auth', this.authRouter);
    
    // Trip management routes
    this.express.use('/trip', this.tripRouter);
    
    // Default route
    this.express.use('/', express.static(path.join(__dirname, 'dist')));

    // Catches all other routes
    this.express.get(/.*/, (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
}

export {App}; 