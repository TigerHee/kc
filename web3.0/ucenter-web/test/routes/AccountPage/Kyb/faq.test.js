import { fireEvent } from '@testing-library/react';
import FAQ from 'src/routes/AccountPage/Kyc/KybHome/FAQ';
import { customRender } from 'test/setup';

describe('kyb faq', () => {
  it('click item', () => {
    const { getByTestId } = customRender(<FAQ />);
    const faqList = getByTestId('kyb_faq_list');
    const items = [...faqList.childNodes];
    fireEvent.click(items[0]);
  });
});
