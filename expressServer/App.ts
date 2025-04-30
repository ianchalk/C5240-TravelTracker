import * as express from 'express';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import { TripRouter } from './routes/TripRouter';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;
  public tripRouter: express.Router;
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.tripRouter = new TripRouter().router;
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    this.express.use('/trip', this.tripRouter);
    this.express.use('/', router);
  }

}

export {App};