import {useToggle} from 'ahooks';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {ConfirmPopup} from 'components/Common/Confirm';
import ScrollableTabView from 'components/ScrollableTabView';
import useLang from 'hooks/useLang';
import {useCalcPopupHeightHelper} from './hooks/useCalcPopupHeightHelper.js';
import CopyRolePanel from './CopyRolePanel.js';
import LeadRolePanel from './LeadRolePanel';
import OverviewPanel from './OverviewPanel';
import ScoreGuidePanel from './ScoreGuidePanel';
import {makeCustomScrollableTabStyles, PopupTitle} from './styles.js';

const QuickGuidePopup = forwardRef(({styles = {}, ...rest}, ref) => {
  const [visible, {toggle}] = useToggle(false);
  const {rootHeight} = useCalcPopupHeightHelper();
  const {colorV2} = useTheme();
  const customScrollableTabStyles = makeCustomScrollableTabStyles(colorV2);
  const {_t} = useLang();
  const open = useCallback(() => {
    toggle(true);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  );

  const stacks = useMemo(
    () => [
      {screen: OverviewPanel, tabLabel: _t('6d6c1cb79e414000a155')},
      {
        screen: LeadRolePanel,
        tabLabel: _t('d136dba490754000af0f'),
      },
      {screen: CopyRolePanel, tabLabel: _t('d43f674997734000a04f')},
      {screen: ScoreGuidePanel, tabLabel: _t('2cfa1222fcf04000abd5')},
    ],
    [_t],
  );

  return (
    <ConfirmPopup
      styles={{
        ...styles,
        containerStyle: css`
          margin-top: 0;
          padding: 0;
          margin-left: 0;
          margin-right: 0;
        `,
      }}
      rootHeight={rootHeight}
      title={<PopupTitle>{_t('aa81d1f1a7ab4000affb')}</PopupTitle>}
      id="tag"
      show={visible}
      onClose={toggle}
      onCancel={toggle}
      hiddenOk
      hiddenCancel
      {...rest}>
      <View
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          height: rootHeight,
        }}>
        <ScrollableTabView stacks={stacks} styles={customScrollableTabStyles} />
      </View>
    </ConfirmPopup>
  );
});

export default memo(QuickGuidePopup);
