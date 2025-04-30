import { Router, Request, Response, NextFunction } from 'express';
import { TripController } from '../controllers/TripController';
import {TripModel} from '../model/TripModel';

class TripRouter {
  public router: Router;
  private tripController: TripController;
  public Trips:TripModel;

  constructor(mongoDBConnection:string) {
    this.tripController = new TripController();
    this.Trips = new TripModel(mongoDBConnection);

    this.router = Router();
    this.routes();

  }

  private routes(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      await this.Trips.retrieveAllTrips(res);
    });


    this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
      this.tripController.getTripById(req, res, next);
    });
  
  }

  
}

export { TripRouter };