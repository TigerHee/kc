/**
 * Owner: john.zhang@kupotech.com
 */

import { Tag } from '@kux/mui';
import { getStatusInfo } from '../../utils';
import styles from './ClaimStatus.module.scss';

interface ClaimStatusProps {
  status: string;
}

const ClaimStatus: React.FC<ClaimStatusProps> = ({ status }) => {
  const info = getStatusInfo(status);
  if (!info) {
    return null;
  }
  return <Tag className={styles.styledTag}>{info.label}</Tag>;
};

export default ClaimStatus;
