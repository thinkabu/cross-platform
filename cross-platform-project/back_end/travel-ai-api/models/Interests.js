const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Interest', InterestSchema);