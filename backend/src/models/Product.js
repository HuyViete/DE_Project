import { pool } from "../libs/db.js";

const ATTRIBUTE_MAP = {
    'fixed acidity': 'fixed_acidity',
    'volatile acidity': 'volatile_acidity',
    'citric acid': 'citric_acid',
    'residual sugar': 'residual_sugar',
    'chlorides': 'chlorides',
    'free sulfur dioxide': 'free_sulfur_dioxide',
    'total sulfur dioxide': 'total_sulfur_dioxide',
    'density': 'density',
    'pH': 'pH',
    'sulphates': 'sulphates',
    'alcohol': 'alcohol'
};

const SENSOR_UNITS = {
    'fixed acidity': 'g/dm^3',
    'volatile acidity': 'g/dm^3',
    'citric acid': 'g/dm^3',
    'residual sugar': 'g/dm^3',
    'chlorides': 'g/dm^3',
    'free sulfur dioxide': 'mg/dm^3',
    'total sulfur dioxide': 'mg/dm^3',
    'density': 'g/cm^3',
    'pH': 'pH',
    'sulphates': 'g/dm^3',
    'alcohol': '% vol'
};

export async function storeProduct(data, prediction) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            line_id,
            batch_id,
            product_id,
            type,
            warehouse_id,
            ...attributes
        } = data;

        // 1. Ensure Warehouse exists
        // Use the provided warehouse_id or default to 1
        const targetWarehouseId = warehouse_id || 1;
        
        await connection.query(
            `INSERT IGNORE INTO warehouse (warehouse_id, categories) VALUES (?, ?)`,
            [targetWarehouseId, 'Main Production']
        );

        // 2. Ensure Line exists
        await connection.query(
            `INSERT IGNORE INTO line (line_id, warehouse_id) VALUES (?, ?)`,
            [line_id, targetWarehouseId]
        );

        // 3. Ensure Sensors exist for this line
        // We generate sensor IDs based on line_id and attribute index
        // Scheme: line_id * 100 + index (1-11)
        const attributeKeys = Object.keys(ATTRIBUTE_MAP);
        for (let i = 0; i < attributeKeys.length; i++) {
            const attr = attributeKeys[i];
            const sensorId = line_id * 1000 + (i + 1); // e.g., 1001, 1002...
            
            await connection.query(
                `INSERT IGNORE INTO sensors (sensor_id, model, unit, line_id) VALUES (?, ?, ?, ?)`,
                [sensorId, `Sensor-${attr}`, SENSOR_UNITS[attr] || 'unit', line_id]
            );
        }

        // 4. Ensure Batch exists
        await connection.query(
            `INSERT IGNORE INTO batches (batch_id, line_id, quantity) VALUES (?, ?, ?)`,
            [batch_id, line_id, 0]
        );
        
        // Update quantity
        await connection.query(
            `UPDATE batches SET quantity = quantity + 1 WHERE batch_id = ?`,
            [batch_id]
        );

        // 5. Insert Product
        // Map attributes to DB columns
        const productColumns = ['product_id', 'batch_id'];
        const productValues = [product_id, batch_id];

        for (const [key, dbCol] of Object.entries(ATTRIBUTE_MAP)) {
            if (attributes[key] !== undefined) {
                productColumns.push(dbCol);
                productValues.push(attributes[key]);
            }
        }

        const placeholders = productValues.map(() => '?').join(', ');
        const sql = `INSERT INTO product (${productColumns.join(', ')}) VALUES (${placeholders})`;
        
        await connection.query(sql, productValues);

        // 6. Insert Measures
        for (let i = 0; i < attributeKeys.length; i++) {
            const attr = attributeKeys[i];
            if (attributes[attr] !== undefined) {
                const sensorId = line_id * 1000 + (i + 1);
                await connection.query(
                    `INSERT INTO measure (product_id, sensor_id, value) VALUES (?, ?, ?)`,
                    [product_id, sensorId, attributes[attr]]
                );
            }
        }

        // 7. Ensure AI Model exists
        const modelId = 1; // Default model ID
        await connection.query(
            `INSERT IGNORE INTO ai_model (model_id, version) VALUES (?, ?)`,
            [modelId, 'v1.0']
        );

        // 8. Insert Prediction
        if (prediction) {
            await connection.query(
                `INSERT INTO is_predicted (time_predict, quality_score, confidence, quality_category, product_id, AI_model) 
                 VALUES (NOW(), ?, ?, ?, ?, ?)`,
                [
                    prediction.quality_score, 
                    'High', // Mock confidence or calculate it
                    prediction.quality_class.toString(), 
                    product_id, 
                    modelId
                ]
            );
        }

        await connection.commit();
        console.log(`Stored data for product ${product_id}`);

    } catch (error) {
        await connection.rollback();
        console.error("Error storing simulation data:", error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function getRecentProducts(limit = 50) {
    const [rows] = await pool.query(`
        SELECT 
            p.*,
            b.line_id,
            ip.quality_score,
            ip.quality_category as quality_class,
            ip.time_predict as timestamp
        FROM product p
        JOIN batches b ON p.batch_id = b.batch_id
        LEFT JOIN is_predicted ip ON p.product_id = ip.product_id
        ORDER BY ip.time_predict DESC
        LIMIT ?
    `, [limit]);

    // Map DB columns back to frontend expected format
    return rows.map(row => ({
        ...row,
        'fixed acidity': row.fixed_acidity,
        'volatile acidity': row.volatile_acidity,
        'citric acid': row.citric_acid,
        'residual sugar': row.residual_sugar,
        'free sulfur dioxide': row.free_sulfur_dioxide,
        'total sulfur dioxide': row.total_sulfur_dioxide,
        // Add default type if missing (since we don't store it yet)
        type: row.type || 'unknown' 
    }));
}