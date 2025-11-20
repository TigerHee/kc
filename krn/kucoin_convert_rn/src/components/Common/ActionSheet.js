/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import {Button, Drawer} from '@krn/ui';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';

const CancelButton = styled(Button)`
  margin: 12px 16px;
`;

/**
 * ActionSheet
 * 覆写 drawer
 */
const ActionSheet = memo(props => {
  const {
    children,
    showCancel = false,
    onClose,
    leftSlot,
    title,
    rightSlot,
    ...restProps
  } = props;
  const {_t} = useLang();

  return (
    <Drawer title={title} onClose={onClose} {...restProps}>
      {children}

      {showCancel && (
        <CancelButton onPress={onClose} cancel size="large" type="secondary">
          {_t('vwd6VPwgCSrnAx9ZZMPEex')}
        </CancelButton>
      )}
    </Drawer>
  );
});

export default ActionSheet;
