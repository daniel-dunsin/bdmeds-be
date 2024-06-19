import {
   WebSocketGateway,
   WebSocketServer,
   SubscribeMessage,
   MessageBody,
   ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
   namespace: '/video',
   cors: {
      origin: [
         'http://localhost:3000',
         'https://glistening-achiever-rotten-shock-production.pipeops.app',
         'https://frontend-4cx6.onrender.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
   },
   transports: ['websocket', 'polling'],
})
export class VideoGateway {
   @WebSocketServer() server: Server;

   @SubscribeMessage('join')
   handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
      client.join(room);
      client.to(room).emit('user-joined', client.id);
   }

   @SubscribeMessage('signal')
   handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
      const { room, signal } = data;
      client.to(room).emit('signal', { signal, id: client.id });
   }

   @SubscribeMessage('disconnecting')
   handleDisconnect(@ConnectedSocket() client: Socket) {
      const rooms = Array.from(client.rooms);
      rooms.forEach((room) => {
         client.to(room).emit('user-left', client.id);
      });
   }
}
