function startPositionBroadcast(io) {
  const vehicles = [
    { vehicleId: 'v-001', lat: 4.7110, lng: -74.0721 },
    { vehicleId: 'v-002', lat: 4.6800, lng: -74.0500 },
    { vehicleId: 'v-003', lat: 4.7200, lng: -74.0650 },
  ];

  // Simulate position 
  setInterval(() => {
    vehicles.forEach((vehicle) => {
      vehicle.lat += (Math.random() - 0.5) * 0.001;
      vehicle.lng += (Math.random() - 0.5) * 0.001;

      const payload = {
        vehicleId: vehicle.vehicleId,
        lat: vehicle.lat,
        lng: vehicle.lng,
        speed: Math.floor(Math.random() * 60) + 20,
        timestamp: new Date().toISOString(),
      };

      io.to('fleet').emit('vehicle:position', payload);
      io.to(`vehicle:${vehicle.vehicleId}`).emit('vehicle:position', payload);
    });
  }, 5000);
}

module.exports = { startPositionBroadcast };