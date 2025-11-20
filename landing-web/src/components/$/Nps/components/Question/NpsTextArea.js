/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import style from './style.less';

const NpsTextArea = ({ maxLength = 200, value, onChange, ...props }) => {
  return (
    <div className={style.npsTextAreaContainer}>
      <textarea
        maxLength={maxLength}
        {...props}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <div className={style.foot}>
        {value?.length || 0}/{maxLength}
      </div>
    </div>
  );
};

export default React.memo(NpsTextArea);
