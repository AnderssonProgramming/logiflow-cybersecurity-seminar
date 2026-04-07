'use strict';

const promClient = require('prom-client');

const metricsRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({
  register: metricsRegistry,
  prefix: 'logiflow_realtime_',
});

const socketUnauthorizedCounter = new promClient.Counter({
  name: 'logiflow_socket_unauthorized_total',
  help: 'Total unauthorized socket connection attempts',
  registers: [metricsRegistry],
});

const socketConnectionsGauge = new promClient.Gauge({
  name: 'logiflow_socket_connections',
  help: 'Current active socket connections by role',
  labelNames: ['role'],
  registers: [metricsRegistry],
});

// Seed zero-valued samples to avoid no-data panels before traffic appears.
socketUnauthorizedCounter.inc(0);
socketConnectionsGauge.set({ role: 'admin' }, 0);
socketConnectionsGauge.set({ role: 'conductor' }, 0);
socketConnectionsGauge.set({ role: 'unauthorized' }, 0);

function incrementUnauthorizedSocketAttempts() {
  socketUnauthorizedCounter.inc();
}

function trackSocketConnect(role) {
  socketConnectionsGauge.inc({ role: role || 'unauthorized' });
}

function trackSocketDisconnect(role) {
  socketConnectionsGauge.dec({ role: role || 'unauthorized' });
}

module.exports = {
  metricsRegistry,
  incrementUnauthorizedSocketAttempts,
  trackSocketConnect,
  trackSocketDisconnect,
};
