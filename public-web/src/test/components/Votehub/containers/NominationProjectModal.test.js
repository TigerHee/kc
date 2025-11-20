/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import NominationProjectModal from 'src/components/Votehub/containers/components/NominationProjectModal/index.js';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          success: () => {},
        },
      };
    },
  };
});

describe('test NominationProjectModal', () => {
  test('test NominationProjectModal', async () => {
    customRender(<NominationProjectModal />, {
      votehub: { nominationModal: true, chainList: [], nominationVotesNum: '10', votesNum: '100' },
    });

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });
});
