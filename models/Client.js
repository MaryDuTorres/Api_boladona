const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    location: { // [lng, lat]
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
ClientSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Client', ClientSchema);