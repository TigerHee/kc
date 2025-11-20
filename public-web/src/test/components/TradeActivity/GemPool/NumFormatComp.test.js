/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { customRender } from 'src/test/setup';
import NumFormatComp from 'TradeActivity/GemPool/containers/ProjectItem/NumFormatComp.js';

describe('NumFormatComp', () => {
  it('renders NumFormatComp', () => {
    customRender(<NumFormatComp />);
    customRender(<NumFormatComp value="a" placeholder="?" />);
    customRender(<NumFormatComp value="0" />);
    customRender(<NumFormatComp value="9" />);
  });
});
