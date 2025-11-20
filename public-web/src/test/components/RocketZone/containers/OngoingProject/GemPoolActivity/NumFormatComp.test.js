/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import NumFormatComp from 'src/components/RocketZone/containers/OngoingProject/GemPoolActivity/NumFormatComp';
import { customRender } from 'src/test/setup';

describe('NumFormatComp', () => {
  it('renders NumFormatComp', () => {
    customRender(<NumFormatComp />);
    customRender(<NumFormatComp value="a" placeholder="?" />);
    customRender(<NumFormatComp value="0" />);
    customRender(<NumFormatComp value="9" />);
  });
});
