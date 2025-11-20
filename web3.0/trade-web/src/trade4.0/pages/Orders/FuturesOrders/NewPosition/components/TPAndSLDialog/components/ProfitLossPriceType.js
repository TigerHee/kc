/**
 * Owner: clyne@kupotech.com
 */
import React, { useMemo } from 'react';

import _ from 'lodash';
import { styled, useI18n, useAuthObject, AUTH_INDEX_PRICE } from '@/pages/Futures/import';

import DSelect from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';

import { TOGGLES } from '../constants';

const Select = styled(DSelect)`
  .KuxDropDown-trigger {
    margin-right: ${(props) => (props.type === 'normal' ? 'unset' : '12px')};
  }
  .dropdown-value {
    padding: 0 2px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
    user-select: none;
  }
`;

const DropdownExtend = {
  List: styled(dropStyle.List)`
    .dropdown-item {
      font-size: 16px;
      display: flex;
      align-items: center;
      font-weight: 500;
      line-height: 1.3;
    }
    .select-footer {
      &:hover,
      &:active {
        background: ${(props) => props.theme.colors.cover8};
      }
    }
  `,
};

const StyledSelectContent = styled.div`
  .KuxSelect-dropdownIcon {
    margin-left: 2px;
    margin-top: 2px;
  }
  .KuxSelect-wrapper {
    font-size: 16px;
    font-weight: 500;
  }
  /* FIXME: 复写组件库优先级 */
  html[dir='rtl'] & {
    .KuxSelect-dropdownIcon {
      /* @noflip */
      margin-left: unset;
      /* @noflip */
      margin-right: 2px;
    }
  }
`;

const ProfitLossPriceType = ({ value, onChange }) => {
  const { _t } = useI18n();
  const authObject = useAuthObject();
  // 合约专业版高级仓位逻辑
  const selectOptions = useMemo(() => {
    const options = authObject[AUTH_INDEX_PRICE] ? TOGGLES : TOGGLES.slice(0, TOGGLES.length - 1);
    return _.map(options, (item) => {
      return { ...item, label: _t(item.label) };
    });
  }, [_t, authObject]);

  return (
    <StyledSelectContent>
      <Select
        value={value}
        classNames={{
          dropdownContainer: 'selectContainer',
        }}
        placement={'bottom'}
        listItemHeight={40}
        noStyle
        configs={selectOptions}
        matchWidth={false}
        exclusive
        onChange={onChange}
        size="small"
        extendStyle={DropdownExtend}
      />
    </StyledSelectContent>
  );
};

export default React.memo(ProfitLossPriceType);
