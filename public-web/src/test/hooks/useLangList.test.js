/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
const { default: useLangList } = require('src/hooks/useLangList');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useLangList hook', () => {
  it('dispatches pull lang list on mount', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    renderHook(useLangList);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'app/pullLangList',
    });
  });
});
