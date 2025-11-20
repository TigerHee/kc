/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import Title from 'src/components/Spotlight/SpotlightR8/Title.js';
import { customRender } from 'src/test/setup';

describe('Title', () => {
  it('renders Title', () => {
    customRender(<Title icon="icon" title="title" />);
  });
});
