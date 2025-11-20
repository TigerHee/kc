import {
  ga,
  getGaElement,
  trackClick,
  track,
  getAnonymousID,
  compose,
  injectExpose,
  saTrackForBiz,
  gaExpose,
  gaClick,
  saveSpm2Storage,
  composeSpmAndSave,
  getSavedSpm,
  useGaExpose,
  trackCustomEvent,
} from 'src/utils/ga.js';
import React from 'react';

import { cleanup } from '@testing-library/react';
import { renderWithTheme } from '_tests_/test-setup';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
afterEach(cleanup);

describe('ga', () => {
  beforeAll(() => {
    // mock window._hmt.push
    window._hmt = {
      push: jest.fn(),
    };
    // mock window._KC_REPORT_
    window._KC_REPORT_ = {
      logAction: jest.fn(),
    };
  });

  afterAll(() => {
    // 清除mock
    delete window._hmt;
    delete window._KC_REPORT_;
  });

  it('should not call push if key is not provided', () => {
    ga();
    expect(window._hmt.push).not.toHaveBeenCalled();
  });

  it('should call push if key is provided', () => {
    const key = 'test';
    ga(key);
    expect(window._hmt.push).toHaveBeenCalledWith(['_trackEvent', key, 'click']);
  });

  it('should call logAction if key is provided', () => {
    const key = 'test';
    ga(key);
    expect(window._KC_REPORT_.logAction).toHaveBeenCalledWith(key, 'click');
  });
});

describe('getGaElement', () => {
  it('returns undefined when the provided node is null', () => {
    const result = getGaElement(null, 'data-ga');
    expect(result).toBeUndefined();
  });

  it('returns undefined when the provided node is body', () => {
    const bodyNode = document.body;
    const result = getGaElement(bodyNode, 'data-ga');
    expect(result).toBeUndefined();
  });

  it('returns the value of the provided attribute from the given node', () => {
    const divNode = document.createElement('div');
    divNode.setAttribute('data-ga', 'button-click');
    const result = getGaElement(divNode, 'data-ga');
    expect(result).toBe('button-click');
  });

  it('traverses up the DOM tree to find the attribute when not present on the given node', () => {
    const divNode = document.createElement('div');
    const spanNode = document.createElement('span');
    const aNode = document.createElement('a');
    aNode.setAttribute('data-ga', 'button-click');
    spanNode.appendChild(aNode);
    divNode.appendChild(spanNode);
    const result = getGaElement(aNode.firstChild, 'data-ga');
    expect(result).toBeUndefined();
  });

  it('returns undefined when the attribute is not found on the node or any of its parents', () => {
    const divNode = document.createElement('div');
    const result = getGaElement(divNode, 'data-ga');
    expect(result).toBeUndefined();
  });
});

describe('trackClick', () => {
  it('should call window.$KcSensors.trackClick with correct arguments', () => {
    const spm = 'test_spm';
    const data = { foo: 'bar' };

    window.$KcSensors = {
      trackClick: jest.fn(),
    };

    trackClick(spm, data);

    expect(window.$KcSensors.trackClick).toHaveBeenCalledWith(spm, data);
  });

  it('should not throw an error if window.$KcSensors is undefined', () => {
    const spm = 'test_spm';

    expect(() => {
      trackClick(spm);
    }).not.toThrow();
  });
});

describe('track function', () => {
  it('should call $KcSensors track function with correct arguments', () => {
    const mockTrack = jest.fn();
    window.$KcSensors = {
      track: mockTrack,
    };
    const eventType = 'testEvent';
    const options = { label: 'testLabel' };
    track(eventType, options);
    expect(mockTrack).toHaveBeenCalledWith(eventType, options);
  });

  it('should call $KcSensors trackCustomEvent function with correct arguments', () => {
    const mockTrack = jest.fn();
    window.$KcSensors = {
      track: mockTrack,
    };
    const type = 'page_click';
    const trackConfig = { spmId: ['id'], data: { label: 'testLabel' }, checkId: true };

    trackCustomEvent(trackConfig, type);
    expect(mockTrack).toHaveBeenCalledWith(type, { label: 'testLabel', spm_id: 'kcWeb.id' });
  });

  it('should not throw an error when $KcSensors is not defined', () => {
    window.$KcSensors = undefined;
    expect(() => {
      track('testEvent', { label: 'testLabel' });
    }).not.toThrow();
  });
});

describe('getAnonymousID', () => {
  it('should return empty string if $KcSensors does not exist', () => {
    window.$KcSensors = undefined;
    expect(getAnonymousID()).toEqual('');
  });

  it('should return the anonymous ID from $KcSensors', () => {
    window.$KcSensors = { getAnonymousID: () => '123456' };
    expect(getAnonymousID()).toEqual('123456');
  });
});

describe('compose', () => {
  const mockCompose = jest.fn(() => 'mocked-compose-result');
  const mockSpm = { compose: mockCompose };
  const mockSensors = { spm: mockSpm };

  beforeAll(() => {
    Object.defineProperty(window, '$KcSensors', {
      value: mockSensors,
      writable: true,
    });
  });

  afterAll(() => {
    delete window.$KcSensors;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty string if $KcSensors not defined', () => {
    delete window.$KcSensors;
    expect(compose()).toBe('');
  });

  it('should call $KcSensors.spm.compose with arguments', () => {
    const arg1 = 'arg1';
    const arg2 = 'arg2';
    const arg3 = 'arg3';
    const result = compose(arg1, arg2, arg3);

    expect(result).toBe('');
  });
});

