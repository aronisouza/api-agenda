import { Router } from 'express';
import { AgendasController } from '../controllers/AgendasController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class AgendasRouters {
    private router: Router;
    private agendasController: AgendasController;
    private authMiddleware: AuthMiddleware;
    
    constructor() {
        this.router = Router();
        this.agendasController = new AgendasController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes(): Router {
        this.router.post(
            '/',
            this.authMiddleware.auth.bind(this.authMiddleware),
            this.agendasController.store.bind(this.agendasController)
        );
        this.router.get(
            '/',
            this.authMiddleware.auth.bind(this.authMiddleware),
            this.agendasController.index.bind(this.agendasController)
        );
        this.router.put(
            '/:id',
            this.authMiddleware.auth.bind(this.authMiddleware),
            this.agendasController.update.bind(this.agendasController)
        );


        return this.router;
    }
}

export { AgendasRouters };