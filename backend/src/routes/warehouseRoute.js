import express from 'express';
import { createWarehouse, joinWarehouse, generateToken, getWarehouseInfo } from '../controllers/warehouseController.js';

const router = express.Router();

router.post('/create', createWarehouse);
router.post('/join', joinWarehouse);
router.post('/token', generateToken);
router.get('/', getWarehouseInfo);

export default router;
