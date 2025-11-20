import { fireEvent } from '@testing-library/react';
import BindDialog from 'src/components/Account/Kyc3/Home/BindDialog';
import { customRender } from 'test/setup';

describe('test Kyc3 BindDialog', () => {
  test('test Kyc3  BindDialog', () => {
    customRender(<BindDialog open={true} onCancel={() => {}} />, {});
    fireEvent.click(document.querySelector('.KuxButton-contained'));
  });
});

describe('test Kyc3 BindDialog 2', () => {
  test('test Kyc3  BindDialog 2', () => {
    customRender(<BindDialog open={true} onCancel={() => {}} />, {
      user: {
        user: {
          email: 'email@test.com',
        },
      },
    });
    fireEvent.click(document.querySelector('.KuxButton-contained'));
  });
});
