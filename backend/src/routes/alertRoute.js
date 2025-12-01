import express from 'express';
import { getAlerts, markRead, getSettings, updateSettings } from '../controllers/alertController.js';

const router = express.Router();

router.get('/', getAlerts);
router.post('/read', markRead);
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

export default router;
