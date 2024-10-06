const express = require("express");
const zod = require("zod");
const { Satellite, LandsatData } = require("../root/db");
const router = express.Router();
const { authMiddleware } = require("../middleware/middleware");
const axios = require('axios');
const ee = require('@google/earthengine'); // Import the Earth Engine API

// Initialize Earth Engine with the access token (use your token here)
const privateKey = require('../ee-harrypandey121-ce58dd815590.json'); // Make sure the path is correct
ee.data.authenticateViaPrivateKey(privateKey, () => {
    ee.initialize(null, null, () => {
        console.log('Earth Engine client initialized.');
    }, (err) => {
        console.error('Error initializing Earth Engine client:', err);
    });
});

// Schema for setting satellite location
const satelliteLocationSchema = zod.object({
    latitude: zod.number(),
    longitude: zod.number(),
    satelliteName: zod.string()
});

// Schema for Landsat data request
const landsatRequestSchema = zod.object({
    latitude: zod.number(),
    longitude: zod.number(),
    cloudCoverThreshold: zod.number().optional(),
    startDate: zod.string().optional(),
    endDate: zod.string().optional()
});

// Route to set satellite location
router.post("/set-location", authMiddleware, async (req, res) => {
    const { success } = satelliteLocationSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input provided.",
        });
    }

    try {
        const { latitude, longitude, satelliteName } = req.body;
        const newLocation = new Satellite({
            userId: req.userId,
            latitude,
            longitude,
            satelliteName,
            timestamp: new Date()
        });

        await newLocation.save();

        res.status(201).json({
            message: "Satellite location set successfully",
            location: newLocation
        });
    } catch (error) {
        console.error('Error setting satellite location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get satellite location
router.get("/get-location", authMiddleware, async (req, res) => {
    try {
        const location = await Satellite.findOne({ userId: req.userId }).sort({ timestamp: -1 });

        if (!location) {
            return res.status(404).json({ error: 'No location found for this user' });
        }

        res.json(location);
    } catch (error) {
        console.error('Error getting satellite location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get Landsat data from GEE
router.post("/landsat-data", authMiddleware, async (req, res) => {
    const { success } = landsatRequestSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid input provided." });
    }

    try {
        const { latitude, longitude, cloudCoverThreshold = 10, startDate, endDate } = req.body;
        const point = ee.Geometry.Point([longitude, latitude]);

  
        let imageCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
            .filterBounds(point)
            .filterDate(startDate || '2020-01-01', endDate || new Date().toISOString().split('T')[0])
            .filterMetadata('CLOUD_COVER', 'less_than', cloudCoverThreshold);

        const imageCount = await imageCollection.size().getInfo();
        console.log('Image count:', imageCount);
        if (imageCount === 0) {
            return res.status(404).json({ message: 'No Landsat images found for the given parameters.' });
        }

        const landsatImage = imageCollection.first();
        const imageInfo = await landsatImage.getInfo();

      
        const ndvi = landsatImage.normalizedDifference(['B5', 'B4']);
        const ndviUrl = await ndvi.getThumbURL({ region: point, dimensions: 500 });

       
        const newLandsatData = new LandsatData({
            userId: req.userId,
            latitude,
            longitude,
            data: { ndviUrl, imageInfo },
            timestamp: new Date()
        });

        await newLandsatData.save();

        res.json({
            message: "Landsat data retrieved successfully",
            data: { ndviUrl, imageInfo }
        });
    } catch (error) {
        console.error('Error fetching Landsat data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Route to update notification settings
router.put("/notification-settings", authMiddleware, async (req, res) => {
    const notificationSchema = zod.object({
        leadTime: zod.number(),
        method: zod.enum(['email', 'sms', 'push'])
    });

    const { success } = notificationSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid input provided.",
        });
    }

    try {
        const { leadTime, method } = req.body;
        await Satellite.findOneAndUpdate(
            { userId: req.userId },
            { $set: { notificationLeadTime: leadTime, notificationMethod: method } },
            { upsert: true, new: true }
        );

        res.json({
            message: "Notification settings updated successfully"
        });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
