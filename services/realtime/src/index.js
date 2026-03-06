const { httpServer, io, initializeServer, app } = require('./server');
const { registerRooms } = require('./rooms');
const { startPositionBroadcast } = require('./events/position');
const { emitRouteUpdate } = require('./events/routeUpdate');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

async function main() {
  await initializeServer();
  registerRooms(io);
  startPositionBroadcast(io);

  // Endpoint HTTP 
  app.use(require('express').json());
  app.post('/emit/route-update', (req, res) => {
    const { vehicleId, stops, estimatedTime, polyline } = req.body;
    emitRouteUpdate(io, vehicleId, { stops, estimatedTime, polyline });
    res.json({ success: true });
  });

  httpServer.listen(PORT, () => {
    console.log(`Socket Gateway running on port ${PORT}`);
  });
}

main().catch(console.error);