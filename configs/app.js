'use strict'

// ECModules | ESModules
import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import reviewRoutes from '../src/review/review.routes.js'
import workerProfileRoutes from '../src/workerProfile/workerProfile.routes.js'
import chatRoutes from '../src/chat/chat.routes.js'
import jobeReQuestRoutes from '../src/jobRequest/jobRequest.routes.js'
import paymentRoutes from '../src/payment/payment.routes.js'
import rechargeRoutes from '../src/recharge/recharge.routes.js'

import { limiter } from '../middlewares/rate.limit.js'

const configs = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(helmet());
    app.use(limiter);
    app.use(morgan('dev'));
};

const routes = (app)=>{
    app.use(authRoutes);
    app.use('/v1/user', userRoutes);
    app.use('/v1/category', categoryRoutes);
    app.use('/v1/review', reviewRoutes);
    app.use('/v1/workerProfile', workerProfileRoutes);
    app.use('/v1/chat', chatRoutes);
    app.use('/v1/jobRequest', jobeReQuestRoutes);
    app.use('/v1/payment', paymentRoutes);
    app.use('/v1/recharge', rechargeRoutes);
   
   
};



export const initServer = async()=>{
    const app = express() 
    try{
        configs(app) 
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}
