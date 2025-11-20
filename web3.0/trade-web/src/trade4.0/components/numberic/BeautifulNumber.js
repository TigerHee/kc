/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { separateNumber } from 'helper';
import { HideWrapper } from './style';

const TAIL_ZERO_REG = /[0]+$/;
const defaultStyles = [null, { opacity: 0.4 }];

// TODO 未用到，后期可清理
const BeautifulNumber = ({ styles, children, className }) => {
  const chunks = ['', ''];

  if (children && children.indexOf('.') > -1) {
    children = separateNumber(children);

    const tailZero = children.match(TAIL_ZERO_REG);
    if (tailZero) {
      chunks[1] = tailZero[0];
      chunks[0] = children.replace(TAIL_ZERO_REG, '');
    } else {
      chunks[0] = children;
    }
  } else {
    chunks[0] = separateNumber(children);
  }

  return (
    <span className={className}>
      <span style={styles[0]}>
        { chunks[0] }
      </span>
      <HideWrapper hide={!chunks[1]} style={styles[1]}>
        { chunks[1] }
      </HideWrapper>
    </span>
  );
};

BeautifulNumber.propTypes = {
  styles: PropTypes.array,
  children: PropTypes.string,
};

BeautifulNumber.defaultProps = {
  styles: defaultStyles,
  children: null,
};

export default BeautifulNumber;
