import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Attach Socket.IO for realtime
  const server = app.getHttpServer();
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  // WebSocket namespace for trips
  io.of('/ws/trips').on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_trip', (tripId) => {
      socket.join(`trip:${tripId}`);
      console.log(`[Socket.IO] User joined trip:${tripId}`);
    });

    socket.on('driver_location', (data) => {
      // Broadcast driver location to all riders in this trip
      io.of('/ws/trips').to(`trip:${data.tripId}`).emit('driver_location_update', {
        driverId: data.driverId,
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  await app.listen(3000);
  console.log('RideWave API listening on http://localhost:3000');
  console.log('WebSocket endpoint: ws://localhost:3000/ws/trips');
}
bootstrap();
