/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Breadcrumb } from '@kux/mui';
import Wrapper from './wrapper';
import map from 'lodash/map';
import { ICTradeOutlined } from '@kux/icons';

function BreadcrumbDemo() {
  const items = ['Back', 'Vaex Help Center', 'Vaex Help Center', 'Vaex Help Center'];
  const items2 = ['返回', 'Vaex Help Center1', 'Vaex Help Center2', 'Vaex Help Center3', 'Vaex Help Center4', 'Vaex Help Center5', 'Vaex Help Center6'];

  return (
    <div>
      <h1>base</h1>
      <Breadcrumb>
        {
          map(items, (item, idx) => (
            <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
          ))
        }
      </Breadcrumb>

      <h1>small size</h1>
      <Breadcrumb size="small">
        {
          map(items, (item, idx) => (
            <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
          ))
        }
      </Breadcrumb>

      <h1>with icon</h1>
      <Breadcrumb>
        {
          map(items, (item, idx) => (
            <Breadcrumb.Item key={idx}>
              <ICTradeOutlined size={20} />
              {item}
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
      <br />
      <Breadcrumb size="small">
        {
          map(items, (item, idx) => (
            <Breadcrumb.Item key={idx}>
              <ICTradeOutlined />
              {item}
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>

      <h1>more links</h1>
      <Breadcrumb>
        {
          map(items2, (item, idx) => (
            <Breadcrumb.Item key={idx}>
              {item}
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
      <br />
      <Breadcrumb size="small">
        {
          map(items2, (item, idx) => (
            <Breadcrumb.Item key={idx}>
              {item}
            </Breadcrumb.Item>
          ))
        }
      </Breadcrumb>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <BreadcrumbDemo />
    </Wrapper>
  );
};