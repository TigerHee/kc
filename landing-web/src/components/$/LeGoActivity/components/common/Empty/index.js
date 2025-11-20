/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import { _t } from 'utils/lang';
import emptyIcon from 'assets/NFTQuiz/empty.png';

const Empty = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${_r(120)};
  margin-bottom: 0;
  text-align: center;
  font-weight: 400;
  font-size: ${_r(14)};
  color: rgba(225, 232, 245, 0.4);
  >img {
    width: ${_r(100)};
    height: ${_r(100)};
    border: none;
    margin-bottom: ${_r(12)};
  }
`;

export default ({ desc, icon, className = '' }) => {
  return (
    <Empty className={className}>
      <img alt="empty-icon" src={icon || emptyIcon} />
      {desc || _t('guardianStar.empty.default')}
    </Empty>
  );
}