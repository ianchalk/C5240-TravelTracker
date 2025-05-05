import { Router, Request, Response, NextFunction } from 'express';
import { TripController } from '../controllers/TripController';
import {TripModel} from '../model/TripModel';
import {LocationModel} from '../model/LocationModel';

class TripRouter {
  public router: Router;
  private tripController: TripController;
  public Trips:TripModel;
  public Locations:LocationModel;

  constructor(mongoDBConnection:string) {
    this.tripController = new TripController();
    this.Trips = new TripModel(mongoDBConnection);
    this.Locations = new LocationModel(mongoDBConnection);

    this.router = Router();
    this.routes();

  }

  private routes(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      await this.Trips.retrieveAllTrips(res);
    });


    this.router.get('/:tripId', async (req: Request, res: Response, next: NextFunction) => {
      var id = req.params.tripId;
      await this.Trips.retrieveTrips(res, id);
    });
  
    this.router.get('/:tripId/locations', async (req, res) => {
      var id = req.params.tripId;
      console.log('Query single trip with id: ' + id);
      await this.Locations.retrieveLocationsDetails(res, {tripId: id});
  });
  }

  
}

export { TripRouter };