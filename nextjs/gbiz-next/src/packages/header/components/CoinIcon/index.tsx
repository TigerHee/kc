/**
 * Owner: roger@kupotech.com
 */
import React, {FC} from 'react';
import { useHeaderStore } from 'packages/header/Header/model';
import DefaultIcon from '../../static/newHeader/defaultIcon.svg';
import styles from './styles.module.scss';

interface CoinIconProps {
  coin?: string;
  style?: React.CSSProperties;
  icon?: string;
}

const CoinIcon: FC<CoinIconProps> = ({ coin, style, icon }) => {
  const coinsCategorys = useHeaderStore(state => state.coinsCategorys) || {};
  return (
    <img
      style={{ ...style }}
      className={styles.img}
      src={icon || (coin && coinsCategorys[coin]?.iconUrl) || DefaultIcon}
      alt=""
    />
  );
};

export default CoinIcon;
