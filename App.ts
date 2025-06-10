import * as express from 'express';
import * as url from 'url';
import * as bodyParser from 'body-parser';

import { TripRouter } from './routes/TripRouter';
import { AuthRouter } from './routes/AuthRouter';
const passport = require('./config/GooglePassport');
const session = require('express-session');


// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  public tripRouter: express.Router;
  public authRouter: express.Router;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string, sessionSecret:string) {
    this.express = express();
    this.middleware(sessionSecret);
    this.tripRouter = new TripRouter(mongoDBConnection).router;
    this.authRouter = new AuthRouter().router;
    this.routes();
  }

  private middleware(sessionSecret:string): void {
    // Increase payload size limits for photo uploads
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
    this.express.use('/', express.static(__dirname+'/dist'));
  }

}

export {App}; 