import { Request, Response, NextFunction } from 'express';

class TripController {
  // Later you can inject a TripService if needed

  public getAllTrips(req: Request, res: Response, next: NextFunction): void {
    try {
      const trips = [
        { id: 1, name: 'Trip to Japan' },
        { id: 2, name: 'Trip to France' },
      ];
      res.json(trips);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public getTripById(req: Request, res: Response, next: NextFunction): void {
    try {
      const tripId = req.params.id; // pull the id from the URL
      const trip = { id: tripId, name: 'Trip to Japan' }; // dummy example, you can fetch from DB later
      console.log("Test");
      res.json(trip);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

}

export { TripController };