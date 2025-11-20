import { Socket, io } from 'socket.io-client';

export enum WsMessageTypeEnum {
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

class WebSocketManager {
  private socket: Socket | null = null;
  private url: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  private events: Map<WsMessageTypeEnum, Function[]> = new Map();

  constructor(url: string) {
    this.url = url;
    this.events.set(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, []);
    this.events.set(WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE, []);
    this.events.set(WsMessageTypeEnum.SYSTEM_NOTIFICATION, []);
    this.events.set(WsMessageTypeEnum.ALARM_NOTIFICATION, []);
  }

  connect() {
    console.log('WebSocket Connecting...');
    if (REACT_APP_ENV === 'dev') {
      this.socket = io('http://localhost:3301', {
        // 携带cookies
        withCredentials: true,
        // transports: ['websocket'], // 使用 WebSocket 协议
        reconnection: true, // 允许重连
        reconnectionAttempts: 5, // 重连尝试次数
      });
    } else {
      this.socket = io('https://insight.kcprd.com/socket.io', {
        // 携带cookies
        withCredentials: true,
        // transports: ['websocket'], // 使用 WebSocket 协议
        reconnection: true, // 允许重连
        reconnectionAttempts: 3, // 重连尝试次数
      });
    }

    this.socket.on('connect', () => {
      console.log('WebSocket is open now.');
    });

    this.socket.on('reconnect', () => {
      console.log('WebSocket is reconnected now.');
    });

    this.socket.on('message', (msg: any) => {
      console.log('Message received:', msg);
      const data = JSON.parse(msg);
      this.trigger(data.type, data.payload);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    /**
     * 监听任务面板更新
     */
    this.socket.on(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, (msg: any) => {
      this.trigger(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, msg);
    });

    /**
     * 监听任务列表更新
     */
    this.socket.on(WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE, (msg: any) => {
      this.trigger(WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE, msg);
    });

    /**
     * 监听系统消息通知
     */
    this.socket.on(WsMessageTypeEnum.SYSTEM_NOTIFICATION, (msg: any) => {
      this.trigger(WsMessageTypeEnum.SYSTEM_NOTIFICATION, msg);
    });

    /**
     * 监听告警消息通知
     */
    this.socket.on(WsMessageTypeEnum.ALARM_NOTIFICATION, (msg: any) => {
      this.trigger(WsMessageTypeEnum.ALARM_NOTIFICATION, msg);
    });
  }

  on(type: WsMessageTypeEnum, callback: (payload: any) => void) {
    this.events.set(type, [...(this.events.get(type) ?? []), callback]);
  }

  off(type: WsMessageTypeEnum) {
    this.events.set(type, []);
  }

  trigger(type: WsMessageTypeEnum, payload: any) {
    this.events.get(type)?.forEach((callback) => callback(payload));
  }

  send(type: WsMessageTypeEnum, msg: any) {
    const message = JSON.stringify(msg);
    if (this.socket) {
      this.socket.emit(type, message);
    } else {
      throw new Error('WebSocket is not connected.');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const websocketManager = new WebSocketManager(WEB_SOCKET_URL);
