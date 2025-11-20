/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import Title from 'src/components/Votehub/containers/components/Title/index.js';
import { customRender } from 'src/test/setup';

describe('test Title', () => {
  test('test Title', async () => {
    customRender(<Title title="title" coin="" />, {});
    customRender(<Title title="title" coin="" extra={<div />} />, {});
  });
});
