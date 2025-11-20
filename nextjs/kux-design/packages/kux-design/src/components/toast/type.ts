type IMessageType = 'info' | 'warning' | 'error' | 'success';

type MessageInput = (message: string) => void;

interface IMessageOption {
  type: IMessageType;
  message: string;
  duration?: number
}

interface IMessageQueueItem extends IMessageOption {
  id: number;
  index?: number;
}

interface IPropsMessage {
  info: MessageInput;
  warn: MessageInput;
  error: MessageInput;
  success: MessageInput;
}

export type { IPropsMessage, IMessageOption, IMessageQueueItem };