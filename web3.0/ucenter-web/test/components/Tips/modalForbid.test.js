import ModalForbid from 'src/components/Tips/modalForbid';
import { customRender } from 'test/setup';

describe('test ModalForbid', () => {
  test('test ModalForbid', () => {
    customRender(<ModalForbid />, {});
  });
});
