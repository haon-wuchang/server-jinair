import express from "express";
const router = express.Router();
import * as controller from '../controller/mypageController.js';

router 
    .post('/getMyInfo', controller.getMyInfo)
    .post('/updateMyInfo', controller.updateMyInfo )
    .post('/checkPwd', controller.checkPwd )
    .post('/getMyRes', controller.getMyRes )
    .post('/getInterest', controller.getInterest )
    .post('/updateInterest', controller.updateInterest )
    .post('/getMyCoupon', controller.getMyCoupon )
    .post('/couponCount', controller.couponCount )
    .post('/applyCoupon', controller.applyCoupon )
    .post('/customTheme', controller.customTheme )
    .post('/customArea', controller.customArea )
    .post('/getMyQna', controller.getMyQna );

export default router;