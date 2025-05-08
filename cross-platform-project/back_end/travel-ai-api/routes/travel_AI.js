const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const Location = require("../models/Location");
const Itinerary = require("../models/Itinerary");

dotenv.config();
const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Tạo danh sách địa điểm du lịch bằng Genimi
router.post("/create_location", async (req, res) => {
    try {
        const { place, travelTime, travelType } = req.body;
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Hãy chỉ trả về một chuỗi JSON hợp lệ. Không thêm lời nói đầu, không mô tả.

                Tạo danh sách các địa điểm du lịch thành phố ${place} trong ${travelTime} ngày, dựa trên sở thích du lịch của người dùng: ${travelType.join(", ")}.

                Yêu cầu:
                - Số lượng địa điểm **tăng tỷ lệ thuận** với số ngày du lịch (${travelTime} ngày).
                Ví dụ: 1 ngày nên có khoảng 3–5 địa điểm, 3 ngày là khoảng 9–15 địa điểm.
                - Không cần phân loại theo ngày. Chỉ cần danh sách các địa điểm phù hợp với các sở thích đã chọn.

                Mỗi địa điểm cần có đầy đủ các trường sau:
                - name: tên địa điểm
                - coordinates: đối tượng chứa lat (vĩ độ) và lon (kinh độ)
                - open_hours: giờ mở cửa
                - rating: điểm đánh giá (từ 1 đến 5)
                - description: mô tả ngắn gọn
                - type: loại địa điểm (${travelType.join(", ")})

                Dữ liệu phải **chính xác theo định dạng JSON** sau:
                {
                    "place": "string", // tên địa điểm lớn (ví dụ: Hà Nội, Đà Nẵng...)
                    "travel_time": number, // số ngày du lịch
                    "locations": [
                        {
                        "name": "string", // tên địa điểm nhỏ
                        "coordinates": {
                            "lat": number, // vĩ độ
                            "lon": number  // kinh độ
                        },
                        "open_hours": "string", // giờ mở cửa (vd: 08:00 - 17:00)
                        "rating": number, // điểm đánh giá từ 1 đến 5
                        "description": "string", // mô tả ngắn gọn
                        "type": "string" // loại địa điểm 
                        }
                    ]
                    }

                ⚠️ Chỉ trả về **một mảng JSON hợp lệ**, không thêm mô tả, không ghi chú, không dùng dấu \`\`\`.`,
                        },
                    ],
                },
            ],
        });

        if (result && result.candidates && result.candidates[0] && result.candidates[0].content) {
            const text = result.candidates[0].content.parts[0].text;

            console.log("Phản hồi từ Gemini:", text);

            // Cố gắng trích xuất đoạn JSON đầu tiên trong văn bản
            const match = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);

            if (!match) {
                console.error("Không tìm thấy JSON trong phản hồi từ Gemini.");
                return res.status(500).send("Không thể phân tích dữ liệu JSON.");
            }

            try {
                const jsonStr = match[1] || match[0];
                const parsedData = JSON.parse(jsonStr);

                // Kiểm tra xem parsedData.locations có phải là một mảng
                if (!Array.isArray(parsedData.locations)) {
                    console.error("Trường 'locations' không phải là một mảng:", parsedData.locations);
                    return res.status(500).send("Dữ liệu JSON không hợp lệ.");
                }

                const batchId = new mongoose.Types.ObjectId().toString();
                const locationsWithBatch = parsedData.locations.map(loc => ({
                    ...loc,
                    batchId,

                }));
                console.log("type: " + travelType);

                await Location.insertMany(locationsWithBatch);

                res.json({
                    message: "Đã lưu thành công các địa điểm",
                    batchId: batchId,
                    place: parsedData.place,
                    travelTime: parsedData.travel_time,
                    locations: locationsWithBatch,
                });
            } catch (error) {
                console.log("type: " + travelType);
                console.error("Lỗi khi phân tích JSON:", error);
                return res.status(500).send("Dữ liệu JSON không hợp lệ.");
            }
        } else {
            res.status(500).send("Không thể lấy content từ kết quả.");
        }
    } catch (error) {
        console.error("Lỗi khi gọi Gemini:", error);
        res.status(500).send("Lỗi khi gọi Gemini API.");
    }
});

// Lấy danh sách địa điểm theo batchId
router.get("/locations", async (req, res) => {
    try {
        const { batchId } = req.query;

        if (!batchId) {
            return res.status(400).send("Thiếu batchId.");
        }

        const locations = await Location.find({ batchId });
        res.json(locations);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách địa điểm:", error);
        res.status(500).send("Lỗi khi lấy danh sách địa điểm.");
    }
});

// Thêm location tự chọn
router.post("/add_location", async (req, res) => {
    try {
        const { name, coordinates, open_hours, rating, description, type, batchId, } = req.body;

        const newLocation = new Location({
            name,
            coordinates,
            open_hours,
            rating,
            description,
            type,
            batchId,
        });

        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        console.error("Lỗi khi gọi Gemini:", error);
        res.status(500).send("Lỗi khi gọi Gemini API.");
    }
});

// Xóa location theo ID
router.delete("/delete_location/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Thiếu ID địa điểm.");
        }

        const deletedLocation = await Location.findByIdAndDelete(id);

        if (!deletedLocation) {
            return res.status(404).send("Không tìm thấy địa điểm với ID đã cho.");
        }

        res.json({ message: "Đã xóa địa điểm thành công." });
    }
    catch (error) {
        console.error("Lỗi khi xóa địa điểm:", error);
        res.status(500).send("Lỗi khi xóa địa điểm.");
    }
});

