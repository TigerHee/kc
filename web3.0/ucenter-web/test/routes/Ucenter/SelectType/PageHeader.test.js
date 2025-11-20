import { fireEvent } from '@testing-library/react';
import PageHeader from 'src/routes/Ucenter/SelectType/PageHeader';
import { customRender } from 'test/setup';

describe('test PageHeader', () => {
  test('test PageHeader', () => {
    customRender(<PageHeader title="title" />, {});

    fireEvent.click(document.querySelector('[data-inspector="page_header_back"]'));
  });
});
