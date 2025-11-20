/**
 * Owner: will.wang@kupotech.com
 */
import { separateNumber } from 'helper';
import { useDispatch, shallowEqual } from 'react-redux';
import SlideDownButton from './SlideDownButton';
import { useSelector } from 'src/hooks/useSelector';
import { isEqual } from 'lodash';
import keysEquality from 'tools/keysEquality';
import {
  HeaderContainer,
  MainTitle,
  Desc,
  DigitalContentList,
  DigitalContentItem,
  DigitalContentItemDigit,
  DigitalContentItemDesc,
  DigitalDivider,
} from './Header.style';
import { useResponsive, useTheme } from '@kux/mui';
import { _t, _tHTML } from '@/tools/i18n';
import { useMemo } from 'react';
import { useMount } from 'ahooks';
import AnimateNumber from '@/components/common/AnimateNumber';

const formatValue = (value) => separateNumber(value.toFixed(0));

export const Header = () => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  const rs = useResponsive();

  const isSm = !rs.sm;

  const configItems = useSelector((state) => state.newhomepage.configItems, isEqual);
  const { summary } = useSelector((state) => state.newhomepage, keysEquality(['summary']));
  const { rates = {} } = useSelector((state) => state.currency, shallowEqual);
  const dispatch = useDispatch();
  const duration = 1000;

  const volumes = useMemo(() => {
    if (summary.TRADING_VOLUME && rates['USD']) {
      return summary.TRADING_VOLUME * (+rates['USD']);
    }

    return 0;
  }, [summary.TRADING_VOLUME, rates]);

  useMount(() => {
    dispatch({ type: 'newhomepage/pullNewStatistics@polling' });
  });

  // 全球用户数（泰国站展示不变）
  const globalUser = useMemo(() => {
    return configItems?.webHomepageData?.backupValues?.GlobalInvestors;
  }, [configItems]);

  // 上架币种（泰国站展示不变）
  const tokens = useMemo(() => {
    return configItems?.webHomepageData?.backupValues?.Coins;
  }, [configItems?.webHomepageData?.backupValues?.Coins]);

  return (
    <HeaderContainer data-inspector="about_us_banner">
      <MainTitle isDark={isDark}>
        {_tHTML('7524379504f44000ac34')}
      </MainTitle>

      <Desc>
        {_t('aboutus.title.intro')}
      </Desc>

      <DigitalContentList data-inspector="about_us_num">
        <DigitalContentItem smWidth={180}>
          <DigitalContentItemDigit>{_t('aboutus.top1.title')}</DigitalContentItemDigit>
          <DigitalContentItemDesc>{_t('aboutus.top1.value')}</DigitalContentItemDesc>
        </DigitalContentItem>

        {
          !isSm && (
            <DigitalDivider />
          )
        }

        <DigitalContentItem>
          <DigitalContentItemDigit>{globalUser}</DigitalContentItemDigit>
          <DigitalContentItemDesc>{_t('aboutus.users.title')}</DigitalContentItemDesc>
        </DigitalContentItem>

        {
          !isSm && (
            <DigitalDivider />
          )
        }

        <DigitalContentItem smWidth={180}>
          <DigitalContentItemDigit>
            <AnimateNumber
              index={0}
              value={volumes}
              formatValue={formatValue}
              duration={duration}
            />
          </DigitalContentItemDigit>
          <DigitalContentItemDesc>{_t('dgEEQ2MXhbzGF2EAFt2S72')}</DigitalContentItemDesc>
        </DigitalContentItem>

        {
          !isSm && (
            <DigitalDivider />
          )
        }

        <DigitalContentItem>
          <DigitalContentItemDigit>{tokens}</DigitalContentItemDigit>
          <DigitalContentItemDesc>{_t('vRX1D8bfQi4U5CxPCEdzG3')}</DigitalContentItemDesc>
        </DigitalContentItem>
      </DigitalContentList>

      <SlideDownButton isDark={isDark} isSm={isSm} />
    </HeaderContainer>
  );
};
