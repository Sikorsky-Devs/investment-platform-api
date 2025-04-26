import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { senderId: string; receiverId: string },
  ) {
    const id = this.messageService.genSocketGroupId(
      body.senderId,
      body.receiverId,
    );
    if (!client.rooms.has) {
      client.rooms.add(id);
    }
    await client.join(id);
    const history = await this.messageService.getHistory(
      body.senderId,
      body.receiverId,
    );
    if (history) {
      client.emit('join', history);
    } else {
      client.emit('join', []);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      content: string;
    },
  ) {
    const id = this.messageService.genSocketGroupId(
      data.senderId,
      data.receiverId,
    );
    const message = await this.messageService.saveMessage(
      data.senderId,
      data.receiverId,
      data.content,
    );
    this.server.to(id).emit('message', message);
  }

  @SubscribeMessage('leave')
  leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { senderId: string; receiverId: string },
  ) {
    const id = this.messageService.genSocketGroupId(
      body.senderId,
      body.receiverId,
    );
    client.rooms.delete(id);
  }
}
