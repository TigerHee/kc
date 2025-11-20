import React from 'react';
import { customRender } from 'test/setup';
// import { fireEvent } from '@testing-library/react';

import CoinBox from 'src/components/Assets/Overview/CoinBox.js'; // 请根据你的文件路径进行调整

describe('CoinBox', () => {
  it('renders without crashing', () => {
    const { getByTestId } = customRender(<CoinBox totalAssets={100} baseCurrency="USD" />);
    expect(getByTestId('coin-box')).toBeInTheDocument();
  });

  it('renders the correct total assets', () => {
    const { getByText } = customRender(<CoinBox totalAssets={100} baseCurrency="USD" />);
    expect(getByText('100')).toBeInTheDocument();
  });

  // it('renders the correct base currency', () => {
  //   const { getByText } = customRender(<CoinBox totalAssets={100} baseCurrency="USD" />);
  //   expect(getByText('USD')).toBeInTheDocument();
  // });

  // it('renders the prompt when provided', () => {
  //   const { getByText } = customRender(
  //     <CoinBox totalAssets={100} baseCurrency="USD" prompt={{ content: 'Test Prompt' }} />,
  //   );
  //   expect(getByText('Test Prompt')).toBeInTheDocument();
  // });

  // it('calls the onPromptClose function when the close button is clicked', () => {
  //   const mockOnPromptClose = jest.fn();
  //   const { getByTestId } = customRender(
  //     <CoinBox
  //       totalAssets={100}
  //       baseCurrency="USD"
  //       prompt={{ content: 'Test Prompt' }}
  //       onPromptClose={mockOnPromptClose}
  //     />,
  //   );
  //   fireEvent.click(getByTestId('close-button'));
  //   expect(mockOnPromptClose).toHaveBeenCalled();
  // });
});
