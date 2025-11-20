/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useNewcomerConfig } = require('src/hooks/useNewcomerConfig');

describe('useNewcomerConfig', () => {
  it('test useNewcomerConfig', () => {
    renderHook(useNewcomerConfig);
  });
});
