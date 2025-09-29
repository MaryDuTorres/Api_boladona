
const Order = require('../models/Order');
const haversine = (a, b) => {
    const toRad = (v) => v * Math.PI / 180;
    const [lng1, lat1] = a; const [lng2, lat2] = b;
    const R = 6371;
    const dLat = toRad(lat2 - lat1); const dLon = toRad(lng2 - lng1);
    const sa = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon /
            2);
    const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
    return R * c; // km
};
exports.plan = async (req, res) => {

    const { orderIds, start } = req.body;

    if (!start) return res.status(400).send('Start point required');


    const orders = await Order.find({
        _id: { $in: orderIds }
    }).populate('client');

    const points = orders.map(o => ({
        id: o._id.toString(),
        loc: o.deliveryLocation || o.pickupLocation,
        order: o 
    }));

    let current = start;
    const route = [];
    let totalKm = 0;

   
    route.push({
        loc: start,
        name: 'Ponto de Partida (Motorista)',
        type: 'start' 
    });

    const remaining = points.slice();

    // Algoritmo Nearest Neighbor (Vizinho Mais Próximo)
    while (remaining.length) {
        let bestIdx = 0;
        let bestD = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const d = haversine(current, remaining[i].loc);
            if (d < bestD) { bestD = d; bestIdx = i; }
        }

        const next = remaining.splice(bestIdx, 1)[0];

        
        totalKm += bestD;

        route.push({
            loc: next.loc,
           
            name: `Entrega: ${next.order.client.name}`,
            type: 'delivery'
        });

        current = next.loc;
    }

    
    const AVG_SPEED_KMH = process.env.AVG_SPEED_KMH || 40;
    const estMinutes = (totalKm / AVG_SPEED_KMH) * 60;

    res.json({
        totalKm: parseFloat(totalKm.toFixed(1)),
        estMinutes: Math.round(estMinutes),
        route
    });

};
