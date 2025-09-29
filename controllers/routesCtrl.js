// rota simples de otimização: nearest neighbor
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
    // expects { orderIds: [...], start: [lng,lat] }
    const { orderIds, start } = req.body;

    if (!start) return res.status(400).send('Start point required');

    // 1. Buscando pedidos e populando o cliente (para pegar o nome)
    const orders = await Order.find({
        _id: { $in: orderIds }
    }).populate('client');

    const points = orders.map(o => ({
        id: o._id.toString(),
        loc: o.deliveryLocation || o.pickupLocation,
        order: o // Objeto pedido completo com cliente populado
    }));

    let current = start;
    const route = [];
    let totalKm = 0;

    // 2. ADICIONA O PONTO DE PARTIDA DO MOTORISTA (Cor verde no app)
    route.push({
        loc: start,
        name: 'Ponto de Partida (Motorista)',
        type: 'start' // NOVO CAMPO: Tipo de ponto
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

        // 3. Adiciona a distância e o ponto de entrega
        totalKm += bestD;

        route.push({
            loc: next.loc,
            // NOVO CAMPO: Usa o nome do cliente para a entrega
            name: `Entrega: ${next.order.client.name}`,
            type: 'delivery' // NOVO CAMPO: Tipo de ponto
        });

        current = next.loc;
    }

    // Cálculo do tempo estimado
    const AVG_SPEED_KMH = process.env.AVG_SPEED_KMH || 40;
    const estMinutes = (totalKm / AVG_SPEED_KMH) * 60;

    res.json({
        totalKm: parseFloat(totalKm.toFixed(1)),
        estMinutes: Math.round(estMinutes),
        route
    });
};