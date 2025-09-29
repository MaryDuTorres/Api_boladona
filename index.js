require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const clientsRoute = require('./routes/clients');
const driversRoute = require('./routes/drivers');
const ordersRoute = require('./routes/orders');
const routesRoute = require('./routes/routes');
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/api/clients', clientsRoute);
app.use('/api/drivers', driversRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/routes', routesRoute);
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI)
    .then(() => app.listen(PORT, () => console.log('Servidor rodando na porta ', PORT)))
    .catch(err => console.error(err));