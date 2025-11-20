/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
const { default: useUser } = require('src/hooks/useUser');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useUser hook', () => {
  it('dispatches pull userInfo on mount', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    renderHook(useUser);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/pullUser',
    });
  });
});
