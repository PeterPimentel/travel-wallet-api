import { Router } from 'express';

import * as authController from '../controllers/authController';
import * as travelController from '../controllers/travelController';
import * as expenseController from '../controllers/expenseController';
import * as coverController from '../controllers/coverController';
import * as monitoringController from '../controllers/monitoringController';
import * as cmsController from '../controllers/cmsController';
import * as userController from '../controllers/userController';
import * as locationController from '../controllers/locationController';

import * as guardMiddleware from '../middlewares/guardMiddleware';

import { ROLE } from '../util/constants';

const router = Router();
// API PATH
router.get('/status', monitoringController.status);

// AUTH PATH
router.post('/api/auth/signin', authController.signin);
router.post('/api/auth/signup', authController.signup);
router.get('/api/auth/session', guardMiddleware.authGuard(ROLE.user), authController.session);
router.get('/api/auth/activation/retry', guardMiddleware.authGuard(ROLE.user), authController.activationRetry);
router.get('/api/auth/activation/confirm/:token', authController.signupConfirm);
router.post('/api/auth/password/reset', authController.passwordResetRequest);
router.put('/api/auth/password/reset', authController.passwordUpdate);

// USER PATH
router.delete('/api/user', guardMiddleware.authGuard(ROLE.user), userController.remove);

// TRAVEL PATH
router.post('/api/travel', guardMiddleware.authGuard(ROLE.user), guardMiddleware.activationGuard, travelController.create);
router.get('/api/travel', guardMiddleware.authGuard(ROLE.user), travelController.find);
router.get('/api/travel/:id', guardMiddleware.authGuard(ROLE.user), travelController.findOne);
router.put('/api/travel/:id', guardMiddleware.authGuard(ROLE.user), guardMiddleware.activationGuard, travelController.update);
router.delete('/api/travel/:id', guardMiddleware.authGuard(ROLE.user), travelController.remove);

// EXPENSE PATH
router.post('/api/expense', guardMiddleware.authGuard(ROLE.user), guardMiddleware.activationGuard, expenseController.create);
router.put('/api/expense/:id', guardMiddleware.authGuard(ROLE.user), guardMiddleware.activationGuard, expenseController.update);
router.delete('/api/expense/:id', guardMiddleware.authGuard(ROLE.user), expenseController.remove);

// COVER PATH
router.post('/api/cover', guardMiddleware.authGuard(ROLE.admin), coverController.create);
router.put('/api/cover/:id', guardMiddleware.authGuard(ROLE.admin), coverController.update);
router.delete('/api/cover/:id', guardMiddleware.authGuard(ROLE.admin), coverController.remove);
router.get('/api/cover', guardMiddleware.authGuard(ROLE.user), coverController.findAll);

// CMS PATH
router.get('/api/cms/landing_page', cmsController.landingPage);

// LOCATION PATH
router.post('/api/location/place', guardMiddleware.authGuard(ROLE.user), locationController.findPlace);

export default router;
