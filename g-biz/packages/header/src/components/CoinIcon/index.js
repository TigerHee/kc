/**
 * Owner: roger@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@kux/mui';
import DefaultIcon from '../../../static/newHeader/defaultIcon.svg';
import { PREFIX } from '../../common/constants';

export const IconWrapper = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const namespace = `${PREFIX}_header`;

const CoinIcon = ({ coin, style, icon }) => {
  const { coinsCategorys } = useSelector((state) => state[namespace]);
  return (
    <IconWrapper
      style={{ ...style }}
      src={icon || coinsCategorys[coin]?.iconUrl || DefaultIcon}
      alt=""
    />
  );
};

export default CoinIcon;
