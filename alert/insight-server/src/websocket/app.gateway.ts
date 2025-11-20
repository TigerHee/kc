import { UserService } from '../auth/services/user.service';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AzureService } from '../auth/services/azure.service';
import { Agenda } from '@hokify/agenda';
import { JWT_TOKEN_KEY_FOR_COOKIES } from 'src/auth/constants/auth.constant';

export enum WsEventTypes {
  /**
   * 普通消息
   */
  MESSAGE = 'message',
  /**
   * 任务列表更新
   */
  AGENDA_JOBS_STATUS_UPDATE = 'agenda_jobs_status_update',
  /**
   * 任务面板更新
   */
  AGENDA_DASHBOARD_UPDATE = 'agenda_dashboard_update',
  /**
   * 系统消息通知
   */
  SYSTEM_NOTIFICATION = 'system_notification',
  /**
   * 告警消息通知
   */
  ALARM_NOTIFICATION = 'alarm_notification',
}

@WebSocketGateway(Number(process.env.WEBSOCKET_PORT) || 3301, {
  namespace: '',
  cors: {
    origin: process.env.INSIGHT_URL || 'http://localhost:8000', // 允许的源地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的方法
    allowedHeaders: ['Content-Type'], // 允许的头部
    credentials: true, // 允许携带凭证
  },
  // transports: ['websocket'],
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  users: Map<string, Socket> = new Map();
  logger = new Logger('WebSocketGateway');
  private agendaDashboardRef: NodeJS.Timeout;

  constructor(
    private readonly azureService: AzureService,
    private readonly userService: UserService,
    private readonly agenda: Agenda,
  ) {
    //
  }

  async handleConnection(client: Socket) {
    try {
      const user = await this.getCurrentUserInfoByToken(client);
      // 存储连接的用户
      this.users.set(user.email, client);
      // TODO: 脱敏处理
      this.logger.log(`📢 客户端连接成功: ${client.id} === ${user.email}`);
    } catch (error) {
      this.logger.error(`❌ 客户端连接失败: ${client.id} === ${error.message}`);
      // 验证失败，关闭连接
      client.disconnect();
    }
  }

  /**
   * 客户端断开连接
   * @param client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`❌ 客户端断开连接: ${client.id}`);
    this.users.forEach((value, key) => {
      if (value.id === client.id) {
        this.users.delete(key);
        client.disconnect();
      }
    });
  }

  /**
   * 通过token获取当前用户信息
   * @param client
   * @returns
   */
  protected async getCurrentUserInfoByToken(client: Socket) {
    const req = client.request;
    const cookies = req.headers.cookie;
    let token;
    const c_token = cookies?.split(';').find((c) => c.trim().startsWith(`${JWT_TOKEN_KEY_FOR_COOKIES}=`));
    if (c_token) {
      token = c_token.split('=')[1];
    } else {
      token = client.handshake?.query?.token;
    }
    if (!token) {
      throw new WsException('Token not found');
    }
    // 从客户端请求中获取 token
    // 在这里可以验证 token 并将用户注册到 `users` 列表中
    const info = await this.azureService.verifyToken(token as string);
    const user = await this.userService.getUserByEmail(info.upn);
    // 验证 token
    if (!user) {
      throw new WsException('User not found');
    }
    return user;
  }

  /**
   * 发送消息
   * @param event
   * @param message
   */
  sendMessage(event: WsEventTypes, message): void {
    this.logger.log(`⬆ WEBSOCKET: { ${event} }`);
    this.server.emit(event, message);
  }

  /**
   * 发送特地消息给指定用户
   */
  sendToUserMessage(user: string, event: WsEventTypes, message): void {
    this.logger.log(`⬆ 发送WEBSOCKET消息: { ${event} } to { ${user} }`);
    if (this.users.get(user)) {
      this.users.get(user).emit(event, message);
    }
  }

  /**
   * 接收客户端发送的消息
   * @param message
   */
  @SubscribeMessage(WsEventTypes.MESSAGE)
  handleMessage(@MessageBody() message: string): void {
    this.logger.log(`🎫 [MESSAGE] 收到消息: { ${message} }`);
    // 广播消息给所有连接的客户端
    this.server.emit(WsEventTypes.MESSAGE, message);
  }

  /**
   * 任务面板更新
   * @param message
   * @param client
   */
  @SubscribeMessage(WsEventTypes.AGENDA_DASHBOARD_UPDATE)
  async handleJobDashboardMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    this.logger.log(`🎫 [AGENDA_DASHBOARD_UPDATE] 收到消息: { ${client.id}} { ${message} }`);
    const user = await this.getCurrentUserInfoByToken(client);
    try {
      const msg = JSON.parse(message) as {
        type: 'start-listening' | 'stop-listening';
        data: any;
      };
      if (msg.type === 'start-listening') {
        if (this.agendaDashboardRef) {
          clearInterval(this.agendaDashboardRef);
        }
        this.agendaDashboardRef = setInterval(async () => {
          const res = await this.agenda.getRunningStats();
          if (this.users.get(user.email)) {
            this.logger.log(`⬆ WEBSOCKET: AGENDA_DASHBOARD_UPDATE`);
            this.users.get(user.email).emit(WsEventTypes.AGENDA_DASHBOARD_UPDATE, res);
          } else {
            clearInterval(this.agendaDashboardRef);
          }
        }, 1000);
      }
      if (msg.type === 'stop-listening') {
        clearInterval(this.agendaDashboardRef);
      }
    } catch (error) {
      this.logger.error(`[AGENDA_DASHBOARD_UPDATE] 消息处理错误{ ${error.message} }`);
    }
  }
}
