export interface IInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * ! changed 新增 search 和 number 类型
   * 输入框类型
   */
  type?: 'text' | 'password' | 'search' | 'number';

  /**
   * ! changed
   * 选择框的大小，默认为 medium
   * mini 尺寸仅在 search 时生效
   */
  size?: 'medium' | 'small' | 'mini';

  /**
   * 选择框的空值提示语
   */
  placeholder?: string;

  /**
   * 输入框内容
   */
  value?: string | number;

  /**
   * ! added
   * 数字支持千分位逗号隔开
   */
  separator?: boolean;

  /**
   * ! added
   * 步长
   */
  setup?: number;

  /**
   * 默认值
   */
  defaultValue?: string | number;

  /**
   * 是否禁用输入框，默认为false
   */
  disabled?: boolean;

  /**
   * 是否为错误状态的布尔值，默认为false
   */
  error?: boolean;

  /**
   * ! added
   * 输入框下方的提示信息，error 时 color: brandRed
   * error 为 false 时 color: text100
   */
  statusInfo?: React.ReactNode;

  /**
   * 是否展示可以清除内容的图标
   */
  allowClear?: boolean;

  /**
   * ! added
   */
  loading?: boolean;

  /**
   * 添加在输入框前侧的内容
   */
  prefix?: React.ReactNode;

  /**
   * 添加在输入框后侧的内容
   */
  suffix?: React.ReactNode;

  /**
   * 添加在输入框后侧的内容
   */
  addonAfter?: React.ReactNode;

  /**
   * ! added
   * 后缀 box 反转
   */
  reverseSuffix?: boolean;

  /**
   * ! deprecated: only use prefix
   * 添加在输入框前侧的内容，带分割线
   */
  // addonBefore?: React.ReactNode;

  /**
   * label 属性
   * ! changed: 由 React.ReactNode 改为对象
   */
  // label?: React.ReactNode;
  label?: IInputLabelProps['children'];

  /**
   * label 属性
   * ! changed: 由 React.ReactNode 改为对象
   */
  // label?: React.ReactNode;
  labelProps?: {
    position?: IInputLabelProps['position'];
    shrink?: boolean;
    className?: string;
    style?: React.CSSProperties;
  };

  /**
   * 输入框内容变化时的回调
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /**
   * 回车Enter事件
   */
  onEnterPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  /**
   * input 原生属性
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /**
   * ! added
   * search props, variant 为 search 时，该属性在 Search 组件中生效
   */
  search?: {
    cancelText?: React.ReactNode;
    onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  };
}

export interface IInputLabelProps {
  type: IInputProps['type'];
  /* inline 会在聚焦时浮动，outline 会与 input 分离，在输入框外部 */
  position?: 'inline' | 'outline';
  size?: IInputProps['size'];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  float?: boolean;
  htmlFor?: string;
}

export interface IInputPrefixProps {
  type?: IInputProps['type'];
  size?: IInputProps['size'];
  children?: React.ReactNode;
}

export interface IInputSuffixBoxProps {
  type?: IInputProps['type'];
  size?: IInputProps['size'];
  loading?: IInputProps['loading'];
  suffix?: IInputProps['suffix'];
  addonAfter?: IInputProps['addonAfter'];
  pwsType: boolean;
  allowClear?: IInputProps['allowClear'];
  reverseSuffix?: IInputProps['reverseSuffix'];
  onClear: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onPwsStatusChange: (status: boolean) => void;
}

export interface IInputStatusInfoProps {
  type?: IInputProps['type'];
  size?: IInputProps['size'];
  error?: IInputProps['error'];
  disabled?: IInputProps['disabled'];
  children?: React.ReactNode;
}
