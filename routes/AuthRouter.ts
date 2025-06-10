import { Router, Request, Response } from 'express';
import * as passport from 'passport';

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    // Google OAuth login route
    this.router.get('/google', 
      passport.authenticate('google', { 
        scope: ['profile', 'email'] 
      })
    );

    // Google OAuth callback route
    this.router.get('/google/callback', 
      passport.authenticate('google', { 
        successRedirect: '/',  // Redirect to Angular welcome page on success
        failureRedirect: '/'   // Redirect to Angular home page on failure
      })
    );

    // Logout route
    this.router.get('/logout', (req: Request, res: Response) => {
      req.logout((err) => {
        if (err) {
          console.error('Error during logout:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/');  // Redirect to Angular home page
      });
    });

    // Get current user route (for checking authentication status)
    this.router.get('/user', (req: Request, res: Response) => {
      if (req.isAuthenticated()) {
        res.json(req.user);
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    });

    // Check authentication status route
    this.router.get('/status', (req: Request, res: Response) => {
      res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? req.user : null
      });
    });
  }
}

export { AuthRouter };
export default AuthRouter;
