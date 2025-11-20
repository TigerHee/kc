/**
 * Owner: lucas.l.lu@kupotech.com
 */
import JsBridge from 'utils/jsBridge';
import { updateHeader } from 'components/$/CommunityCollect/jsapi/updateHeader';

jest.mock('utils/jsBridge', () => ({
  open: jest.fn(),
}));

describe('updateHeader', () => {
  beforeEach(() => {
    JsBridge.open.mockClear();
  });

  it('should handle supportNew=true with default colors', () => {
    updateHeader({ supportNew: true });

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'event',
      params: {
        name: 'updateHeader',
        statusBarIsLightMode: true,
        visible: true,
        background: '#FFFFFF',
        titleColor: '#1D1D1D',
        leftTint: '#1D1D1D',
        rightTint: '#1D1D1D',
      },
    });
  });

  it('should handle supportNew=false with transparency', () => {
    updateHeader({ supportNew: false });

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'event',
      params: {
        name: 'updateHeader',
        statusBarTransparent: true,
        statusBarIsLightMode: true,
        visible: false,
      },
    });
  });

  it('should pass additional options when supportNew=true', () => {
    updateHeader({ supportNew: true, additionalOption: 'test' });

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'event',
      params: {
        name: 'updateHeader',
        statusBarIsLightMode: true,
        visible: true,
        background: '#FFFFFF',
        titleColor: '#1D1D1D',
        leftTint: '#1D1D1D',
        rightTint: '#1D1D1D',
        additionalOption: 'test',
      },
    });
  });

  it('should handle empty options', () => {
    updateHeader();

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'event',
      params: {
        name: 'updateHeader',
        statusBarTransparent: true,
        statusBarIsLightMode: true,
        visible: false,
      },
    });
  });
});
