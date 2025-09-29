const Order = require('../models/Order');
exports.list = async (req, res) => {
    res.json(await
        Order.find().populate('client assignedDriver'));
};
exports.create = async (req, res) => {
    const o = new Order(req.body); await
        o.save(); res.status(201).json(await o.populate('client'));
};
exports.get = async (req, res) => {
    const o = await
        Order.findById(req.params.id)
            .populate('client assignedDriver');

    if (!o) return res.status(404).send('Not found');
    res.json(o);
};
exports.update = async (req, res) => {
    const o = await
        Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        .populate('client assignedDriver'); 
    res.json(o);
};
exports.remove = async (req, res) => {
    await
        Order.findByIdAndDelete(req.params.id); res.json({ ok: true });
};

exports.list = async (req, res) => {
    const query = {};
    if (req.query.driverId) {
        query.assignedDriver = req.query.driverId; // Filtra pelo ID do motorista
    }
    
    res.json(await
        Order.find(query).populate('client assignedDriver')); 
};