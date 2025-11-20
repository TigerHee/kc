/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import styles from './style.less';

const JumpLink = ({ text, url, ...restProps }) => {
  return (
    <a className={`${styles.link} g-jumplink`} href={url} target="_blank" rel="noreferrer" {...restProps}>
      {text}
    </a>
  );
};

export default JumpLink;
