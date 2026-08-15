/**
 * Phase 3 Verification Script — Live Updates & Socket.io Integration
 */

const http = require('http');
const express = require('express');
const { io: ClientIO } = require('socket.io-client');
const { initSocket, emitAnalyticsUpdate } = require('./utils/socket');

async function testSocketIntegration() {
  console.log('--- Starting Phase 3 Socket.io Live Telemetry Verification ---');

  const app = express();
  const server = http.createServer(app);
  initSocket(server);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`✓ Test Socket.io server running on port ${port}`);

  const clientSocket = ClientIO(`http://localhost:${port}`, {
    transports: ['websocket', 'polling'],
    autoConnect: true
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Socket connection timed out')), 5000);
    clientSocket.on('connect', () => {
      clearTimeout(timer);
      console.log(`✓ Test client connected with socket ID: ${clientSocket.id}`);
      resolve();
    });
  });

  clientSocket.emit('subscribe:analytics');
  console.log('✓ Emitted subscribe:analytics event');

  // Test event reception
  const receivedPayload = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Live update event reception timed out')), 5000);
    
    clientSocket.on('analytics:update', (payload) => {
      clearTimeout(timer);
      console.log('✓ Received analytics:update on client:', payload);
      resolve(payload);
    });

    setTimeout(() => {
      console.log('Broadcasting emitAnalyticsUpdate from backend...');
      emitAnalyticsUpdate({
        type: 'test_event',
        sessionId: 's_test_socket_123',
        count: 5
      });
    }, 500);
  });

  if (receivedPayload.type !== 'test_event' || receivedPayload.sessionId !== 's_test_socket_123') {
    throw new Error('Received payload did not match expected structure');
  }

  clientSocket.disconnect();
  await new Promise((resolve) => server.close(resolve));
  console.log('✓ Socket server and client closed cleanly');

  console.log('\n=== ALL PHASE 3 VERIFICATIONS PASSED SUCCESSFULLY ===');
}

testSocketIntegration().catch((err) => {
  console.error('\n❌ Phase 3 Test Error:', err);
  process.exit(1);
});
