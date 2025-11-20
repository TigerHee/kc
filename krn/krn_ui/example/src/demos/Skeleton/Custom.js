import React from 'react';
import { Skeleton, useTheme } from '@krn/ui';

const { Col, Row } = Skeleton;

export default () => {
  const theme = useTheme();
  return (
    <Skeleton color={theme.color.primary}>
      <Col style={{ flex: 1, marginRight: 10 }}>
        <Row type="line" />
        <Row type="line" color={theme.color.inferior} activeColor="#f00" active />
        <Row type="line" />
      </Col>
      <Col>
        <Row type="square" />
      </Col>
    </Skeleton>
  );
};
