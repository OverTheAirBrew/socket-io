import { Service, Inject } from 'typedi';
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import { ISocketListener, SocketContract } from './models';

export * from './models';

@Service()
export class SocketIo {
  private server: SocketServer;

  constructor(
    @Inject('http_instance') http: Server,
    @Inject('socket.io_cors_origin') corsOrigin: string,
  ) {
    this.server = new SocketServer(http, {
      path: '/server/socket',
      cors: {
        origin: corsOrigin,
      },
    });
  }

  public send<Data>(contract: SocketContract<Data>) {
    return async (message: Data) => {
      this.server.emit(contract.EventName, message);
    };
  }

  public listenForMessage<Data>(
    contract: SocketContract<Data>,
    listener: ISocketListener<Data>,
  ) {
    this.server.on(contract.EventName, async (data) => {
      await listener(data);
    });
  }
}
