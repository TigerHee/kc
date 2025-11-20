/**
 * Owner: lena@kupotech.com
 */
import React from 'react';
import { useTranslation } from '@tools/i18n';
import { styled, Empty } from '@kux/mui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
`;

const StyledEmpty = () => {
  const { t: _t } = useTranslation('kyc');
  return (
    <Wrapper>
      <Empty description={_t('tjVXsDRHhXnSLT4q8mThSm')} size="small" />
    </Wrapper>
  );
};

export default StyledEmpty;
