const express = require("express");
const axios = require("axios");
const router = express.Router();

const GEOAPIFY_API_KEY = "9b7e7386fc6f4be792555d95aa82f3cb";

router.get("/distance-time", async (req, res) => {
  try {
    const { origin_lat, origin_lng, dest_lat, dest_lng } = req.query;

    if (!origin_lat || !origin_lng || !dest_lat || !dest_lng) {
      return res.status(400).json({ message: "Thiếu tọa độ." });
    }

    const response = await axios.get("https://api.geoapify.com/v1/routing", {
      params: {
        waypoints: `${origin_lat},${origin_lng}|${dest_lat},${dest_lng}`,
        mode: "drive",
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    const route = response.data.features[0];

    const distance = route.properties.distance;
    const time = route.properties.time;
    const coordinates = route.geometry.coordinates[0].map((coord) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    res.json({
      distance_text: (distance / 1000).toFixed(1) + " km",
      duration_text: Math.round(time / 60) + " phút",
      coordinates: coordinates,
    });
  } catch (error) {
    console.error("Lỗi API Distance-Time:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
});

module.exports = router;