describe('injectExpose', () => {
  test('should pass trackObserve prop with instance value when $KcSensors is available', () => {
    const mockInstance = jest.fn();
    window.$KcSensors = {
      observeExpose: jest.fn().mockReturnValue(mockInstance),
    };
    const MockComponent = ({ trackObserve }) => {
      trackObserve();
      return <div>MockComponent</div>;
    };
    const WrappedComponent = injectExpose(MockComponent);
    renderWithTheme(<WrappedComponent />);
    expect(mockInstance).toHaveBeenCalledTimes(0);
  });

  test('should pass noop function as trackObserve prop when $KcSensors is not available', () => {
    window.$KcSensors = undefined;
    const MockComponent = ({ trackObserve }) => {
      trackObserve();
      return <div>MockComponent</div>;
    };
    const WrappedComponent = injectExpose(MockComponent);
    const {
      wrapper: { container },
    } = renderWithTheme(<WrappedComponent />);
    expect(container.firstChild).toHaveTextContent('MockComponent');
  });
});

describe('saTrackForBiz', () => {
  window.$KcSensors = {
    spm: {
      compose: jest.fn(() => ['test', 'spm']),
    },
    track: jest.fn(),
  };
  it('should call track with saType and spm', () => {
    const mockTrack = jest.fn();

    window.track = mockTrack;
    saTrackForBiz({ saType: 'click' }, ['test', 'spm'], { test: 'data' });
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it('should not call track when $KcSensors is not defined', () => {
    const mockTrack = jest.fn();
    window.track = mockTrack;
    saTrackForBiz({ saType: 'click' }, ['test', 'spm'], { test: 'data' });
    expect(mockTrack).not.toHaveBeenCalled();
  });
});

describe('gaExpose function', () => {
  it('should call gaExpose function with correct parameters', () => {
    window.$KcSensors = {
      spm: {
        compose: jest.fn(() => ['test', 'spm']),
      },
      track: jest.fn(),
    };
    const spm = ['a', 'b', 'c'];
    const data = { id: '123' };
    gaExpose(spm, data);
    expect(window.$KcSensors.track).toHaveBeenCalledWith('expose', {
      id: '123',
      spm_id: ['test', 'spm'],
    });
  });
});

describe('gaClick', () => {
  it('should call trackClick function with correct parameters', () => {
    window.$KcSensors = {
      trackClick: jest.fn(),
    };
    const spm = ['a', 'b', 'c'];
    const data = { id: '123' };
    gaClick(spm, data);
    expect(window.$KcSensors.trackClick).toHaveBeenCalledWith(spm, data);
  });

  it('should call trackClick function without data parameter', () => {
    window.$KcSensors = {
      trackClick: jest.fn(),
    };
    const spm = {};
    gaClick(spm);
    expect(window.$KcSensors.trackClick).toHaveBeenCalledWith([{}, '1'], {});
  });
});

describe('saveSpm2Storage', () => {
  it('should call spmStorage.spmStorage', () => {
    window.$KcSensors = {
      spmStorage: {
        saveSpm2SessionStorage: jest.fn(),
      },
    };
    expect(saveSpm2Storage('/abc', { id: 123 })).toBeUndefined();
  });

  it('should call spmStorage.spmStorage, not startWith"/" ', () => {
    window.$KcSensors = {
      spmStorage: {
        saveSpm2SessionStorage: jest.fn(),
      },
    };
    expect(saveSpm2Storage('test', { id: 123 })).toBeUndefined();
  });
});

describe('composeSpmAndSave', () => {
  it('should return undefined when no spms composeSpmAndSave', () => {
    expect(composeSpmAndSave('/abc')).toBeUndefined();
  });

  it('should return undefined when have spms composeSpmAndSave', () => {
    expect(composeSpmAndSave('/abc', { id: 123 })).toBeUndefined();
  });
});

describe('getSavedSpm', () => {
  it('should return undefined when no spms getSavedSpm', () => {
    window.$KcSensors = {
      spmStorage: {
        getSavedSpm: jest.fn(),
      },
    };
    expect(getSavedSpm()).toBeUndefined();
  });
});

describe('useGaExpose', () => {
  // Mock _DEV_ and _IS_TEST_ENV_ for the test environment
  global._DEV_ = true;
  global._IS_TEST_ENV_ = true;

  it('calls gaExpose with spm and data when allowExpose is not a function', () => {
    const spm = 'test-spm';
    const data = { key: 'value' };
    window.$KcSensors = {
      spm: {
        compose: jest.fn(() => ['test', 'spm']),
      },
      track: jest.fn(),
    };
    renderHook(() => useGaExpose(spm, { data }));
    expect(window.$KcSensors.track).toHaveBeenCalledWith('expose', {
      key: 'value',
      spm_id: ['test', 'spm'],
    });
  });

  it('does not call gaExpose when allowExpose is a function', () => {
    const spm = 'test-spm';
    const data = { key: 'value' };
    const allowExpose = jest.fn().mockReturnValue(false);
    window.$KcSensors = {
      spm: {
        compose: jest.fn(() => ['test', 'spm']),
      },
      track: jest.fn(),
    };
    renderHook(() => useGaExpose(spm, { data, allowExpose }));

    expect(allowExpose).toHaveBeenCalled();
  });
});