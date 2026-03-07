function registerRooms(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle joining fleet room
    socket.on('join:fleet', () => {
      socket.join('fleet');
      console.log(`${socket.id} joined fleet room`);
      socket.emit('joined', { room: 'fleet' });
    });

    // Handle joining vehicle-specific room
    socket.on('join:vehicle', ({ vehicleId }) => {
      socket.join(`vehicle:${vehicleId}`);
      console.log(`${socket.id} joined vehicle:${vehicleId}`);
      socket.emit('joined', { room: `vehicle:${vehicleId}` });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { registerRooms };