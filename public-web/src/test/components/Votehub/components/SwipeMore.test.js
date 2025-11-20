/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import SwipeMore from 'src/components/Votehub/components/SwipeMore.js';
import { customRender } from 'src/test/setup';

describe('test SwipeMore', () => {
  test('test SwipeMore', async () => {
    customRender(<SwipeMore currentPage={2} isLoadiong={true} />, {});
    customRender(
      <SwipeMore currentPage={1} totalPage={2} isLoadiong={false} infiniteScrollList={[{}]} />,
      {},
    );
    customRender(
      <SwipeMore currentPage={1} totalPage={2} isLoadiong={false} infiniteScrollList={[]} />,
      {},
    );
    customRender(
      <SwipeMore currentPage={1} totalPage={1} isLoadiong={false} infiniteScrollList={[{}]} />,
      {},
    );
  });
});
