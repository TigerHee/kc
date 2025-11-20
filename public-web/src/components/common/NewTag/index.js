/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

import style from './style.less';

const NewTag = () => {
  return <sup className={`kucoinTag tagHas ${style.newTag}`}>new</sup>;
};

export default NewTag;
