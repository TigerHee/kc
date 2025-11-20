/**
 * Owner: iron@kupotech.com
 */
import InnerDialog from './src/components/Dialog';
import InnerBaseDialog from './src/components/Dialog/BaseDialog';
import OriUserRestricted from './src/index';
import { Notice, UserInfo, BaseDialogProps } from './src/types';

export const UserRestricted: React.ComponentType<any> = OriUserRestricted;

interface DialogProps {
  notice?: Notice;
  bizType?: string;
  onClose?: () => void;
  visible?: boolean;
  userInfo?: UserInfo;
  passType?: string;
}

export const Dialog: React.FC<DialogProps> = ({ ...restProps }) => {
  return (
    <InnerDialog {...restProps} />
  );
};
export const BaseDialog: React.FC<BaseDialogProps> = ({ ...restProps }) => {
  return (
    <InnerBaseDialog {...restProps} />
  );
};
