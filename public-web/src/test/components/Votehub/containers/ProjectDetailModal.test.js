/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import ProjectDetailModal from 'src/components/Votehub/containers/components/ProjectDetailModal/index.js';
import { customRender } from 'src/test/setup';

describe('test ProjectDetailModal', () => {
  test('test ProjectDetailModal with open false', async () => {
    customRender(<ProjectDetailModal />, {
      votehub: { detailModal: false, detailInfo: {} },
    });

    customRender(<ProjectDetailModal />, {
      votehub: { detailModal: false, detailInfo: { voteNumber: '' } },
    });
  });

  test('test ProjectDetailModal with open true', async () => {
    customRender(<ProjectDetailModal />, {
      votehub: {
        detailModal: true,
        detailInfo: { voteNumber: '1000', logoUrl: 'aass', currency: 'A', project: 'Aa' },
      },
    });

    const closeBtn = document.getElementsByClassName('KuxModalHeader-close');
    expect(closeBtn[0]).toBeInTheDocument();
    fireEvent.click(closeBtn[0]);
  });
});
