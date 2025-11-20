/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import classnames from 'classnames';

const ButtonTip = ({ children, show, onClick, wrapperClassName, tipsClassName, tips }) => {
  return (
    <div className={classnames('buttonTipsBox', wrapperClassName)}>
      {show ? (
        <div className={classnames('buttonTips', tipsClassName)} onClick={onClick}>
          {tips}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default React.memo(ButtonTip);
