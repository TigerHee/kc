/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import AnimateButton from 'components/RocketZone/components/AnimateButton';
import { customRender } from 'src/test/setup';

describe('test AnimateButton', () => {
  test('test AnimateButton', async () => {
    customRender(<AnimateButton>button</AnimateButton>);
  });
});
