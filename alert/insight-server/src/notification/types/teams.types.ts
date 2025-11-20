export type TeamsMessageAttachments = {
  url: string;
}[];
export type TeamsMessageHeroCards = {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 内容 */
  text: string;
  /** 图片 */
  images?: {
    url: string;
  }[];
  /** 按钮 */
  buttons?: TeamsMessageHeroCardsButton;
}[];

export type TeamsMessageAdaptiveCards = AdaptiveCard[];

export type Action = ActionSubmit | ActionOpenUrl | ActionShowCard;

export type AdaptiveCard = {
  // $schema: string,
  // type: string,
  // version: string,
  body?: BodyElement[];
  actions?: Action[];
};

export type TextBlockColor = 'default' | 'dark' | 'light' | 'accent' | 'good' | 'warning' | 'attention';

type BodyElement = Container | ColumnSet | TextBlock | Image;

interface Container {
  type: string;
  style?: 'good' | 'attention' | 'warning' | 'emphasis';
  items: BodyElement[];
}

interface ColumnSet {
  type: 'ColumnSet';
  columns: Column[];
}

interface Column {
  type: 'Column';
  width: 'auto' | 'stretch' | string; // "100px" is also valid
  items: BodyElement[];
}

interface TextBlock {
  type: 'TextBlock';
  text: string;
  weight?: 'bolder' | 'lighter';
  size?: 'small' | 'default' | 'medium' | 'large' | 'extraLarge';
  color?: TextBlockColor;
  wrap?: boolean;
  spacing?: 'none' | 'small' | 'medium' | 'large' | 'extraLarge' | 'padding';
  isSubtle?: boolean;
}

interface Image {
  type: 'Image';
  url: string;
  altText?: string;
  size?: 'auto' | 'stretch' | 'small' | 'medium' | 'large';
  style?: 'default' | 'person';
}

interface ActionSubmit {
  type: 'Action.Submit';
  title: string;
  data?: Record<string, unknown>;
}

interface ActionOpenUrl {
  type: 'Action.OpenUrl';
  title: string;
  url: string;
}

interface ActionShowCard {
  type: 'Action.ShowCard';
  title: string;
  card: any;
}

type TeamsMessageHeroCardsButton = (TeamsMessageHeroCardsButtonLink | TeamsMessageHeroCardsButtonAction)[];

type TeamsMessageHeroCardsButtonLink = {
  /** 打开链接 */
  open_url: string;
  title: string;
};

type TeamsMessageHeroCardsButtonAction = {
  action_handle: {
    handle_command: string;
  };
};
