const Driver = require('../models/Driver');
exports.list = async (req, res) => { res.json(await Driver.find()); };
exports.create = async (req, res) => {
    const d = new Driver(req.body); await
        d.save(); res.status(201).json(d);
};
exports.get = async (req, res) => {
    const d = await
        Driver.findById(req.params.id); if (!d) return res.status(404).send('Not found'); res.json(d);
};
exports.update = async (req, res) => {
    const d = await
        Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(d);
};
exports.remove = async (req, res) => {
    await
        Driver.findByIdAndDelete(req.params.id); res.json({ ok: true });
};