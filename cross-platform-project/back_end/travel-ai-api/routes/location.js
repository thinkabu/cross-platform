const express = require("express");
const axios = require("axios");
const Location_v2 = require("../models/Location_v2");
const router = express.Router();
require("dotenv").config();

const GEOAPIFY_API_KEY = "9b7e7386fc6f4be792555d95aa82f3cb";
const WEATHER_API_KEY = "bb07903e32eb48f8b5484007251904";

router.post("/", async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          apiKey: GEOAPIFY_API_KEY,
        },
      }
    );

    const result =
      response.data.features[0]?.properties.formatted ||
      "Không tìm được địa chỉ";
    res.json({ address: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi gọi Geoapify" });
  }
});

// router.get("/around", async (req, res) => {
//   const { category, lat, lon, radius } = req.query;

//   try {
//     const response = await axios.get("https://api.geoapify.com/v2/places", {
//       params: {
//         categories: category,
//         filter: `circle:${lon},${lat},${radius || 20000}`,
//         limit: 20,
//         apiKey: GEOAPIFY_API_KEY,
//       },
//     });

//     // Lọc lại các trường cần thiết
//     const simplifiedData = await Promise.all(
//       response.data.features.map(async (feature) => {
//         const wikidata =
//           feature.properties?.wiki_and_media?.wikidata ||
//           feature.properties?.datasource?.raw?.wikidata ||
//           null;

//         const image = await translateImage(wikidata); // lấy ảnh từ wikidata nếu có

//         return {
//           name: feature.properties.name,
//           latitude: feature.geometry.coordinates[1],
//           longitude: feature.geometry.coordinates[0],
//           image: image || "", // nếu không có thì chuỗi rỗng
//         };
//       })
//     );

//     res.json(simplifiedData);
//   } catch (error) {
//     console.error("Geoapify error:", error.message);
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });




