/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import useLang from 'hooks/useLang';
import {Button} from '@krn/ui';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px 16px;
`;
const BtnWrapper = styled.View`
  flex: 1;
  margin-right: ${({index}) => (index === 0 ? '16px' : '0px')};
`;

export default ({handleConfirm, handleReset}) => {
  const {_t} = useLang();

  return (
    <Wrapper>
      <BtnWrapper index={0}>
        <Button onPress={handleReset} size="large" type="secondary">
          {_t('f2KPkTL4Vb1sTzq28RMTFD')}
        </Button>
      </BtnWrapper>
      <BtnWrapper>
        <Button onPress={handleConfirm} size="large">
          {_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
        </Button>
      </BtnWrapper>
    </Wrapper>
  );
};
