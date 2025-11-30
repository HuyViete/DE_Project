import express from 'express';
import { 
    getWarehouseStats, 
    getLinesStatus, 
    getActiveBatches, 
    getRecentProducts 
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getWarehouseStats);
router.get('/lines', getLinesStatus);
router.get('/batches', getActiveBatches);
router.get('/products', getRecentProducts);

export default router;
