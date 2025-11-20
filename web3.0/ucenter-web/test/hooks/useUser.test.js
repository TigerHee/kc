/**
 * Owner: sean.shi@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useUser from 'src/hooks/useUser';

describe('useUser', () => {
  it('render hook', () => {
    renderHook(useUser);
  });
});
