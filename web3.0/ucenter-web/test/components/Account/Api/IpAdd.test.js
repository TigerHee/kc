/**
 * Owner: willen@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import IpAdd, { isSingleValidIP } from 'src/components/Account/Api/IpAdd';
import { customRender } from 'test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          error: () => {},
        },
      };
    },
  };
});

describe('test IpAdd', () => {
  test('test IpAdd component', () => {
    const onChange = jest.fn();

    const { rerender } = customRender(<IpAdd initList="" onChange={onChange} />);

    const div = screen.getByTestId('input');

    const input = div.querySelector('input'); // 获取`<div>`内的`<input>`

    // 确认input存在
    expect(input).not.toBeNull();

    fireEvent.input(input, { target: { value: '192.0.0.1' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    rerender(<IpAdd err="err" />);

    fireEvent.input(input, { target: { value: '192，0.0.1' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    fireEvent.input(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    fireEvent.input(input, { target: { value: '192,0.0.1' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('IP Address Validation', () => {
  // Test cases for valid IPv4 addresses
  test('test isSingleValidIP', () => {
    expect(isSingleValidIP('192.168.1.1')).toBeTruthy();
    expect(isSingleValidIP('192.168.*.*')).toBeTruthy();
    expect(isSingleValidIP('192.168.*')).toBeTruthy();
    expect(isSingleValidIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBeTruthy();
    expect(isSingleValidIP('2001:0db8:85a3:0000:*')).toBeTruthy();
    expect(isSingleValidIP('2001::0db8:85a3:*')).toBeTruthy();
    expect(isSingleValidIP('2001::0db8:*')).toBeFalsy();
    expect(isSingleValidIP('invalidIP')).toBeFalsy();
    expect(isSingleValidIP('1.1.1')).toBeFalsy();
    expect(isSingleValidIP('*.*.*.*')).toBeFalsy();
    expect(isSingleValidIP('2001:0db8:85a3::*:*:*:*')).toBeTruthy();
    expect(isSingleValidIP('*:*:*:*:85a3:0000:8a2e:0370')).toBeFalsy();
    expect(isSingleValidIP('2001:0db8:85a3:0000:0000:8a2*')).toBeFalsy();
  });
});
