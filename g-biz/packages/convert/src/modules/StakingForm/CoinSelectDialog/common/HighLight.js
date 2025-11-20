/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { toLower, includes } from 'lodash';

const KeyWordsWrapper = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const KeyWords = ({ value, match, ignoreCase = true }) => {
  if (!match || !value) return value;
  let index = -1;
  if (ignoreCase) {
    index = toLower(value).indexOf(toLower(match));
  } else {
    index = value.indexOf(match);
  }
  if (index < 0) return value;
  return [
    value.slice(0, index),
    <KeyWordsWrapper key={match}>{value.slice(index, index + match.length)}</KeyWordsWrapper>,
    value.slice(index + match.length),
  ];
};

const HighLight = ({ field, data = {}, search = [], ...otherProps }) => {
  const hasMatch = search && includes(search[0], field);
  return (
    <div {...otherProps}>
      {!hasMatch ? data[field] : <KeyWords value={data[field]} match={search[1]} />}
    </div>
  );
};

export default HighLight;
