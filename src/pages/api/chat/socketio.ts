import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { ensureTableExists, getMessages, pool, sendMessage } from '@/lib/db';

// Ensure the table exists once during server startup
ensureTableExists();

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket && !(res.socket as any).server.io) {
    console.log('Setting up socket.io');
    const httpServer: NetServer = (res.socket as any).server;
    const io = new ServerIO(httpServer, {
      path: '/api/chat/socketio',
    });
    (res.socket as any).server.io = io;

    io.on('connection', (socket) => {
      console.log(
        '(Server): A user connected to server with socket ID:',
        socket.id
      );

      // Emit the number of connected users in the event channel when a user connects
      const eventRooms = Array.from(socket.rooms).filter((room) =>
        room.startsWith('event_')
      );
      eventRooms.forEach((eventRoom) => {
        const connectedUsers =
          io.sockets.adapter.rooms.get(eventRoom)?.size || 0;
        io.to(eventRoom).emit('userCount', connectedUsers);
      });

      socket.on('getMessages', async (eventId) => {
        console.log('(Server): getMessages received with eventId:', eventId);
        try {
          socket.join(`event_${eventId}`);

          const client = await pool.connect();
          console.log('(Server): Database connection established');
          try {
            const response = await getMessages(eventId);
            const eventMessages = JSON.parse(JSON.stringify(response));
            socket.emit('pushMessages', eventMessages);
          } finally {
            client.release();
            console.log('(Server): Database connection released');
          }

          // Emit the number of connected users in the event channel
          const connectedUsers =
            io.sockets.adapter.rooms.get(`event_${eventId}`)?.size || 0;
          console.log('(Server): Emitting userCount:', connectedUsers);
          io.to(`event_${eventId}`).emit('userCount', connectedUsers);
        } catch (error) {
          console.error('(Server): Error fetching event messages:', error);
          socket.emit('error', 'Failed to fetch event messages');
        }
      });

      socket.on('sendMessage', async (message, callback) => {
        console.log('(Server): sendMessage received with message:', message);
        try {
          const client = await pool.connect();
          try {
            await sendMessage({
              ...message,
              timestamp: new Date(), // Store encrypted message as-is
            });

            console.log('(Server): Broadcasting encrypted message');
            io.to(`event_${message.eventId}`).emit('newMessage', message); // Broadcast encrypted message
            callback(null, message);
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error processing message:', error);
          callback(error);
          socket.emit('error', 'Failed to process message');
        }
      });

      socket.on('disconnect', () => {
        console.log('(Server): A user disconnected from server');
        // Emit the updated number of connected users in the event channel
        const eventRooms = Array.from(socket.rooms).filter((room) =>
          room.startsWith('event_')
        );
        eventRooms.forEach((eventRoom) => {
          const connectedUsers =
            io.sockets.adapter.rooms.get(eventRoom)?.size || 0;
          io.to(eventRoom).emit('userCount', connectedUsers);
        });
      });
    });
  } else {
    console.log('(Server): socket.io already set up');
  }

  res.end();
};

export default ioHandler;
