import { pool } from "../libs/db.js";

export async function getAuditLogsByWarehouse(warehouseId) {
  const [rows] = await pool.query(
    `SELECT log_id, event, description, time_log, warehouse_id, engineer_id
     FROM auditlog
     WHERE warehouse_id = ?
     ORDER BY time_log DESC
     LIMIT 100`,
    [warehouseId]
  );
  return rows;
}

export async function getAuditLogById(logId) {
  const [rows] = await pool.query(
    `SELECT log_id, event, description, time_log, warehouse_id, engineer_id
     FROM auditlog
     WHERE log_id = ?`,
    [logId]
  );
  return rows[0];
}

export async function createAuditLog(event, description, warehouseId, engineerId = null) {
  // Get the next log_id (since log_id is not auto_increment)
  const [maxResult] = await pool.query(`SELECT COALESCE(MAX(log_id), 0) + 1 AS next_id FROM auditlog`);
  const nextId = maxResult[0].next_id;

  await pool.query(
    `INSERT INTO auditlog (log_id, event, description, warehouse_id, engineer_id)
     VALUES (?, ?, ?, ?, ?)`,
    [nextId, event, description, warehouseId, engineerId]
  );
  
  return { log_id: nextId, event, description, warehouse_id: warehouseId };
}

export async function deleteAuditLog(logId) {
  await pool.query(`DELETE FROM auditlog WHERE log_id = ?`, [logId]);
}
