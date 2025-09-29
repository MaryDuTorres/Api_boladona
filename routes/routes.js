const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/routesCtrl');
router.post('/plan', ctrl.plan);
module.exports = router;
