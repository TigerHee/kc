import React from 'react';
import styled from '@emotion/native';

import Card from 'components/Common/Card';
import {Title} from 'components/Common/Title';

const StyledTitle = styled(Title)`
  margin-bottom: 12px;
`;

const StyledCard = styled(Card)`
  min-height: 200px;
  flex: 1;
`;

const ExtraCard = ({
  children,
  style,
  rightNode,
  titleWrapStyle,
  titleStyle,
  title,
  tip,
}) => {
  return (
    <StyledCard style={style}>
      <StyledTitle
        style={titleStyle}
        titleWrapStyle={titleWrapStyle}
        title={title}
        tip={tip}
        rightNode={rightNode}
      />

      {children}
    </StyledCard>
  );
};

export default ExtraCard;
