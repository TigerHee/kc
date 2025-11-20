import {useMemoizedFn, useToggle} from 'ahooks';
import React, {useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import selectIc from 'assets/common/ic-single-select.png';
import {ConfirmPopup} from 'components/Common/Confirm';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {makeRemoveOptions} from './presenter';
import {
  BarText,
  BarWrap,
  RemoveConfigContent,
  RemoveConfigDesc,
  RemoveConfigLabel,
  RemoveItemWrap,
  RemovePopupTitle,
  SelectIc,
} from './styles';

const RemoveConfigItem = ({config, active, onClick}) => {
  const {title, desc, value} = config;
  const isActive = value === active;

  const innerOnClick = useMemoizedFn(() => {
    onClick?.(value);
  });

  return (
    <TouchableWithoutFeedback onPress={innerOnClick}>
      <RemoveItemWrap isActive={isActive}>
        <View>
          <RemoveConfigLabel>{title}</RemoveConfigLabel>
          <RemoveConfigDesc>{desc}</RemoveConfigDesc>
        </View>
        {isActive && <SelectIc source={selectIc} />}
      </RemoveItemWrap>
    </TouchableWithoutFeedback>
  );
};
const removeOptions = makeRemoveOptions();

const FollowerTopBar = ({myCopyFollowersCount = 0}) => {
  const [showCancelFollowerDialog, {toggle}] = useToggle(false);
  const [selectItem, setSelectItem] = useState();
  const {_t} = useLang();
  const handleRemoveFollower = useMemoizedFn(async () => {
    toggle();
  });

  return (
    <>
      <BarWrap>
        <RowWrap>
          <BarText>
            {_t('80866cd0a0604000ac44', {
              num: myCopyFollowersCount,
            })}
          </BarText>
        </RowWrap>
        <BarText>
          {_t('82091c5047174000a4ac', {symbol: getBaseCurrency()})}
        </BarText>
      </BarWrap>
      <ConfirmPopup
        styles={{
          containerStyle: css`
            padding: 0 16px 16px;
          `,
        }}
        id="tag"
        show={showCancelFollowerDialog}
        onClose={toggle}
        onCancel={toggle}
        title={<RemovePopupTitle>选择移除类型</RemovePopupTitle>}
        hiddenCancel
        onOk={handleRemoveFollower}
        okText="确定移除">
        <RemoveConfigContent>
          {removeOptions?.map(i => (
            <RemoveConfigItem
              onClick={setSelectItem}
              config={i}
              key={i.title}
              active={selectItem}
            />
          ))}
        </RemoveConfigContent>
      </ConfirmPopup>
    </>
  );
};

export default FollowerTopBar;
