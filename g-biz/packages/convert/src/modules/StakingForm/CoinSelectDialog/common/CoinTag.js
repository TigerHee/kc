/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { isFunction } from 'lodash';
import { ICFireOutlined } from '@kux/icons';
import usePropsSelector from '../usePropsSelector';

const NewTag = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  padding: 0px 2px;
  border-radius: 2px;
  color: ${(props) => props.theme.colors.primary};
  background: ${(props) => props.theme.colors.primary8};
`;
const ETFTag = styled(NewTag)`
  color: ${({ theme, isLong }) => theme.colors[isLong ? 'primary' : 'secondary']};
  background: ${({ theme, isLong }) => theme.colors[isLong ? 'primary8' : 'secondary8']};
  margin-right: 2px !important;
`;

const MARGIN_MARKS_TIPS = {
  LONG3: () => '3倍做多',
  SHORT3: () => '3倍做空',
  LONG2_4: () => '2-4倍做多',
  SHORT2_4: () => '2-4倍做空',
};

const CoinTag = ({ record, ...otherProps }) => {
  const getTag = usePropsSelector((props) => props.getTag);
  if (!isFunction(getTag)) {
    return null;
  }
  const tag = getTag(record);
  if (MARGIN_MARKS_TIPS[tag]) {
    return (
      <ETFTag isLong={tag.includes('LONG')} {...otherProps}>
        {MARGIN_MARKS_TIPS[tag]()}
      </ETFTag>
    );
  }
  if (tag === 'NEW') {
    return <NewTag {...otherProps}>New</NewTag>;
  }
  if (tag === 'HOT') {
    return (
      <ICFireOutlined
        color="red"
        size={16}
        style={{ marginBottom: 2, marginRight: 0 }}
        {...otherProps}
      />
    );
  }
  return null;
};

export default CoinTag;
