import { Router, Request, Response, NextFunction } from 'express';
import {TripModel} from '../model/TripModel';
import {LocationModel} from '../model/LocationModel';

class TripRouter {
  public router: Router;
  public Trips:TripModel;
  public Locations:LocationModel;

  constructor(mongoDBConnection:string) {
    this.Trips = new TripModel(mongoDBConnection);
    this.Locations = new LocationModel(mongoDBConnection);

    this.router = Router();
    this.routes();

  }

  private routes(): void {

    // Retrieves all trips
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      await this.Trips.retrieveAllTrips(res);
    });


    // Retrieves a specific trip by tripId
    this.router.get('/:tripId', async (req: Request, res: Response, next: NextFunction) => {
      var id = req.params.tripId;
      await this.Trips.retrieveTrip(res, id);
    });
  
    // Retrieves all locations for a specific trip
    this.router.get('/:tripId/locations', async (req: Request, res: Response, next: NextFunction) => {
      var id = req.params.tripId;
      console.log('Query single trip with id: ' + id);
      await this.Locations.retrieveLocationsDetails(res, {tripId: id});
    });

    // Retrieves data of a specific location for a specific trip by tripId and location name
    this.router.get('/:tripId/locations/:locationName', async (req: Request, res: Response) => {
      var tripId = req.params.tripId;
      var locationName = req.params.locationName;

      await this.Locations.retrieveSingleLocationDetail(res, tripId, locationName);
  });

    // Creates a new trip object with the given trip data
    this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
      const tripData = {
          name: req.body.name,
          description: req.body.description,
          tripId: req.body.tripId,
          userId: req.body.userId,
          isPublic: req.body.isPublic
      };
      
      await this.Trips.createTrip(res, tripData);
    });

    // Updates an existing trip object with the given tripId
    this.router.put('/update/:tripId', async (req: Request, res: Response, next: NextFunction) => {
      var tripId = req.params.tripId;
      var updateData = req.body;

      await this.Trips.updateTrip(res, tripId, updateData);
    });

    // Creates a new location object for a specific trip
    // If the trip already has a location object, it will add the new location to the existing array of locations
    this.router.post('/:tripId/locations/create', async (req: Request, res: Response, next: NextFunction) => {
      var id = req.params.tripId;
      const locationData = {
        tripId: id,
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        dates: req.body.dates,
        cost: req.body.cost
      }
      await this.Locations.createLocation(res, locationData);
    });
  }
}

export { TripRouter };