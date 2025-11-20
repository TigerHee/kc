/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { Button } from '@kux/mui';
import { useSelector } from 'react-redux';
import { useTranslation } from '@tools/i18n';
import { NAMESPACE } from '../../config';

const ButtonWrapper = ({ onClick, children, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');
  const formStatus = useSelector((state) => state[NAMESPACE].formStatus);

  if (formStatus && onClick) {
    return (
      <Button fullWidth size="large" onClick={onClick} {...otherProps}>
        {_t('5UQyhPJEGrJYMBux5dUmiB')}
      </Button>
    );
  }
  return <div {...otherProps}>{children}</div>;
};

export default React.memo(ButtonWrapper);
