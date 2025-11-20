/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input Border
 */

import { IInputStatusInfoProps } from '../type';

export const StatusInfo = (props: IInputStatusInfoProps) => {
  if (props.disabled) return null;
  return <div className="kux-input-status-info">{props.children}</div>;
};
