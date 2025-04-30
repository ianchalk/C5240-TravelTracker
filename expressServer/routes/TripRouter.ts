import { Router, Request, Response, NextFunction } from 'express';
import { TripController } from '../controllers/TripController';

class TripRouter {
  public router: Router;
  private tripController: TripController;

  constructor() {
    this.tripController = new TripController();
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      this.tripController.getAllTrips(req, res, next);
    });


    this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
      this.tripController.getTripById(req, res, next);
    });
  
  }

  
}

export { TripRouter };