// Tao lịch trình du lịch bằng Genimi
// router.post("/create_itinerary", async (req, res) => {
//     const { userId, travelTime, batchId } = req.body;

//     if (!userId || !batchId || !travelTime) {
//         return res.status(400).json({ error: "Thiếu thông tin bắt buộc." });
//     }

//     try {
//         const locations = await Location.find({ batchId });

//         if (!locations.length) {
//             return res.status(404).json({ error: "Không tìm thấy địa điểm." });
//         }

//         const place = locations[0].name || "địa điểm";

//         const itinerary_prompt = `
// Hãy chỉ trả về một chuỗi JSON hợp lệ. Không thêm lời nói đầu, không mô tả.

// Tạo lịch trình du lịch tại ${place} trong ${travelTime} ngày, dựa trên danh sách các địa điểm sau:

// ${JSON.stringify(locations, null, 2)}

// Mỗi ngày gồm nhiều khung giờ hợp lý (ví dụ: 8:00, 10:30, 14:00, v.v.). Mỗi khung giờ là một địa điểm du lịch.

// Mỗi địa điểm cần có đầy đủ các trường sau:
// - name
// - coordinates (lat, lon)
// - open_hours
// - rating
// - description
// - type

// Dữ liệu phải **chính xác theo định dạng JSON** sau:

// "place": "string",
// "travel_time": number,
// "itinerary": {
//   "title": "string",
//   "description": "string",
//   "day1": [
//     {
//       "time": "string",
//       "location": {
//         "name": "string",
//         "coordinates": {
//           "lat": number,
//           "lon": number
//         },
//         "open_hours": "string",
//         "rating": number,
//         "description": "string",
//         "type": "string"
//       }
//     }
//   ]
// }
// Chỉ trả về JSON hợp lệ. Không được thêm mô tả hay lời nói đầu.
//         `;

//         const result = await ai.models.generateContent({
//             model: "gemini-1.5-flash",
//             contents: [{ role: "user", parts: [{ text: itinerary_prompt }] }],
//         });

//         const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
//         const match = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);

//         if (match) {
//             const jsonStr = match[1] || match[0];
//             const parsed = JSON.parse(jsonStr);

//             const newItinerary = await Itinerary.create({
//                 userId,
//                 locations: locations.map(loc => loc._id),
//                 travelTime,
//                 itineraryData: parsed.itinerary
//             });

//             res.json({ message: "Tạo lịch trình thành công", place: parsed.place, travelTime: parsed.travel_time, itinerary: newItinerary, itineraryId: newItinerary._id });
//         } else {
//             res.status(500).json({ error: "Không thể phân tích JSON từ Gemini." });
//         }
//     } catch (error) {
//         console.error("Lỗi khi tạo lịch trình:", error);
//         res.status(500).json({ error: "Lỗi khi tạo lịch trình." });
//     }
// });

// lấy lịch trình theo userId và batchId

router.post("/create_itinerary", async (req, res) => {

    const { userId, travelTime, locations} = req.body;
    console.log(JSON.stringify(locations));
    if (!userId || !travelTime || !locations) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc." });
    }

    try {
        if (!locations) {
            return res.status(404).json({ error: "Không tìm thấy địa điểm." });
        }

        const itinerary_prompt = `
Hãy chỉ trả về một chuỗi JSON hợp lệ. Không thêm lời nói đầu, không mô tả.

Tạo lịch trình du lịch tại Đà Nẵng trong ${travelTime} ngày, dựa trên dữ liệu danh sách các địa điểm sau:

Mỗi ngày sẽ 5 địa điểm trong đó có 2 địa điểm ăn uống trưa và tối sau cho phù hợp với open_time trong dữ liệu này:
Đây là các địa điểm:${JSON.stringify(locations)}

Mỗi địa điểm cần có đầy đủ các trường sau:
- name
- coordinates (lat, lon)
- open_time
- rating
- description
- type
- image

Lưu ý image phải được lấy ở trong dữ liệu tôi đã gửi ở trên phù hợp với tên địa điểm
Dữ liệu phải **chính xác theo định dạng JSON** sau:

"travel_time": number,
"itinerary": {
  "day1": [
    {
      "time": "string",
      "location": {
        "name": "string",
        "coordinates": {
          "lat": number,
          "lon": number
        },
        "open_time": "string",
        "rating": number,
        "description": "string",
        "image":"string",
        "address":"string"
      }
    }
  ]
}
Chỉ trả về JSON hợp lệ. Không được thêm mô tả hay lời nói đầu.
        `;

        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: itinerary_prompt }] }],
        });

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        const match = text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
        console.log(match);
        if (match) {
            const jsonStr = match[1] || match[0];
            const parsed = JSON.parse(jsonStr);

            const newItinerary = await Itinerary.create({
                userId,
                locations: locations.map(loc => loc._id),
                travelTime,
                itineraryData: parsed.itinerary
            });

            res.json({ message: "Tạo lịch trình thành công", place: parsed.place, travelTime: parsed.travel_time, itinerary: newItinerary, itineraryId: newItinerary._id });
        } else {
            res.status(500).json({ error: "Không thể phân tích JSON từ Gemini." });
        }
    } catch (error) {
        console.error("Lỗi khi tạo lịch trình:", error);
        res.status(500).json({ error: "Lỗi khi tạo lịch trình." });
    }
});

router.get("/itinerary/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Thiếu ID lịch trình.");
        }

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).send("Không tìm thấy lịch trình với ID đã cho.");
        }

        res.json(itinerary.itineraryData);
    } catch (error) {
        console.error("Lỗi khi lấy lịch trình:", error);
        res.status(500).send("Lỗi khi lấy lịch trình.");
    }
});



module.exports = router;
