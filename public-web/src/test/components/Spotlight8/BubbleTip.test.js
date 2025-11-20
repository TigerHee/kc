/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { BubbleTip } from 'src/components/Spotlight/SpotlightR8/components/BubbleTip.js';
import { customRender } from 'src/test/setup';

describe('BubbleTip', () => {
  it('renders BubbleTip', () => {
    customRender(
      <BubbleTip className="icon" arrowPlacement="right">
        <span>1</span>
      </BubbleTip>,
    );
  });
  it('renders BubbleTip with defaults', () => {
    customRender(
      <BubbleTip>
        <span>1</span>
      </BubbleTip>,
    );
  });
});
