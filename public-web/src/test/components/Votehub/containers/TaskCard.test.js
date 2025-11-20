/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import TaskCard from 'src/components/Votehub/containers/components/TaskCard/index.js';
import { customRender } from 'src/test/setup';

describe('test TaskCard', () => {
  test('test TaskCard', async () => {
    customRender(<TaskCard />, { setting: { currentTheme: 'dark' } });
  });
});
