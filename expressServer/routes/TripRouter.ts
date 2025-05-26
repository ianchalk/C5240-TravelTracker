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
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        notes: req.body.notes,
        photos: req.body.photos || [],
        dates: req.body.dates,
        cost: req.body.cost
      }
      await this.Locations.createLocation(res, locationData);
    });

    // Alternative endpoint for creating locations (simplified path)
    this.router.post('/:tripId/locations', async (req: Request, res: Response, next: NextFunction) => {
      var id = req.params.tripId;
      const locationData = {
        tripId: id,
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        notes: req.body.notes,
        photos: req.body.photos || [],
        dates: req.body.dates,
        cost: req.body.cost
      }
      await this.Locations.createLocation(res, locationData);
    });
    
    // Creates a new trip with initial places
    this.router.post('/create-with-places', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Generate a unique trip ID
        const tripId = Date.now().toString();
        
        const tripData = {
          name: req.body.name,
          description: req.body.description,
          tripId: tripId,
          userId: req.body.userId,
          isPublic: req.body.isPublic || false,
          amount_spent: req.body.amount_spent || 0
        };
        
        // Create the trip first
        const tripResult = await this.Trips.createTrip(res, tripData);
        
        // If trip creation was successful and places are provided
        if (req.body.places && req.body.places.length > 0) {
          // Create each place/location
          for (const place of req.body.places) {
            const locationData = {
              tripId: tripId,
              name: place.name,
              address: place.address || '',
              description: place.description || '',
              startDate: place.startDate,
              endDate: place.endDate,
              notes: place.notes || '',
              photos: place.photos || [],
              cost: place.cost || 0
            };
            
            await this.Locations.createLocation(res, locationData);
          }
        }
        
        // Return success response with trip ID
        if (!res.headersSent) {
          res.status(201).json({ 
            success: true, 
            message: 'Trip created successfully with places',
            tripId: tripId 
          });
        }
      } catch (error) {
        console.error('Error creating trip with places:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            message: 'Error creating trip with places' 
          });
        }
      }
    });
  }
}

export { TripRouter };