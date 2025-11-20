/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import { InviteUserSteps } from 'TradeActivity/GemPool/ProjectDetail/containers/InviteUserSteps.js';

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

describe('InviteUserSteps', () => {
  it('InviteUserSteps empty list', () => {
    customRender(<InviteUserSteps inviteBonusLevel={[]} invitedUser={8} />);
  });

  it('InviteUserSteps less than 5', () => {
    const inviteBonusLevel = Array.from({ length: 4 }, (_, i) => ({
      userAmount: (i + 1) * 5,
      boost: 0.02 * (i + 1),
    }));

    customRender(
      <InviteUserSteps
        inviteBonusLevel={inviteBonusLevel}
        invitedUser={4}
      />,
    );
  });
  it('InviteUserSteps more than 5', () => {
    const inviteBonusLevel = Array.from({ length: 6 }, (_, i) => ({
      userAmount: (i + 1) * 5,
      boost: 0.02 * (i + 1),
    }));

    customRender(
      <InviteUserSteps
        inviteBonusLevel={inviteBonusLevel}
        invitedUser={4}
      />,
    );
  });

  it('InviteUserSteps more than 5 in step 2', () => {
    const inviteBonusLevel = Array.from({ length: 6 }, (_, i) => ({
      userAmount: (i + 1) * 5,
      boost: 0.02 * (i + 1),
    }));

    customRender(
      <InviteUserSteps
        inviteBonusLevel={inviteBonusLevel}
        invitedUser={11}
      />,
    );
  });

  it('InviteUserSteps only 1', () => {
    const inviteBonusLevel = Array.from({ length: 1 }, (_, i) => ({
      userAmount: (i + 1) * 5,
      boost: 0.02 * (i + 1),
    }));

    customRender(
      <InviteUserSteps
        inviteBonusLevel={inviteBonusLevel}
        invitedUser={4}
      />,
    );
  });

});
