/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui/emotion';

import { _t } from 'utils/lang';

import { Checkbox } from '@kux/mui';

import { useGetControlDisplay, useSetControlDisplay } from '../hook';

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 24px 0 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  .KuxCheckbox-wrapper {
    &:first-of-type {
      margin-right: 24px;
    }
  }
`;

const CheckBoxItem = styled(Checkbox)`
  display: inline-flex;
  align-items: center;
  margin-right: 14px;
  max-width: 50%;

  > span {
    top: 0;
    margin-left: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
    &:first-of-type {
      margin-right: 4px;
    }
    user-select: none;
  }

  .KuxCheckbox-inner {
    width: 14px;
    height: 14px;
    border-width: 1px;
    border: 1px solid ${(props) => props.theme.colors.icon40};
  }

  &.KuxCheckbox-wrapper-checked {
    > span {
      &:last-of-type {
        color: ${(props) => props.theme.colors.text};
      }
      .KuxCheckbox-inner {
        border: 0;
      }
    }
  }
`;

const PCControlDisplay = () => {
  const { shareDisplayProfit, shareDisplayName } = useGetControlDisplay();
  const { changeDisplayName, changeDisplayRoe } = useSetControlDisplay();

  return (
    <CheckBoxWrapper>
      <CheckBoxItem
        onChange={(e) => {
          const { checked } = e.target;
          changeDisplayName(checked);
        }}
        checked={shareDisplayName}
      >
        {_t('futures.pnlShare.displayName')}
      </CheckBoxItem>
      <CheckBoxItem
        onChange={(e) => {
          const { checked } = e.target;
          changeDisplayRoe(checked);
        }}
        checked={shareDisplayProfit}
      >
        {_t('futures.pnlShare.displayRoe')}
      </CheckBoxItem>
    </CheckBoxWrapper>
  );
};

export default React.memo(PCControlDisplay);
