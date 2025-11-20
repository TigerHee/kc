import React from "react";
import { Skeleton } from "@krn/ui";

const { Col, Row } = Skeleton;

export default () => {
  return (
    <Skeleton active>
      <Col>
        <Row type="circle" />
      </Col>
      <Col style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
        <Row type="line" style={{ width: "50%" }} />
        <Row type="line" />
        <Row type="line" />
      </Col>
      <Col>
        <Row type="circle" style={{ width: 12, height: 12 }} />
        <Row type="line" active={false} />
        <Row type="line" active={false} />
      </Col>
    </Skeleton>
  );
};
