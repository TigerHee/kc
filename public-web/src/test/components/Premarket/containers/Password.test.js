/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import Password from 'src/components/Premarket/containers/TradeModal/Password.js';
import { customRender } from 'src/test/setup';

describe('test Password', () => {
  test('test Password with not open', async () => {
    customRender(<Password />, {});
  });

  test('test Password with open', async () => {
    customRender(<Password open={true} onClose={() => {}} onConfirm={() => {}} />, {});
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    const checkbox = document.querySelector('.agreement-check');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
  });
});
