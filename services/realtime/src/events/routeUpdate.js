function emitRouteUpdate(io, vehicleId, routeData, meta = {}) {
  const payload = {
    vehicleId,
    stops: routeData.stops || [],
    polyline: routeData.polyline || [],
    estimatedTime: routeData.estimatedTime,
    totalDistance: routeData.totalDistance,
    eventType: meta.eventType,
    totalCost: meta.totalCost,
    solvedAt: meta.solvedAt,
    timestamp: new Date().toISOString(),
  };

  io.to('fleet').emit('route:update', payload);
  io.to(`vehicle:${vehicleId}`).emit('route:update', payload);

  console.log(`Route update emitted for vehicle ${vehicleId}`);
}

module.exports = { emitRouteUpdate };