import express from 'express';
import { foodData } from '../controllers/food.controller.js';
const router = express.Router();

router.post('/', foodData);

export default router;
