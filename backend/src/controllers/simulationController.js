import axios from 'axios';
import { storeProduct } from '../models/Product.js';

export const processSimulationData = async (req, res) => {
    try {
        const inputData = req.body;
        const io = req.app.get('io');

        console.log("Received simulation data:", inputData);

        // 1. Call AI Service
        // Assuming AI service is running locally on port 8000
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
        
        let prediction = null;
        try {
            const aiResponse = await axios.post(`${aiServiceUrl}/predict`, inputData);
            prediction = aiResponse.data;
        } catch (aiError) {
            console.error("Error calling AI service:", aiError.message);
            // We can still proceed without prediction or return error
            // For now, let's return error to the simulation script
            return res.status(502).json({ message: "AI Service Unavailable", error: aiError.message });
        }

        // 2. Store Data in Database
        try {
            await storeProduct(inputData, prediction);
        } catch (dbError) {
            console.error("Database storage failed:", dbError);
            // Decide if we want to fail the request or just log it. 
            // Usually, if storage fails, we should probably alert.
        }

        // 3. Combine Data
        const combinedData = {
            ...inputData,
            ...prediction,
            timestamp: new Date().toISOString()
        };

        // 4. Emit to Frontend via Socket.io
        if (io) {
            io.emit('sensor_update', combinedData);
            console.log("Emitted sensor_update event");
        } else {
            console.error("Socket.io instance not found");
        }

        // 5. Respond to Simulation Script
        res.status(200).json(combinedData);

    } catch (error) {
        console.error("Error processing simulation data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
