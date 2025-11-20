/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import Button from '@mui/Button';
import { styled } from '@/style/emotion';

import { _t } from 'utils/lang';

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0 0 32px;

  > button {
    width: auto;
    white-space: nowrap;
  }
`;

const ButtonGroup = ({ onClose, onOk }) => {
  return (
    <>
      <ButtonBox>
        <Button className="mr-8" variant="outlined" type="primary" onClick={onClose}>
          {_t('cancel')}
        </Button>
        <Button variant="contained" onClick={onOk}>
          {_t('confirmed')}
        </Button>
      </ButtonBox>
    </>
  );
};

export default React.memo(ButtonGroup);
