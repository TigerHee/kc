/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import FAQJson from 'src/components/Seo/FAQJson.js';
import { customRender } from 'src/test/setup';

describe('test FAQJson', () => {
  test('test FAQJson', async () => {
    const faqSeoData = [
      {
        question: '1',
        answer: '2',
      },
    ];

    customRender(<FAQJson faq={faqSeoData} />);
  });
});
