/**
 * Owner: clyne@kupotech.com
 */

import { styled } from '@/style/emotion';
import React from 'react';
import useI18n from '@/hooks/futures/useI18n';
import KuxButton from '@mui/Button';
import { ICPlusOutlined } from '@kufox/icons';
import { useAdd } from './hooks/useAdd';
import { usePnlAlert } from './hooks/usePnlAlert';

const AddWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  &.not-add {
    color: ${(props) => props.theme.colors.text40};
    font-size: 14px;
  }
  button {
    padding: 0 40px;
  }
  svg {
    margin-right: 4px;
  }
`;

const Add = () => {
  const { _t } = useI18n();
  const { onClick, isNotAdd } = useAdd();
  const { checked } = usePnlAlert();
  if (isNotAdd) {
    return <AddWrapper className="not-add">{_t('setting.pnl.error.over')}</AddWrapper>;
  }
  if (!checked) {
    return <></>;
  }
  return (
    <AddWrapper>
      <KuxButton variant="contained" type="default" onClick={onClick}>
        <ICPlusOutlined />
        {_t('setting.pnl.add')}
      </KuxButton>
    </AddWrapper>
  );
};

export default Add;
