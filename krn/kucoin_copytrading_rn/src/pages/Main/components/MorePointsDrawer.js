import {useMemoizedFn, useToggle} from 'ahooks';
import React, {memo, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '@krn/ui';

import noticeIc from 'assets/home/point-notice-ic.png';
import noticeDarkIc from 'assets/home/point-notice-ic-dark.png';
import SelectDrawer from 'components/Common/Select/components/SelectDrawer';
import {MainMorePoint} from 'components/Common/SvgIcon';
import {H5Links} from 'constants/h5-link';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {openH5Link} from 'utils/native-router-helper';
import {usePush} from '../../../hooks/usePush';
import QuickGuidePopup from './QuickGuidePopup';
import {HelpIcon, MoreTipText} from './styles';

const PointValueMap = {
  Guidance: 'Guidance',
  Telegram: 'Telegram',
  QuickGuide: 'QuickGuide',
};

const MorePointsDrawer = () => {
  const [activeSelect, {toggle}] = useToggle(false);
  const {push} = usePush();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {type} = useTheme();
  const quickGuidePopupRef = useRef(null);

  const handlePressOption = value => {
    toggle();

    // if (value === PointValueMap.Telegram) {
    //   onClickTrack({
    //     blockId: 'tab',
    //     locationId: 'moreTg',
    //   });
    //   // jsbridge.link Api 在 ios 内嵌 rn容器 ActionSheet场景 会出现ActionSheet打开内嵌页面 打开异常问题 ，
    //   // 此处 确保ActionSheet关闭后 调用 link api
    //   setTimeout(() => {
    //     push(RouterNameMap.JoinTelegram);
    //   }, 300);
    // }
    if (value === PointValueMap.QuickGuide) {
      quickGuidePopupRef.current.open();
    }

    if (value === PointValueMap.Guidance) {
      onClickTrack({
        blockId: 'tab',
        locationId: 'moreHelp',
      });
      // jsbridge.link Api 在 ios 内嵌 rn容器 ActionSheet场景 会出现ActionSheet打开内嵌页面 打开异常问题 ，
      // 此处 确保ActionSheet关闭后 调用 link api
      setTimeout(() => {
        openH5Link(H5Links.mainGuideLink);
      }, 300);
    }
  };

  const options = [
    {
      label: (
        <RowWrap>
          <HelpIcon source={type === 'light' ? noticeIc : noticeDarkIc} />
          <MoreTipText>{_t('e6e1c54559184000a870')}</MoreTipText>
        </RowWrap>
      ),
      value: PointValueMap.Guidance,
    },
    {
      label: (
        <RowWrap>
          <HelpIcon source={type === 'light' ? noticeIc : noticeDarkIc} />

          <MoreTipText>{_t('94af06e3dde24000ab4b')}</MoreTipText>
        </RowWrap>
      ),
      value: PointValueMap.QuickGuide,
    },
  ];

  const openMore = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'tab',
      locationId: 'more',
    });
    toggle();
  });

  return (
    <>
      <TouchableOpacity
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        activeOpacity={0.8}
        onPress={openMore}>
        <MainMorePoint />
      </TouchableOpacity>
      <SelectDrawer
        onClose={toggle}
        list={options || []}
        show={activeSelect}
        selectValue={activeSelect}
        handleClickItem={handlePressOption}
      />
      <QuickGuidePopup ref={quickGuidePopupRef} />
    </>
  );
};

export default memo(MorePointsDrawer);
