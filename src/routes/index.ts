import { Router } from 'express';

import * as authController from '../controllers/authController';
import * as travelController from '../controllers/travelController';
import * as expenseController from '../controllers/expenseController';
import * as coverController from '../controllers/coverController';
import * as monitoringController from '../controllers/monitoringController';

import * as guardMiddleware from '../middlewares/guardMiddleware';

const router = Router();
// API PATH
router.get('/status', monitoringController.status);

// AUTH PATH
router.post('/api/auth/signin', authController.signin);
router.get('/api/auth/session', guardMiddleware.authGuard('USER'), authController.session);

// TRAVEL PATH
router.post('/api/travel', guardMiddleware.authGuard('USER'), travelController.create);
router.get('/api/travel', guardMiddleware.authGuard('USER'), travelController.find);
router.get('/api/travel/:id', guardMiddleware.authGuard('USER'), travelController.findOne);
router.put('/api/travel/:id', guardMiddleware.authGuard('USER'), travelController.update);
router.delete('/api/travel/:id', guardMiddleware.authGuard('USER'), travelController.remove);

// EXPENSE PATH
router.post('/api/expense', guardMiddleware.authGuard('USER'), expenseController.create);
router.put('/api/expense/:id', guardMiddleware.authGuard('USER'), expenseController.update);
router.delete('/api/expense/:id', guardMiddleware.authGuard('USER'), expenseController.remove);

// COVER PATH
router.post('/api/cover', guardMiddleware.authGuard('ADMIN'), coverController.create);
router.put('/api/cover/:id', guardMiddleware.authGuard('ADMIN'), coverController.update);
router.delete('/api/cover/:id', guardMiddleware.authGuard('ADMIN'), coverController.remove);
router.get('/api/cover', guardMiddleware.authGuard('ALL'), coverController.findAll);

export default router;
