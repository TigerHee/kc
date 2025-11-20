import { fireEvent } from '@testing-library/react';
import UpgradeModal from 'src/components/UpgradeModal/index';
import { customRender } from 'test/setup';

describe('test UpgradeModal', () => {
  test('test UpgradeModal', () => {
    customRender(<UpgradeModal />, {});

    fireEvent.click(document.querySelector('.KuxButton-contained'));
  });
});
