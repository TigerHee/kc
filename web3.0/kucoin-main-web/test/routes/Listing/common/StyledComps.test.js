import React from 'react';
import {
  Wrapper,
  Inner,
  BreadcrumbStyle,
  StepTitle,
} from 'src/routes/Listing/common/StyledComps.js';
import { customRender } from 'test/setup';
import { Breadcrumb } from '@kufox/mui';

describe('StyledComps render', () => {
  test('test Wrapper render', () => {
    customRender(<Wrapper />);
  });

  test('test Inner render', () => {
    customRender(<Inner />);
  });
  test('test BreadcrumbStyle render', () => {
    customRender(
      <BreadcrumbStyle>
        <Breadcrumb.Item>111</Breadcrumb.Item>
        <Breadcrumb.Item>222</Breadcrumb.Item>
      </BreadcrumbStyle>,
    );
  });
  test('test StepTitle render', () => {
    customRender(<StepTitle />);
  });
});
