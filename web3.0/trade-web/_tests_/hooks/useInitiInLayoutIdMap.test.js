import { renderHook } from '@testing-library/react-hooks';

import { useSelector, useDispatch } from 'dva';

import { MODULES } from '@/layouts/moduleConfig';

import useInitiInLayoutIdMap from 'src/trade4.0/hooks/useInitiInLayoutIdMap.js'; // Assuming this is the correct path

// Mocks
jest.mock('dva', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@/layouts/moduleConfig', () => ({
  MODULES: [
    { id: '1', layoutsHaveThisAtInit: ['testLayout'] },
    { id: '2', layoutsHaveThisAtInit: [] },
  ],
}));

describe('useInitiInLayoutIdMap', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn(() => Promise.resolve());
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action on layoutName change', () => {
    const layoutName = 'testLayout';

    const expectedPayload = MODULES.filter((v) =>
      v?.layoutsHaveThisAtInit?.includes(layoutName),
    ).reduce((a, b) => {
      a[b.id] = 1;

      return a;
    }, {});

    renderHook(() => useInitiInLayoutIdMap(layoutName));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setting/updateInLayoutIdMap',

      override: true,

      payload: expectedPayload,
    });
  });
});
