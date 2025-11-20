/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';

const splitStr = (str) => {
  if (typeof str !== 'string' || !str || str.length <= 2) {
    return null;
  }

  return [
    str.substr(0, str.length - 2),
    str.substr(str.length - 2, 2),
  ];
};

// TODO 未用到，后期可清理
const BeautifulDiffNumber = ({ bigger, children, className }) => {
  const chunks = ['', ''];
  const biggerSplits = splitStr(bigger);
  const valueSplits = splitStr(children);

  if (!biggerSplits || !valueSplits) {
    chunks[1] = children;
  } else if (biggerSplits[0] !== valueSplits[0]) {
    chunks[1] = children;
  } else {
    chunks[0] = valueSplits[0];
    chunks[1] = valueSplits[1];
  }

  return (
    <span className={className}>
      <span style={{ opacity: 0.4 }}>
        { chunks[0] }
      </span>
      <span>
        { chunks[1] }
      </span>
    </span>
  );
};

BeautifulDiffNumber.propTypes = {
  bigger: PropTypes.string,
  children: PropTypes.string,
};

BeautifulDiffNumber.defaultProps = {
  bigger: null,
  children: null,
};

export default BeautifulDiffNumber;
