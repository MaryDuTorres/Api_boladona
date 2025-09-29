const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required:
true },
items: [{ description: String, qty: Number }],
status: { type: String, enum:
['pending','assigned','in_transit','delivered','cancelled'], default:
'pending' },
assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
pickupLocation: { type: [Number] }, // [lng, lat]
deliveryLocation: { type: [Number] },
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);