import { IUser } from '@/types/ucenter.ts';
import { TDefaultEmpty } from '@/types/TDefaultEmpty.ts';

/**
 * 用户封禁、清退等状态的同步根据项目实现
 */
export interface IUserStore {
  user: IUser | TDefaultEmpty; // undefined表示未从服务器拉取
  isLogin: boolean | undefined;
  frozen: boolean | undefined;
  // 计价单位
  balanceCurrency: string;
  // actions
  pullUser: () => void;
}
