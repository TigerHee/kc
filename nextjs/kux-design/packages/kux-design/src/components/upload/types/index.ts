export interface ICustomRequestOptions {
  file: IUploadFile;
  files: IUploadFile[];
  onError: (error: Error, data?: any) => void;
  onSuccess?: (data?: any) => void;  // 外部调用成功时触发
}

export interface IUploadFile {
  uid: string;
  name: string;
  size: number; // bytes
  originalFile: File;
  url?: string;
  error?: Error;
}

// 上传模式类型
export type UploadMode = 'image' | 'file';

// 基础上传属性
export interface IUploadPropsBase {
  fullWidth?: boolean;
  uploadMode?: UploadMode;
  title?: string;
  description?: string;
  // 样式相关
  style?: React.CSSProperties;
  className?: string;
  
  // 基础配置
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  
  // 状态相关
  error?: boolean;  // 组件本身的 error 状态
  
  // 事件回调
  onStart?: (file: File | FileList) => void;
  onSuccess?: (data: any) => void;  // 新增：成功回调
  onError?: (error: Error, data?: any) => void;
  beforeUpload?: (file: File | FileList) => boolean | Promise<boolean>;
  customRequest?: (options: ICustomRequestOptions) => void;
  
  // 子元素
  children?: React.ReactNode;

  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;

  onDelete?: (file: File) => void;
}

// 图片上传属性
export interface IImageUploadProps extends IUploadPropsBase {
  mode?: 'image';
  onDelete?: (file: File) => void;
}

// 文件上传属性
export interface IFileUploadProps extends IUploadPropsBase {
  mode?: 'file';
  multiple?: boolean;  // 文件模式支持多选
}

export type IItemStatus = 'uploading' | 'done' | 'error';

export interface IFileItemProps {
  name: string;
  size: number;
  url: string;
  uid: string;
  status?: IItemStatus;
}


// 文件列表组件属性
export interface IFileListProps {
  title?: string;
  files: IFileItemProps[];
  onRetry: (uid: string) => void;
  onDelete: (uid: string) => void;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

// 图片覆盖层组件属性
export interface IImageOverlayProps {
  url?: string;
  onPreview?: (url: string) => void;
  onDelete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  deleteText?: string;
  previewText?: string;
}

// 联合类型
export type IUploadProps = IImageUploadProps | IFileUploadProps; 

