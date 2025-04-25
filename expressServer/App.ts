import * as express from 'express';
import * as url from 'url';
import * as bodyParser from 'body-parser';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    
    this.express.use('/', router);
  }

}

export {App};