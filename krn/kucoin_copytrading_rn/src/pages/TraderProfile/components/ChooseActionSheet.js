/**
 * Owner: mike@kupotech.com
 */
import React, {memo, useMemo} from 'react';
import styled, {css} from '@emotion/native';
import {showToast} from '@krn/bridge';

import SelectDrawer from 'components/Common/Select/components/SelectDrawer';
import * as SvgIcon from 'components/Common/SvgIcon';
import {
  TRADER_ACTIVE_STATUS,
  validateLeaderConfigHelper,
} from 'constants/businessType';
import useLang from 'hooks/useLang';
import {getEnhanceColorByType} from 'utils/color-helper';
import {REVIEW_STATUS_MAP, REVIEW_STATUS_TEXT_KEY_MAP} from '../constant';

const Flex = styled.View`
  flex-direction: row;
  flex: 1;

  ${({sb}) => {
    if (sb) {
      return {
        justifyContent: 'space-between',
      };
    }
  }}
  ${({vc}) => {
    if (vc) {
      return {
        alignItems: 'center',
      };
    }
  }}
  ${({flex}) => {
    if (flex) {
      return {
        flex,
      };
    }
  }}
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text};
  margin-left: 8px;
  flex: 1;
`;

const CheckingWrap = styled.View`
  margin-left: 8px;
  padding: 2px 4px;
  border-radius: 4px;

  ${({reviewStatus, theme}) => {
    switch (reviewStatus) {
      case REVIEW_STATUS_MAP.pending:
        return `
        background-color: ${theme.colorV2.complementary8};
        `;
      case REVIEW_STATUS_MAP.reject:
        return `
        background-color: ${getEnhanceColorByType(theme.type, 'brandRed8')};
        `;
      case REVIEW_STATUS_MAP.success:
        return `
        background-color: ${theme.colorV2.primary8};
        `;
    }
  }}
`;

const CheckingText = styled.Text`
  font-size: 12px;
  font-weight: 500;

  ${({reviewStatus, theme}) => {
    switch (reviewStatus) {
      case REVIEW_STATUS_MAP.pending:
        return `
        color: ${theme.colorV2.complementary};
        `;
      case REVIEW_STATUS_MAP.reject:
        return `
        color: ${getEnhanceColorByType(theme.type, 'brandRed')};
        `;
      case REVIEW_STATUS_MAP.success:
        return `
        color: ${theme.colorV2.primary};
        `;
      default:
        return `color: ${theme.colorV2.text}`;
    }
  }}
`;
const renderItem = ({icon: Icon, label, reviewStatus, _t}) => {
  const statusText = REVIEW_STATUS_TEXT_KEY_MAP[reviewStatus]
    ? _t(REVIEW_STATUS_TEXT_KEY_MAP[reviewStatus])
    : '';
  return (
    <Flex vc sb flex={1}>
      <Flex vc>
        <Icon />
        <Label>{label}</Label>

        {!!statusText && (
          <CheckingWrap reviewStatus={reviewStatus}>
            <CheckingText reviewStatus={reviewStatus}>
              {statusText}
            </CheckingText>
          </CheckingWrap>
        )}
      </Flex>
      {reviewStatus !== REVIEW_STATUS_MAP.pending && <SvgIcon.ArrowRightIcon />}
    </Flex>
  );
};
const mergeOptions = (options, _t) =>
  options.map(item => {
    return {
      ...item,
      label: renderItem({
        icon: SvgIcon[item.icon],
        label: item.label,
        reviewStatus: item.status,
        _t,
      }),
    };
  });

const ChooseActionSheet = ({
  title,
  options = [],
  show,
  toggleSheet,
  onSelected,
  leadStatus,
  status,
}) => {
  const {_t} = useLang();
  const _options = useMemo(() => mergeOptions(options, _t), [_t, options]);

  const _onSelected = v => {
    const targetStatus = _options?.find(i => i.value === v)?.status;
    // 需求 如果我的带单身份非正常状态，不允许修改个人信息
    if (
      validateLeaderConfigHelper.isUnNormal(leadStatus) &&
      status !== TRADER_ACTIVE_STATUS.Freeze
    ) {
      showToast(_t('1ef22a1957704000ae2f'));
      return;
    }

    if (+targetStatus === +REVIEW_STATUS_MAP.pending) {
      showToast(_t('82ca62c1ebbc4000aeda'));
      return;
    }

    toggleSheet();
    onSelected(v);
  };

  return (
    <SelectDrawer
      title={title}
      styles={{
        titleStyle: css`
          padding: 12px 16px 8px;
        `,
      }}
      onClose={() => toggleSheet(e => !e)}
      list={_options}
      show={show}
      handleClickItem={_onSelected}
    />
  );
};

export default memo(ChooseActionSheet);
