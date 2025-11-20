/**
 * Owner: Saiya.lee@kupotech.com
 */
import '@testing-library/jest-dom';
import Faq from 'src/components/Spotlight/SpotlightR8/Faq.js';
import { customRender } from 'src/test/setup';

describe('Faq', () => {
  it('renders Faq', () => {
    customRender(<Faq />);
  });
});
