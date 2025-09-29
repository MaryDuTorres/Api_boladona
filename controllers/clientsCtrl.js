const Client = require('../models/Client');
exports.list = async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
};
exports.create = async (req, res) => {
    const c = new Client(req.body);
    await c.save();
    res.status(201).json(c);
};
exports.get = async (req, res) => {
    const c = await Client.findById(req.params.id);
    if (!c) return res.status(404).send('Not found');
    res.json(c);
};
exports.update = async (req, res) => {
    const c = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.json(c);
};
exports.remove = async (req, res) => {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
};