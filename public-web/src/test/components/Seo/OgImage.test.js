/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import OgImage from 'src/components/Seo/OgImage.js';
import { customRender } from 'src/test/setup';

describe('test OgImage', () => {
  test('test OgImage', async () => {
    customRender(<OgImage />);
  });
});
