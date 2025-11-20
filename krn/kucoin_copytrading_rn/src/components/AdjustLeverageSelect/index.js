import {useMemoizedFn, useToggle} from 'ahooks';
import {FOLLOW_SETTING_EDIT_MODE} from 'pages/FollowSetting/components/CopyMaxAmount';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {css} from '@emotion/native';

import selectDefaultIcon from 'assets/common/select-group-icon.png';
import {ConfirmPopup} from 'components/Common/Confirm';
import {PlusIcon, SubIcon} from 'components/Common/SvgIcon';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {lessThan} from 'utils/operation';
import {generateTrackMarks} from './helper';
import LeverageSlider from './LeverageSlider';
import {
  AdjustIconBox,
  CenterControlWrap,
  LeverageText,
  SelectBox,
  SelectedIcon,
  ShowLeverageText,
} from './styles';

const AdjustLeverageSelect = props => {
  const {
    min,
    max,
    value,
    onChange,
    style,
    trackMarks,
    disabled,
    editMode = FOLLOW_SETTING_EDIT_MODE.Create,
    ...others
  } = props;

  const {_t} = useLang();
  const [visible, {toggle}] = useToggle(false);
  const [innerValue, setInnerValue] = useState(value || min);
  const isEditScene = editMode === FOLLOW_SETTING_EDIT_MODE.Edit;
  useEffect(() => {
    value && setInnerValue(value);
  }, [value]);

  const submitLeverage = () => {
    onChange(innerValue);
    toggle();
  };

  const innerTrackMarks = useMemo(() => {
    if (trackMarks) return trackMarks;
    return generateTrackMarks(min, max);
  }, [max, min, trackMarks]);

  const showLeverage = useMemo(
    () => (innerValue ? `${innerValue}x` : ''),
    [innerValue],
  );

  const showOuterLeverage = useMemo(() => (value ? `${value}x` : ''), [value]);

  const handlePlusOrSub = useMemoizedFn(isPlus => {
    const maxLimit = isPlus && +innerValue >= +max;
    const minLimit = !isPlus && +innerValue <= +min;
    if (minLimit || maxLimit) {
      return;
    }

    setInnerValue(isPlus ? Number(innerValue) + 1 : Number(innerValue) - 1);
  });

  const onPressOuter = () => {
    // 杠杠配置错误 禁用杠杠选择器
    if (disabled || lessThan(max)(min)) return;
    setInnerValue(value || min);
    toggle();
  };

  return (
    <>
      {isEditScene && !showOuterLeverage ? null : (
        <SelectBox style={style} onPress={onPressOuter}>
          <LeverageText>{showOuterLeverage}</LeverageText>
          <SelectedIcon source={selectDefaultIcon} />
        </SelectBox>
      )}

      <ConfirmPopup
        onOk={submitLeverage}
        okText={_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
        onCancel={toggle}
        onClose={toggle}
        show={visible}
        title={_t('7d653911bcb24000ad39')}
        styles={{
          containerStyle: css`
            margin: 20px 16px 0;
          `,
        }}>
        <CenterControlWrap>
          <RowWrap>
            <AdjustIconBox
              ripple
              disabled={innerValue === min}
              onPress={() => handlePlusOrSub()}>
              <SubIcon />
            </AdjustIconBox>

            <ShowLeverageText>{showLeverage}</ShowLeverageText>
            <AdjustIconBox
              ripple
              disabled={innerValue === max}
              onPress={() => handlePlusOrSub(true)}>
              <PlusIcon />
            </AdjustIconBox>
          </RowWrap>
        </CenterControlWrap>

        <LeverageSlider
          {...others}
          trackMarks={innerTrackMarks}
          maximumValue={max}
          minimumValue={min}
          value={innerValue}
          onChange={setInnerValue}
        />
      </ConfirmPopup>
    </>
  );
};

export default memo(AdjustLeverageSelect);
