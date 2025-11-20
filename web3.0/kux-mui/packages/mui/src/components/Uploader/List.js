/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import styled, { isPropValid } from 'emotion/index';

import ListItem from './ListItem';

const StyledList = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType }) => {
  return {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    ...(listType === 'text' && {}),
    ...(listType === 'picture-card' && {}),
  };
});

export default ({ listType, items, onPreview, onRemove, appendAction, appendActionVisible }) => {
  const onInnerPreview = (file, e) => {
    if (!onPreview) {
      return;
    }
    e?.preventDefault();
    return onPreview?.(file);
  };

  const onInnerClose = (file) => {
    onRemove?.(file);
  };

  return (
    <StyledList>
      {items.map((file) => {
        return (
          <ListItem
            onClose={onInnerClose}
            onPreview={onInnerPreview}
            file={file}
            key={file.uid}
            listType={listType}
          />
        );
      })}
      {appendAction && appendActionVisible ? <>{appendAction}</> : null}
    </StyledList>
  );
};
