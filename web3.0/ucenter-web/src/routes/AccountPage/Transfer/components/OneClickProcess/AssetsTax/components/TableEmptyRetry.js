/**
 * Owner: john.zhang@kupotech.com
 */

import { Button, styled } from '@kux/mui';
import { useState } from 'react';
import { _t } from 'src/tools/i18n';

const RetryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const Tips = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
  text-align: center;
`;
const RetryBtn = styled(Button)`
  width: fit-content;
  padding: 10px 24px;
  min-width: 136px;
`;

const TableEmptyRetry = ({ onRetry }) => {
  const [loading, setLoading] = useState(false);
  const handleRetry = async () => {
    try {
      setLoading(true);
      await onRetry?.();
    } finally {
      setLoading(false);
    }
  };
  return (
    <RetryBox>
      <Tips>{_t('68a1f352e1dd4000a867')}</Tips>
      <RetryBtn loading={loading} onClick={handleRetry}>
        {_t('7BowxpfvFzdTgCD1z36YCY')}
      </RetryBtn>
    </RetryBox>
  );
};

export default TableEmptyRetry;
