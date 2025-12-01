import { 
  getAlertsByWarehouse, 
  getUnreadAlertCount, 
  markAlertAsRead, 
  markAllAlertsAsRead,
  getAlertSettings,
  upsertAlertSetting
} from '../models/Alert.js';

export const getAlerts = async (req, res) => {
  try {
    const warehouseId = req.user.warehouse_id;
    if (!warehouseId) return res.status(400).json({ message: "User not in a warehouse" });

    const alerts = await getAlertsByWarehouse(warehouseId);
    const unreadCount = await getUnreadAlertCount(warehouseId);

    res.status(200).json({ alerts, unreadCount });
  } catch (error) {
    console.error("Get alerts failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markRead = async (req, res) => {
  try {
    const { alertId } = req.body;
    if (alertId) {
      await markAlertAsRead(alertId);
    } else {
      const warehouseId = req.user.warehouse_id;
      await markAllAlertsAsRead(warehouseId);
    }
    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    console.error("Mark read failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSettings = async (req, res) => {
  try {
    const warehouseId = req.user.warehouse_id;
    if (!warehouseId) return res.status(400).json({ message: "User not in a warehouse" });

    const settings = await getAlertSettings(warehouseId);
    res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const warehouseId = req.user.warehouse_id;
    const { settings } = req.body; // Array of { metric, min, max, enabled }

    console.log(`[Update Settings] User: ${req.user.username}, WarehouseID: ${warehouseId}`);
    console.log(`[Update Settings] Payload:`, JSON.stringify(settings));

    if (!warehouseId) {
        return res.status(400).json({ message: "User not in a warehouse" });
    }

    if (!Array.isArray(settings)) {
      return res.status(400).json({ message: "Invalid settings format" });
    }

    for (const setting of settings) {
      await upsertAlertSetting(
        warehouseId, 
        setting.metric, 
        setting.min, 
        setting.max, 
        setting.enabled
      );
    }

    res.status(200).json({ message: "Settings updated" });
  } catch (error) {
    console.error("Update settings failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
