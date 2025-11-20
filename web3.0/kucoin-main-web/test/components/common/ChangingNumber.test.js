/**
 * Owner: lori@kupotech.com
 */
import React from 'react';
import ChangingNumber from 'src/components/common/ChangingNumber';
import { customRender } from 'test/setup';

describe('test ChangingNumber', () => {
  test('test ChangingNumber render', () => {
    customRender(<ChangingNumber value={'123'} />);
  });

  test('test ChangingNumber props: children', () => {
    customRender(<ChangingNumber>1</ChangingNumber>);
  });
  test('test ChangingNumber props: showIcon', () => {
    customRender(<ChangingNumber showIcon={true} />);
  });
  test('test ChangingNumber props: iconPlacement', () => {
    customRender(<ChangingNumber iconPlacement="right" />);
  });
});
