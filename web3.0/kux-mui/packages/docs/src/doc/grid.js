/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Row, Col, Box } from '@kux/mui';

import Wrapper from './wrapper';

const DemoBox = (props) => (
  <p style={{ height: `${props.value}px`, background: 'blue' }}>{props.children}</p>
);

const GridDoc = () => {
  return (
    <Box>
      <Row>
        <Col span={24}>
          <div style={{ background: 'rgba(0,146,255,.75)' }}>1</div>
        </Col>
      </Row>
      <p />
      <Row>
        <Col span={12}>
          <div style={{ background: 'blue' }}>1</div>
        </Col>
        <Col span={12}>
          <div style={{ background: 'red' }}>1</div>
        </Col>
      </Row>
      <p />
      <Row>
        <Col span={8}>
          <div style={{ background: 'blue' }}>1</div>
        </Col>
        <Col span={8}>
          <div style={{ background: 'red' }}>1</div>
        </Col>
        <Col span={8}>
          <div style={{ background: 'black' }}>1</div>
        </Col>
      </Row>
      <p />
      <Row>
        <Col span={18} push={6}>
          <div style={{ background: 'blue' }}> col-18 col-push-6</div>
        </Col>
        <Col span={6} pull={18}>
          <div style={{ background: 'red' }}>col-6 col-pull-18</div>
        </Col>
      </Row>
      <p />
      <Row justify="space-between">
        <Col span={4}>
          <div style={{ background: 'blue' }}>1</div>
        </Col>
        <Col span={4}>
          <div style={{ background: 'red' }}>1</div>
        </Col>
        <Col span={4}>
          <div style={{ background: 'black' }}>1</div>
        </Col>
      </Row>
      <p />
      <Row justify="center" align="center">
        <Col span={4}>
          <DemoBox value={100}>col-4</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox value={50}>col-4</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox value={120}>col-4</DemoBox>
        </Col>
        <Col span={4}>
          <DemoBox value={80}>col-4</DemoBox>
        </Col>
      </Row>
      <p />
      <Row>
        <Col flex={2}>
          <DemoBox value={20}>2 / 5</DemoBox>
        </Col>
        <Col flex={3}>
          <DemoBox value={20}>3 / 5</DemoBox>
        </Col>
      </Row>
      <p />
      <Row>
        <Col flex="100px">
          <DemoBox>100px</DemoBox>
        </Col>
        <Col flex="auto">
          <DemoBox>Fill Rest</DemoBox>
        </Col>
      </Row>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <GridDoc />
    </Wrapper>
  );
};
