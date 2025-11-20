/**
 * Owner: Saiya.lee@kupotech.com
 */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import NumFormatComp from 'src/components/Spotlight/SpotlightR8/components/NumFormatComp.js';
import { customRender } from 'src/test/setup';

describe('NumFormatComp', () => {
  it('renders NumFormatComp with number', () => {
    const { container } = customRender(<NumFormatComp value={233.2323} />);
    expect(container).toHaveTextContent('233.2323');
  });
  it('renders NumFormatComp with none number', () => {
    const { container } = customRender(<NumFormatComp value={NaN} />);
    expect(container).toHaveTextContent('--');
  });
});
