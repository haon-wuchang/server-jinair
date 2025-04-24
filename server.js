import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mypageRouter from './router/mypageRouter.js'
import uploadRouter from './router/uploadRouter.js'
import loginRouter from './router/loginRouter.js';
import chatbotRouter from './router/chatbotRouter.js';
import adminRouter from './router/adminRouter.js';
import bookingRouter from './router/bookingRouter.js';
import paynmentsRouter from './router/paymentsRouter.js'
import paynmentRouter from './router/paymentRouter.js' 
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const server = express();
const port = 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, '../.env') }); // 루트에 .env가 있을 경우
dotenv.config();

//common
server.use(express.json());
server.use(express.urlencoded());
server.use(cors());
server.use("/images", express.static(path.join("images")));
server.use('/upload_files', express.static(path.join("upload_files")));
// login
server.use('/member', loginRouter);

// admin
server.use('/admin', adminRouter);

// middle ware
server.use('/mypage', mypageRouter)
server.use('/uploads', uploadRouter);
server.use('/booking', bookingRouter);

// chatbot
server.use('/chatbot', chatbotRouter);

//payment
server.use('/payment', paynmentRouter); 

//order
server.use('/sandbox-dev/api/v1/payments', paynmentsRouter);


server.listen(port, () => {
    console.log('start ----->>', port);
});  


