import React, {memo} from 'react';

import {PageLayoutWrap} from './styles';

const PageLayout = props => {
  const {header = null, content = null, footer = null, style, onLayout} = props;

  return (
    <PageLayoutWrap style={style} onLayout={onLayout}>
      {header}
      {content}
      {!!footer && footer}
    </PageLayoutWrap>
  );
};

export default memo(PageLayout);
