import {useMemoizedFn, useToggle} from 'ahooks';
import isEmpty from 'lodash/isEmpty';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {ConfirmPopup} from 'components/Common/Confirm';
import {
  CircleFillRadio,
  CircleRadio,
  FilterIcon,
} from 'components/Common/SvgIcon';
import {mediumHitSlop} from 'constants/index';
import useLang from 'hooks/useLang';
import BothSlider from './components/BothSlider';
import RangeSelector from './components/RangeSelector';
import {useMakeConditionSlideGroupConfigs} from './constant';
import {
  FilterScrollWrap,
  FilterTitleWrap,
  PopupTitle,
  RadioText,
  RightPressable,
  SlideCard,
} from './styles';

const Title = memo(({onChange, value}) => {
  const {_t} = useLang();

  const innerOnchange = () => {
    onChange(!value);
  };

  return (
    <FilterTitleWrap>
      <PopupTitle>{_t('88TvPJLbNBsoDNAZbdUZzk')}</PopupTitle>
      <RightPressable onPress={innerOnchange}>
        <View
          style={css`
            flex: 1;
            flex-direction: row;
            justify-content: flex-end;
          `}>
          {value ? <CircleFillRadio /> : <CircleRadio />}
          <RadioText numberOfLines={2}>{_t('8a2df3c978814000a429')}</RadioText>
        </View>
      </RightPressable>
    </FilterTitleWrap>
  );
});

const FilterCondition = ({value, onChange}) => {
  const [visible, {toggle}] = useToggle(false);
  const [innerState, setInnerState] = useState(value || {});
  const {_t} = useLang();
  const conditionSlideConfigs = useMakeConditionSlideGroupConfigs();
  const theme = useTheme();
  const updateFields = useMemoizedFn(obj => {
    setInnerState({
      ...innerState,
      ...obj,
    });
  });

  const resetFields = useMemoizedFn(() => {
    setInnerState({});
  });

  useEffect(() => {
    if (!visible) return;
    setInnerState(value || {});
  }, [visible, value]);

  const onConfirm = useMemoizedFn(() => {
    onChange(innerState);
    toggle(false);
  });

  const onReset = useMemoizedFn(() => {
    resetFields();
    onChange({});
    toggle(false);
  });

  const isExistFilterCondition = useMemo(
    () =>
      !isEmpty(innerState) && Object.values(innerState || {}).some(i => !!i),
    [innerState],
  );
  return (
    <>
      <View
        style={css`
          margin-left: 12px;
        `}>
        <TouchableOpacity
          hitSlop={mediumHitSlop}
          activeOpacity={0.8}
          onPress={toggle}>
          <FilterIcon isActive={isExistFilterCondition} />
        </TouchableOpacity>
      </View>

      <ConfirmPopup
        title={
          <Title
            value={innerState?.hideFull}
            onChange={val => updateFields({hideFull: val})}
          />
        }
        id="tag"
        show={visible}
        styles={{
          containerStyle: css`
            background-color: ${theme.colorV2.overlay};
            margin: 24px 16px 0px;
          `,
        }}
        onClose={toggle}
        onOk={onConfirm}
        onCancel={onReset}
        okText={_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
        cancelText={_t('f2KPkTL4Vb1sTzq28RMTFD')}>
        <FilterScrollWrap
          showsVerticalScrollIndicator={false} // 禁用垂直滚动条
        >
          <RangeSelector
            value={innerState.daysAsLeader}
            onChange={val => updateFields({daysAsLeader: val})}
          />

          {conditionSlideConfigs?.map((group, idx) => (
            <SlideCard key={idx}>
              {group.map(i => (
                <BothSlider
                  {...i}
                  value={innerState[i.key]}
                  formKey={i.key}
                  updateFormState={updateFields}
                  formState={innerState}
                />
              ))}
            </SlideCard>
          ))}
        </FilterScrollWrap>
      </ConfirmPopup>
    </>
  );
};

export default FilterCondition;
