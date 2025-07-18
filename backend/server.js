import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import {connectDB} from './config/db.js';

import authRoutes from './routes/auth.route.js';
import cartRoutes from './routes/cart.route.js';
import foodRoutes from './routes/food.route.js';
import orderRoutes from './routes/order.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/data', foodRoutes);
app.use('/api/orders', orderRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})
