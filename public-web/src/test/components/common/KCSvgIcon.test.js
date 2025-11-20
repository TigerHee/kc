/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import KCSvgIcon from 'src/components/common/KCSvgIcon';
import { customRender } from 'src/test/setup';

describe('test common KCSvgIcon', () => {
  test('test common KCSvgIcon 1', async () => {
    customRender(<KCSvgIcon iconId="xxx" onError={() => {}} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('test common KCSvgIcon', async () => {
    customRender(<KCSvgIcon iconId="world" onCompleted={() => {}} onError={() => {}} />);
  });
});
