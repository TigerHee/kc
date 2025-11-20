export type LarkMessage = LarkTextMessage | LarkInteractiveMessage;

export interface LarkTextMessage {
  receiver: LarkReceiver[];
  message: TextMessage;
}

export interface LarkInteractiveMessage {
  receiver: LarkReceiver[];
  message: {
    interactive: {
      header?: InteractiveHeader;
      elements: InteractiveElement[];
      config?: InteractiveConfig;
    };
    // interactive: string; // JSON
  };
}

export type InteractiveHeader = {
  template: string;
  title: {
    content: string;
    tag: string;
  };
};

export type InteractiveConfig = {
  wide_screen_mode?: boolean;
};

export type InteractiveElement = {
  tag: string;
  content?: string;
  flex_mode?: string;
  background_style?: string;
  horizontal_spacing?: string;
  text_align?: string;
  elements?: InteractiveElement[];
  fields?: {
    is_short?: boolean;
    text: {
      tag: string;
      content: string;
    };
  }[];
  text?: {
    tag: string;
    content: string;
  };
  extra?: {
    tag: string;
    text: {
      tag: string;
      content: string;
    };
    type: string;
    multi_url: {
      url: string;
      pc_url: string;
      android_url: string;
      ios_url: string;
    };
  };
  columns?: {
    tag: string;
    width?: string | number;
    weight?: string | number;
    vertical_align?: string;
    elements?: InteractiveElement[];
  }[];
  actions?: {
    tag: string;
    text: {
      tag: string;
      content: string;
    };
    type: string;
    multi_url?: {
      url: string;
      pc_url: string;
      android_url: string;
      ios_url: string;
    };
  }[];
  alt?: {
    content: string;
    tag: string;
  };
  img_key?: string;
  _varloop?: string;
};

export interface TextMessage {
  text: string;
}

// prettier-ignore
export type LarkReceiver =
  | {
    email?: string;
    upn?: string;
  }
  | {
    chatId?: string;
  };

export enum LarkInteractiveMessageType {
  COMMIT_ERROR,
}

export type LarkInteractiveMessageTemplate = {
  [LarkInteractiveMessageType.COMMIT_ERROR]: {
    title: string;
    description: string;
    url: string;
    status: string;
  };
};

export type LarkInteractiveMessageData<T extends keyof LarkInteractiveMessageTemplate> = {
  type: T;
  value: LarkInteractiveMessageTemplate[T];
};

export type LarkApiSendResponse = {
  content?: string;
  waring?: string;
  list: {
    recipient: string;
    status: 'FAILED' | 'SENT';
    failureReason?: string;
    errorCode?: string;
    read: boolean;
    msgId: string;
  }[];
  pushId: string;
};
