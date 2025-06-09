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

    // Retrieves all public trips (default behavior)
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      await this.Trips.retrieveAllTrips(res);
    });

    // NEW: Retrieves trips for a specific user (both public and private)
    this.router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.userId;
      await this.Trips.retrieveUserTrips(res, userId);
    });

    // NEW: Retrieves trips for currently authenticated user
    this.router.get('/my-trips', async (req: Request, res: Response, next: NextFunction) => {
      // In a real authentication system, you'd get the user ID from the session/token
      // For now, we'll require the userId to be passed as a query parameter
      const userId = req.query.userId as string;
      
      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }
      
      await this.Trips.retrieveUserTrips(res, userId);
    });

    // Search public trips by name
    this.router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
      const searchQuery = req.query.q as string;
      
      if (!searchQuery) {
        res.status(400).json({ error: "Search query is required" });
        return;
      }
      
      await this.Trips.searchPublicTrips(res, searchQuery);
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
      try {
        var id = req.params.tripId;
        console.log('Creating location for trip ID:', id);
        
        // Check if tripId is a valid ObjectId format (24 hex characters)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        let tripQuery;
        
        if (isValidObjectId) {
          // If it's a valid ObjectId, search by _id
          tripQuery = await this.Trips.model.findOne({ _id: id });
        } else {
          // If it's not a valid ObjectId, search by tripId field
          tripQuery = await this.Trips.model.findOne({ tripId: id });
        }
        
        if (!tripQuery) {
          res.status(404).json({ error: "Trip not found" });
          return;
        }
        
        const numericTripId = tripQuery.tripId;
        console.log('Found trip with numeric tripId:', numericTripId);
        
        const locationData = {
          tripId: numericTripId, // Use the numeric tripId, not the MongoDB _id
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
        
        console.log('Creating location with data:', locationData);
        await this.Locations.createLocation(res, locationData);
      } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Alternative endpoint for creating locations (simplified path)
    this.router.post('/:tripId/locations', async (req: Request, res: Response, next: NextFunction) => {
      try {
        var id = req.params.tripId;
        console.log('Creating location (alternative endpoint) for trip ID:', id);
        
        // Check if tripId is a valid ObjectId format (24 hex characters)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        let tripQuery;
        
        if (isValidObjectId) {
          // If it's a valid ObjectId, search by _id
          tripQuery = await this.Trips.model.findOne({ _id: id });
        } else {
          // If it's not a valid ObjectId, search by tripId field
          tripQuery = await this.Trips.model.findOne({ tripId: id });
        }
        
        if (!tripQuery) {
          res.status(404).json({ error: "Trip not found" });
          return;
        }
        
        const numericTripId = tripQuery.tripId;
        console.log('Found trip with numericTripId:', numericTripId);
        
        const locationData = {
          tripId: numericTripId, // Use the numeric tripId, not the MongoDB _id
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
        
        console.log('Creating location with data:', locationData);
        await this.Locations.createLocation(res, locationData);
      } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Delete a specific location from a trip by index
    this.router.delete('/:tripId/locations/:locationIndex', async (req: Request, res: Response, next: NextFunction) => {
      try {
        var tripId = req.params.tripId;
        var locationIndex = parseInt(req.params.locationIndex);
        
        console.log('Deleting location at index', locationIndex, 'from trip ID:', tripId);
        
        if (isNaN(locationIndex) || locationIndex < 0) {
          res.status(404).json({ error: "Invalid location index" });
          return;
        }
        
        // Check if tripId is a valid ObjectId format (24 hex characters)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(tripId);
        let tripQuery;
        
        if (isValidObjectId) {
          // If it's a valid ObjectId, search by _id
          tripQuery = await this.Trips.model.findOne({ _id: tripId });
        } else {
          // If it's not a valid ObjectId, search by tripId field
          tripQuery = await this.Trips.model.findOne({ tripId: tripId });
        }
        
        if (!tripQuery) {
          res.status(404).json({ error: "Trip not found" });
          return;
        }
        
        const numericTripId = tripQuery.tripId;
        console.log('Found trip with numeric tripId:', numericTripId);
        
        await this.Locations.deleteLocation(res, numericTripId, locationIndex);
        
      } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // Creates a new trip with initial places
    this.router.post('/create-with-places', async (req: Request, res: Response) => {
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
        
        // Create the trip first using the non-response method
        const tripResult = await this.Trips.createTripWithoutResponse(tripData);
        
        if (!tripResult.success) {
          console.error('Error creating trip:', tripResult.error);
          res.status(500).json({ 
            success: false, 
            message: 'Error creating trip',
            error: tripResult.error
          });
          return;
        }
        
        const createdPlaces = [];
        let hasErrors = false;
        
        // If places are provided, create each place/location
        if (req.body.places && req.body.places.length > 0) {
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
            
            const locationResult = await this.Locations.createLocationWithoutResponse(locationData);
            
            if (locationResult.success) {
              createdPlaces.push(locationResult.data);
            } else {
              console.error('Error creating location:', locationResult.error);
              hasErrors = true;
              // Continue with other places even if one fails
            }
          }
        }
        
        // Return success response with trip ID and created places info
        res.status(201).json({ 
          success: true, 
          message: hasErrors ? 'Trip created successfully with some place creation errors' : 'Trip created successfully with places',
          tripId: tripId,
          trip: tripResult.data,
          placesCreated: createdPlaces.length,
          totalPlaces: req.body.places ? req.body.places.length : 0
        });
        
      } catch (error) {
        console.error('Error creating trip with places:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error creating trip with places',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Update trip privacy status
    this.router.patch('/:tripId/privacy', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tripId = req.params.tripId;
        const { isPublic, userId } = req.body;
        
        // Validate required parameters
        if (typeof isPublic !== 'boolean') {
          res.status(400).json({ error: "isPublic must be a boolean value" });
          return;
        }
        
        console.log(`Updating privacy for trip ${tripId} to ${isPublic ? 'public' : 'private'}`);
        
        // Update the trip privacy (optionally check userId for security)
        await this.Trips.updateTripPrivacy(res, tripId, isPublic, userId);
        
      } catch (error) {
        console.error('Error updating trip privacy:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: "Failed to update trip privacy",
            details: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    });

    // Update photos for a specific location (direct photo update endpoint)
    this.router.put('/:tripId/locations/:placeIndex/photos', async (req: Request, res: Response) => {
      try {
        const tripId = req.params.tripId;
        const placeIndex = parseInt(req.params.placeIndex);
        const { photos } = req.body;
        
        if (isNaN(placeIndex) || placeIndex < 0) {
          res.status(400).json({ error: "Invalid place index" });
          return;
        }
        
        if (!Array.isArray(photos)) {
          res.status(400).json({ error: "Photos must be an array" });
          return;
        }
        
        console.log(`Updating photos for trip ${tripId}, location ${placeIndex}`);
        
        // Find the trip and validate location index
        const tripData = await this.Locations.model.findOne({ tripId: tripId });
        
        if (!tripData) {
          res.status(404).json({ error: "Trip not found" });
          return;
        }
        
        if (!tripData.locations || placeIndex >= tripData.locations.length) {
          res.status(404).json({ error: "Location not found at specified index" });
          return;
        }
        
        // Update photos array for the specific location
        const result = await this.Locations.model.findOneAndUpdate(
          { tripId: tripId },
          { $set: { [`locations.${placeIndex}.photos`]: photos } },
          { new: true, runValidators: true }
        );
        
        res.json({ 
          success: true, 
          message: "Photos updated successfully",
          location: result.locations[placeIndex]
        });
        
      } catch (error) {
        console.error('Error updating location photos:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: "Failed to update photos",
            details: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    });

    // Update entire location (including photos)
    this.router.put('/:tripId/locations/:placeIndex', async (req: Request, res: Response) => {
      try {
        const tripId = req.params.tripId;
        const placeIndex = parseInt(req.params.placeIndex);
        const locationData = req.body;
        
        if (isNaN(placeIndex) || placeIndex < 0) {
          res.status(400).json({ error: "Invalid place index" });
          return;
        }
        
        console.log(`Updating entire location for trip ${tripId}, location ${placeIndex}`);
        
        // Find the trip and validate location index
        const tripData = await this.Locations.model.findOne({ tripId: tripId });
        
        if (!tripData) {
          res.status(404).json({ error: "Trip not found" });
          return;
        }
        
        if (!tripData.locations || placeIndex >= tripData.locations.length) {
          res.status(404).json({ error: "Location not found at specified index" });
          return;
        }
        
        // Normalize address if provided
        let normalizedAddress = tripData.locations[placeIndex].address;
        if (locationData.address) {
          normalizedAddress = this.Locations.normalizeAddressInput(locationData.address);
        }
        
        // Calculate duration if dates are provided
        let duration = tripData.locations[placeIndex].duration;
        if (locationData.startDate && locationData.endDate) {
          const start = new Date(locationData.startDate);
          const end = new Date(locationData.endDate);
          duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        
        // Prepare update object with all fields
        const updateData = {
          [`locations.${placeIndex}.name`]: locationData.name || tripData.locations[placeIndex].name,
          [`locations.${placeIndex}.address`]: normalizedAddress,
          [`locations.${placeIndex}.description`]: locationData.description || tripData.locations[placeIndex].description,
          [`locations.${placeIndex}.startDate`]: locationData.startDate || tripData.locations[placeIndex].startDate,
          [`locations.${placeIndex}.endDate`]: locationData.endDate || tripData.locations[placeIndex].endDate,
          [`locations.${placeIndex}.duration`]: duration,
          [`locations.${placeIndex}.notes`]: locationData.notes || tripData.locations[placeIndex].notes,
          [`locations.${placeIndex}.photos`]: locationData.photos || tripData.locations[placeIndex].photos || [],
          [`locations.${placeIndex}.cost`]: locationData.cost !== undefined ? locationData.cost : tripData.locations[placeIndex].cost
        };
        
        // Update the specific location
        const result = await this.Locations.model.findOneAndUpdate(
          { tripId: tripId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        
        res.json({ 
          success: true, 
          message: "Location updated successfully",
          location: result.locations[placeIndex]
        });
        
      } catch (error) {
        console.error('Error updating location:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: "Failed to update location",
            details: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    });

    // Delete an entire trip and all its locations
    this.router.delete('/:tripId', async (req: Request, res: Response, next: NextFunction) => {
      try {
        var tripId = req.params.tripId;
        console.log('Deleting entire trip with ID:', tripId);
        
        // First delete all locations associated with this trip
        const locationsResult = await this.Locations.deleteAllLocationsForTripNoResponse(tripId);
        
        // Then delete the trip itself
        const tripResult = await this.Trips.deleteTripNoResponse(tripId);
        
        // Send a single success response
        res.json({ 
          success: true, 
          message: 'Trip and all locations deleted successfully',
          locationsDeleted: locationsResult.deletedCount,
          tripDeleted: tripResult.deletedCount
        });
        
      } catch (error) {
        console.error('Error deleting trip:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            message: 'Error deleting trip',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    });
  }
}

export { TripRouter };