/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';

const HeaderTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;
const Title = styled.Text`
  font-size: 12px;
  line-height: 15.6px;
  color: ${props => props.theme.colorV2.text40};
`;

/**
 * HistoryTitle
 */
const HistoryTitle = memo(props => {
  const {_t} = useLang();
  const {...restProps} = props;

  return (
    <HeaderTitle {...restProps}>
      <Title> {_t('f1fUs5np2HnVWsgQPhB9LC')}</Title>
      <Title> {_t('1izXduRcCW4CqMQTDi3Nry')}</Title>
    </HeaderTitle>
  );
});

export default HistoryTitle;
