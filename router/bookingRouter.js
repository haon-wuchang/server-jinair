import express from 'express';
import * as controller from '../controller/bookingController.js';

const router = express.Router();

router.post('/availability', controller.getOnewayList)
        .post('/lowPrice', controller.getLowPrice)
        .post('/user', controller.getUserInfo)
        .post('/seats', controller.getSeats);

export default router;