router.get("/around", async (req, res) => {
  const { category, lat, lon, radius } = req.query;

  try {
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories: category,
        filter: `circle:${lon},${lat},${radius || 20000}`,
        limit: 20,
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    // Chuyển map thành Promise.all để gọi song song nhiều API thời tiết
    const simplifiedData = await Promise.all(
      response.data.features.map(async (feature) => {
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        const weather = await getWeatherByCoords(latitude, longitude);
        const wikidata =
          feature.properties?.wiki_and_media?.wikidata ||
          feature.properties?.datasource?.raw?.wikidata ||
          null;
        const image = await translateImage(wikidata); // lấy ảnh từ wikidata nếu có
        return {
          name: feature.properties.name,
          latitude,
          longitude,
          address:
            feature.properties.address_line2 ||
            feature.properties.address_line1 ||
            "Không tìm thấy địa chỉ",
          image,
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

    res.json(simplifiedData);
  } catch (error) {
    console.error("Geoapify error:", error.message);
    res.status(500).json({ error: "Failed to fetch places" });
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

const translateImage = async (wikidata) => {
  try {
    const reponse = await axios.get(
      `https://www.wikidata.org/wiki/Special:EntityData/${wikidata}.json`
    );
    const image =
      reponse.data.entities[wikidata].claims.P18[0].mainsnak.datavalue.value;
    const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
      image.replace(/ /g, "_")
    )}`;
    return imageUrl;
  } catch (error) {
    console.error("Wikidata error:", error.message);
    return null; // Nếu lỗi, trả về null
  }
};

router.get("/test-translate-image", async (req, res) => {
  const { wikidata } = req.query; // Lấy wikidata từ query params

  if (!wikidata) {
    return res.status(400).json({ error: "Vui lòng cung cấp wikidata" });
  }

  try {
    const result = await translateImage(wikidata); // Gọi hàm translateImage
    res.json(result); // Trả về kết quả
  } catch (error) {
    console.error("Lỗi khi test translateImage:", error.message);
    res.status(500).json({ error: "Lỗi khi gọi translateImage" });
  }
});

const autocompletePlace = async (text) => {
  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text,
          format: "json",
          apiKey: GEOAPIFY_API_KEY,
        },
      }
    );

    const updatedResults = await Promise.all(
      response.data.results.map(async (item) => {
        const name = item.address_line1 || item.formatted || "Không có tên";
        const latitude = item.lat;
        const longitude = item.lon;
        const address =
          item.address_line2 ||
          item.address_line1 ||
          item.formatted ||
          "Không có địa chỉ";

        const weather = await getWeatherByCoords(latitude, longitude);

        const wikidata =
          item?.wiki_and_media?.wikidata ||
          item?.datasource?.raw?.wikidata ||
          null;

        const image = await translateImage(wikidata);

        return {
          name,
          latitude,
          longitude,
          address,
          image,
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

    return updatedResults;
  } catch (error) {
    console.error("Geoapify Autocomplete error:", error.message);
    return null;
  }
};

router.post("/static-map", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp latitude và longitude" });
  }

  try {
    const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=${GEOAPIFY_API_KEY}`;

    res.json({ mapUrl });
  } catch (error) {
    console.error("Static Map API error:", error.message);
    res.status(500).json({ error: "Lỗi khi tạo URL Static Map" });
  }
});

router.get("/static-map", (req, res) => {
  const { latitude, longitude } = req.query; // Lấy từ query thay vì body

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Thiếu tọa độ latitude hoặc longitude" });
  }

  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=${GEOAPIFY_API_KEY}`;

  res.json({ mapUrl });
});

router.get("/autocomplete-place", async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Vui lòng cung cấp từ khóa (text)" });
  }
  const result = await autocompletePlace(text);
  if (!result) {
    return res.status(500).json({ error: "Lỗi khi gọi Geoapify Autocomplete API" });
  }

  res.json(result);
});

// thêm location_v2
router.post("/location_v2", async (req, res) => {
  const locations = req.body;

  if (!Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ hoặc rỗng" });
  }

  try {
    const savedLocations = await Promise.all(
      locations.map(async (location) => {
        const {
          name,
          latitude,
          longitude,
          address,
          image,
          description,
          rating,
          open_time,
          close_time,
          category,
        } = location;

        if (
          !name ||
          !latitude ||
          !longitude ||
          !address ||
          !image ||
          !description ||
          !rating ||
          !open_time ||
          !close_time ||
          !category
        ) {
          throw new Error("Thiếu thông tin cần thiết trong dữ liệu location");
        }

        const newLocation = new Location_v2({
          name,
          latitude,
          longitude,
          address,
          image,
          description,
          rating,
          open_time,
          close_time,
          category,
        });

        return await newLocation.save();
      })
    );

    res.status(201).json({ message: "Thêm location thành công", data: savedLocations });
  } catch (error) {
    console.error("Lỗi khi thêm location:", error.message);
    res.status(500).json({ error: "Lỗi khi thêm location" });
  }
});

// lấy location_v2
router.get("/location_v2", async (req, res) => {
  try {
    const { category, time } = req.query;
    if (!category || !time) {
      return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin" });
    }

    const limit = parseInt(time) * 3;

    const queryCategory = category === "Ẩm thực" ? { category: { $ne: "Ẩm thực" } } : { category };
    const locations = await Location_v2.find(queryCategory).limit(limit).exec();

    const breakfasts = await Location_v2.find({
      category: { $in: ["Ẩm thực", "Quán cafe"] },
      open_time: { $in: ["11:30", "11:00", "10:00", "07:00", "06:30", "6:00"] }

    })
      .limit(parseInt(time))
      .exec();

    const breakfastIds = breakfasts.map(loc => loc._id);

    const dinners = await Location_v2.find({
      category: "Ẩm thực",
      _id: { $nin: breakfastIds },
      open_time: { $in: ["14:00", "16:00", "17:00", "18:00"] }
    })
      .limit(parseInt(time))
      .exec();

    res.json({
      message: "Lấy danh sách location thành công",
      locations,
      breakfasts,
      dinners
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách location:", error.message);
    res.status(500).json({ error: "Lỗi khi lấy danh sách location" });
  }
});

// update location_v2
router.put("/location_v2", async (req, res) => {
  const { category, updates } = req.body;

  if (!category || !updates || typeof updates !== "object") {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  try {
    const updatedLocations = await Location_v2.updateMany(
      { category },
      { $set: updates }
    );

    res.json({
      message: "Cập nhật location thành công",
      data: updatedLocations,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật location:", error.message);
    res.status(500).json({ error: "Lỗi khi cập nhật location" });
  }
});

// delete location_v2
router.delete("/location_v2", async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Vui lòng cung cấp category" });
  }

  try {
    const deletedLocations = await Location_v2.deleteMany({ category });

    res.json({
      message: "Xóa location thành công",
      data: deletedLocations,
    });
  } catch (error) {
    console.error("Lỗi khi xóa location:", error.message);
    res.status(500).json({ error: "Lỗi khi xóa location" });
  }
});

module.exports = router;
