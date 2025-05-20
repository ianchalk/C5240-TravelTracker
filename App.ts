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
  constructor(mongoDBConnection:string) {
    this.express = express();
    this.middleware();
    this.tripRouter = new TripRouter(mongoDBConnection).router;
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use( (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    this.express.use('/trip', this.tripRouter);
    this.express.use('/', express.static(__dirname+'/dist'));
  }

}

export {App}; 