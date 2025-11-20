import { Dialog } from '@kux/mui';
import { fireEvent } from '@testing-library/react';
import ModalBase from 'src/routes/AccountPage/SubAccount/modalBase';
import { customRender } from 'test/setup';

class ModalTest extends ModalBase {
  render() {
    const { visible } = this.props;
    return (
      <Dialog open={visible} onOk={this.handleOk}>
        Dialog
      </Dialog>
    );
  }
}

describe('test modalBase', () => {
  test('test modalBase', () => {
    customRender(
      <ModalTest
        form={{
          validateFields: () => {
            return new Promise((res, rej) => {
              res();
            });
          },
        }}
        visible
      />,
    );

    fireEvent.click(document.querySelector('.KuxButton-contained'));
  });
});
