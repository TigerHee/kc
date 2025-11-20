/**
 * Owner: willen@kupotech.com
 */
import React, {useMemo} from 'react';
import styled from '@emotion/native';
import {useSelector} from 'react-redux';
import useLang from 'hooks/useLang';

import alert from 'assets/convert/alert.png';

const ExpireBox = styled.View`
  background: ${({theme}) => theme.colorV2.complementary8};
  border-radius: 8px;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const ExpireText = styled.Text`
  font-weight: 400;
  font-size: 14px;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text60};
  margin-right: auto;
`;

const AlertImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export default () => {
  const {_t} = useLang();
  const formStatus = useSelector(state => state.convert.formStatus);
  const errMsg = useSelector(state => state.convert.errMsg);

  const text = useMemo(() => {
    if (formStatus === 'error') {
      return errMsg ? errMsg : _t('gbhQoHBU3AaTYjV2AjvWsL');
    }
    if (formStatus === 'expire') {
      return _t('cW2NirPSjEJf4Pvmp3pME3');
    }
    return null;
  }, [formStatus, errMsg]);

  return (
    text && (
      <ExpireBox>
        <AlertImg source={alert} />
        <ExpireText>{text}</ExpireText>
      </ExpireBox>
    )
  );
};
