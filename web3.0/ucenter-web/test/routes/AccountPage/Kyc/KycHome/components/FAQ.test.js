import { fireEvent } from '@testing-library/react';
import FAQ from 'src/routes/AccountPage/Kyc/KycHome/components/FAQ';
import { customRender } from 'test/setup';

describe('test FAQ', () => {
  test('test FAQ', () => {
    const { getByTestId } = customRender(<FAQ />, {});

    fireEvent.click(getByTestId('faqItem0'));
  });
});
