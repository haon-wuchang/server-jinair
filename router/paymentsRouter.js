import express from 'express';
import * as controller from '../controller/paymentsController.js';

const router = express.Router();

router.route('/confirm').post(controller.confirmPayment);

export default router;
 