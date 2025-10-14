import express from 'express';

import shopglobalRouter from './shopglobal.route.js';
import companyRoutes from './company.route.js';     

const app = express()

app.use('/shopglobal', shopglobalRouter); // Main company routes

app.use('/companies', companyRoutes);

export default app;
