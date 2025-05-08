const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true
        }
    ],
    itineraryData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    travelTime: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);