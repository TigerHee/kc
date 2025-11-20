/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import clsx from 'clsx';
import { isFunction } from 'lodash';

import { _t } from 'utils/lang';

import { ICReceivedOutlined } from '@kux/icons';
import { Button, Spin } from '@kux/mui';


const SaveImage = ({ onSave, isMobile, saveLoading }) => {
  const handleSave = useCallback(() => {
    if (saveLoading) return;
    if (onSave && isFunction(onSave)) {
      onSave();
    }
  }, [onSave, saveLoading]);

  return (
    <Button
      className={clsx('operator-button', 'save-image-button')}
      variant={isMobile ? 'contained' : 'text'}
      type={isMobile ? 'primary' : 'default'}
      isMobile={isMobile}
      onClick={handleSave}
    >
      <div className="icon-box">
        {saveLoading ? <Spin spinning /> : <ICReceivedOutlined className="save-icon" />}
      </div>
      <span className="text" operator-button>
        {isMobile ? _t('save.image') : _t('save')}
      </span>
    </Button>
  );
};

export default React.memo(SaveImage);
