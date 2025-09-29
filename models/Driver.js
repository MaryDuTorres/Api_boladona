const mongoose = require('mongoose');
const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    vehicle: String,
    location: { 
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    createdAt: { type: Date, default: Date.now }
});
DriverSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Driver', DriverSchema);