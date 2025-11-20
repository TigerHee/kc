/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { customRender } from 'src/test/setup';
import AnchorPlaceholder from 'TradeActivity/GemPool/ProjectDetail/containers/AnchorPlaceholder.js';

describe('AnchorPlaceholder', () => {
  it('renders AnchorPlaceholder', () => {
    customRender(<AnchorPlaceholder id="symbolInfo" />);
  });
});
