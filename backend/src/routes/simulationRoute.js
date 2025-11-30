import express from 'express';
import { processSimulationData } from '../controllers/simulationController.js';

const router = express.Router();

router.post('/data', processSimulationData);

export default router;
