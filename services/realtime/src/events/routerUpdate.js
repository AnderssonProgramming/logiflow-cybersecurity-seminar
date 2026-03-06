function emitRouteUpdate(io, vehicleId, routeData) {
  const payload = {
    vehicleId,
    stops: routeData.stops,
    polyline: routeData.polyline || [],
    estimatedTime: routeData.estimatedTime,
    timestamp: new Date().toISOString(),
  };

  // Emit to fleet and vehicle-specific rooms
  io.to('fleet').emit('route:update', payload);
  io.to(`vehicle:${vehicleId}`).emit('route:update', payload);

  console.log(`Route update emitted for vehicle ${vehicleId}`);
}

module.exports = { emitRouteUpdate };