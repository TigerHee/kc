/**
 * Owner: willen@kupotech.com
 */
import Report from 'tools/ext/kc-report';
import {
  compose,
  ga,
  gaClickNew,
  getGaElement,
  getPageId,
  saTrackForBiz,
  track,
  trackClick,
} from 'utils/ga';
import sensors from '../__mocks__/@kucoin-base/sensors';

jest.mock('tools/ext/kc-report', () => ({
  logAction: jest.fn(),
}));

beforeEach(() => {
  global._hmt = {
    push: jest.fn(),
  };
  global.requestIdleCallback = jest.fn();
});

afterEach(() => {
  global._hmt = undefined;
});

describe('ga', () => {
  it('should return directly if key is null or undefined', () => {
    ga(null);
    ga();
    expect(window._hmt.push).not.toHaveBeenCalled();
    expect(Report.logAction).not.toHaveBeenCalled();
  });

  it('should call window._hmt.push if window._hmt exists and window._hmt.push is a function', () => {
    window._hmt = { push: jest.fn() };
    ga('key');
    expect(window._hmt.push).toHaveBeenCalledWith(['_trackEvent', 'key', 'click']);
    expect(Report.logAction).toHaveBeenCalledWith('key', 'click');
  });

  it('should call Report.logAction regardless of the state of window._hmt', () => {
    window._hmt = null;
    ga('key');
    expect(Report.logAction).toHaveBeenCalledWith('key', 'click');
  });
});

describe('getGaElement', () => {
  it('should return undefined if node is null, undefined, or its localName is "body"', () => {
    expect(getGaElement(null, 'attr')).toBeUndefined();
    expect(getGaElement(undefined, 'attr')).toBeUndefined();
    expect(getGaElement({ localName: 'body' }, 'attr')).toBeUndefined();
  });

  it('should return the value of the attr attribute if node has it', () => {
    const node = { getAttribute: jest.fn().mockReturnValue('value') };
    expect(getGaElement(node, 'attr')).toBe('value');
  });

  it('should recursively look for the attr attribute in node.parentNode if node does not have it', () => {
    const parentNode = { getAttribute: jest.fn().mockReturnValue('value') };
    const node = { parentNode, getAttribute: jest.fn().mockReturnValue(null) };
    expect(getGaElement(node, 'attr')).toBe('value');
  });
});

describe('gaClickNew', () => {
  it('should return directly if key is null or undefined', () => {
    gaClickNew(null);
    gaClickNew();
    expect(window._hmt.push).not.toHaveBeenCalled();
    expect(Report.logAction).toHaveBeenCalledWith('key', 'click');
  });

  it('should call window._hmt.push if window._hmt exists and window._hmt.push is a function', () => {
    window._hmt = { push: jest.fn() };
    gaClickNew('key', { siteid: 'site', pageid: 'page', modid: 'mod', eleid: 'ele' });
    expect(window._hmt.push).toHaveBeenCalledWith(['_trackEvent', 'key', 'click']);
    expect(Report.logAction).toHaveBeenCalledWith('key', 'click');
  });

  it('should call Report.logAction regardless of the state of window._hmt', () => {
    window._hmt = null;
    gaClickNew('key', { siteid: 'site', pageid: 'page', modid: 'mod', eleid: 'ele' });
    expect(Report.logAction).toHaveBeenCalledWith('key', 'click');
  });
});

describe('trackClick', () => {
  it('should call sensors.trackClick', () => {
    const spm = 'spm';
    const data = { key: 'value' };
    const trackClickMock = jest.fn();
    sensors.trackClick = trackClickMock;
    trackClick(spm, data);
    expect(trackClickMock).toHaveBeenCalledWith(spm, data);
  });
});

describe('track', () => {
  it('should return directly if eventType or options is null or undefined', () => {
    track(null, null);
    expect(sensors.track).toHaveBeenCalledWith(null, null);
  });

  it('should call sensors.track if eventType and options exist', () => {
    const eventType = 'eventType';
    const options = { key: 'value' };
    track(eventType, options);
    expect(sensors.track).toHaveBeenCalledWith(eventType, options);
  });

});

describe('saTrackForBiz', () => {
  it('should call sensors.track if saType exists', () => {
    const saType = 'saType';
    const spm = ['spm'];
    const data = { key: 'value' };
    saTrackForBiz({ saType }, spm, data);
    expect(sensors.track).toHaveBeenCalled();
  });
});

describe('getPageId', () => {
  it('should return directly if sensors is null or undefined', () => {
    const result = getPageId();
    expect(result).toBe('page');
    expect(sensors.spm.getPageId).toHaveBeenCalled();
  });

  it('should call sensors.spm.getPageId if sensors exists', () => {
    getPageId();
    expect(sensors.spm.getPageId).toHaveBeenCalled();
  });
});
