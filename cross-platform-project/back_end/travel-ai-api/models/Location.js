const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        }
    },
    open_hours: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['attraction', 'cafe', 'club', 'restaurant', 'relax', 'outdoor', 'shopping'],
        required: true
    },
    batchId: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Location', locationSchema);