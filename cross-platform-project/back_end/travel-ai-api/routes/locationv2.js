const express = require("express");
const axios = require("axios");
const Location_v2 = require("../models/Location_v2");
const router = express.Router();
const WEATHER_API_KEY = "bb07903e32eb48f8b5484007251904";

router.get("/", async (req, res) => {
  try {
    const locations = await Location_v2.find({});
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi server" });
  }
});

const getWeatherByCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://api.weatherapi.com/v1/current.json",
      {
        params: {
          key: WEATHER_API_KEY,
          q: `${latitude},${longitude}`,
        },
      }
    );
    return response.data; // Trả về thông tin thời tiết hiện tại
  } catch (error) {
    console.error("WeatherAPI error:", error.message);
    return null; // Nếu lỗi, trả về null
  }
};

router.get("/filter_category", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const locations = await Location_v2.find(query);

    const locationsWithWeather = await Promise.all(
      locations.map(async (location) => {
        const weather = await getWeatherByCoords(
          location.latitude,
          location.longitude
        );

        return {
          ...location.toObject(),
          weather: weather
            ? {
                condition: weather.current.condition.text,
                temperature_c: weather.current.temp_c,
                icon: weather.current.condition.icon,
              }
            : null,
        };
      })
    );

    res.status(200).json(locationsWithWeather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi server" });
  }
});

const searchLocation = async (req, res) => {
  try {
    const { textSearch } = req.query;
    console.log("textSearch", textSearch);

    if (!textSearch) {
      return res
        .status(400)
        .json({ message: "Text search parameter is required" });
    }

    const locations = await Location_v2.find({
      $or: [
        { name: { $regex: textSearch, $options: "i" } },
      ],
    });

    if (locations.length === 0) {
      return res.status(200).json(0);
    }

    const locationsWithWeather = await Promise.all(
      locations.map(async (location) => {
        const weather = await getWeatherByCoords(
          location.latitude,
          location.longitude
        );

        return {
          ...location.toObject(),
          weather: weather
            ? {
                condition: weather.current.condition.text,
                temperature_c: weather.current.temp_c,
                icon: weather.current.condition.icon,
              }
            : null,
        };
      })
    );

    res.status(200).json(locationsWithWeather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

router.get("/search", searchLocation);

module.exports = router;
