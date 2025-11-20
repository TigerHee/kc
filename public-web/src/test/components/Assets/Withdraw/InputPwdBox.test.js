/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import { cleanup, fireEvent } from '@testing-library/react';
import InputPwdBox from 'src/components/Assets/Withdraw/InputPwdBox';
import { customRender } from 'src/test/setup';

describe('test Withdraw', () => {
  test('test Withdraw InputPwdBox', async () => {
    customRender(<InputPwdBox />);
    expect(document.querySelector('input')).toBeInTheDocument();
  });

  test('test Withdraw InputPwdBox 2', async () => {
    customRender(<InputPwdBox isPassword={false} value="123456" />);
    expect(document.querySelector('input')).toBeInTheDocument();
  });

  test('test Withdraw InputPwdBox click', async () => {
    customRender(<InputPwdBox />);
    const input1 = document.querySelector('input');
    expect(input1).toBeInTheDocument();
    fireEvent.click(input1);
  });

  test('test Withdraw InputPwdBox change 1', async () => {
    customRender(<InputPwdBox />);
    const inputs = document.querySelectorAll('input');
    expect(inputs[0]).toBeInTheDocument();
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.change(inputs[0], { target: { value: '12' } });
    fireEvent.click(inputs[0]);
  });

  test('test Withdraw InputPwdBox change last', async () => {
    customRender(<InputPwdBox value="123456" />);
    const inputs = document.querySelectorAll('input');
    expect(inputs[0]).toBeInTheDocument();
    fireEvent.click(inputs[5]);
    fireEvent.change(inputs[5], { target: { value: '7' } });
    fireEvent.click(inputs[0]);
  });

  test('test Withdraw InputPwdBox back', async () => {
    customRender(<InputPwdBox value="123456" />);
    const inputs = document.querySelectorAll('input');
    expect(inputs[0]).toBeInTheDocument();
    fireEvent.click(inputs[5]);
    fireEvent.keyUp(inputs[5], { keyCode: 8 });
  });

  afterEach(cleanup);
});
