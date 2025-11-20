import React from "react";
import { Skeleton } from "@krn/ui";

const { Col, Row } = Skeleton;

export default () => {
  return (
    <Skeleton>
      <Col style={{ flex: 1 }}>
        <Row style={{ width: "50%", height: 30, marginBottom: 20 }} />
        <Row />
        <Row />
        <Row />
      </Col>
    </Skeleton>
  );
};
