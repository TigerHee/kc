/**
 * Owner: sean.shi@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useNewRef from 'src/hooks/useNewRef';

describe('useNewRef', () => {
  it('render hook', () => {
    renderHook(useNewRef);
  });
});
