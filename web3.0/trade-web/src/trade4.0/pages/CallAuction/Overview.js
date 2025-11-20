/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useState } from 'react';
import { useSelector } from 'dva';
import { styled } from '@/style/emotion';
import Dialog from '@mui/Dialog';
import { eTheme, eScreenStyle, eConditionStyle } from '@/utils/theme';
import { _t } from 'utils/lang';
import PhaseTime from './components/PhaseTime';
import PhaseInfoTitle from './components/PhaseInfoTitle';
import { getCallAuctionFAQLink } from '@/meta/link';
import { valIsEmpty } from 'src/utils/tools';

const OverviewWrapperDiv = styled.div`
  display: flex;
  justify-content: space-between;
  ${eConditionStyle(true, 'vertical')`
    flex-direction: column;
    >div:last-of-type:not(:last-of-type) {
      display: flex;
      margin-top: 16px;
      >div:first-of-type {
        margin-right: 16px;
        margin-bottom: 0px;
        line-height: 28px;
      }
    }
  `}
`;

const TitleDiv = styled.div`
  font-weight: 700;
  font-size: 18px;
  display: inline-block;
  margin-right: 16px;
  ${eConditionStyle(true, 'vertical')`
    margin-right: 0;
  `}
`;

const IntroDiv = styled.div`
  display: inline-block;
  font-weight: 400;
  font-size: 14px;
  text-decoration-line: underline;
  text-underline-offset: 4px;
  color: ${eTheme('text40')};
  ${eConditionStyle(true, 'vertical')`
    display: block;
    margin-top: 4px;
    margin-bottom: 6px;
  `}
  ${eScreenStyle('lg')`
    margin-top: 8px;
  `}
  ${eScreenStyle('sm')`
    margin-bottom: 1px;
  `}
`;

const PhaseDiv = styled.div`
  flex-shrink: 0;
`;

const ALink = styled.a`
  color: ${eTheme('textPrimary')};
  font-size: 14px;
  weight: 500;
`;

const DiaLogTip = styled.div`
  color: ${eTheme('text60')};
  font-size: 14px;
  weight: 500;
`;

const LinkDiv = styled.div`
  margin-top: 16px;
`;

const PhaseInfoTitleMd = styled(PhaseInfoTitle)`
  vertical-align: 2px;
  margin-top: 15px;
  ${eScreenStyle(['md', 'lg'])`
    display: inline-block;
    margin-right: 24px;
    margin-right: 16px;
  `}
  ${eConditionStyle(val => valIsEmpty(val), 'title')`
    margin-right: 0;
  `}
  ${eScreenStyle('sm')`
    margin-right: 0;
    font-size: 14px;
  `}
`;

/**
 * 集合竞价介绍
 * @param {{
 *  currentSymbol: string,
 *  activeTitle: string,
 *  screen: string,
 *  vertical: boolean,
 * }} props
 */
const Overview = (props) => {
  const { currentSymbol, countDownInfo, activeTitle, screen, vertical } = props;
  const currentLang = useSelector(state => state.app?.currentLang);
  const showSymbol = String(currentSymbol).replace('-', '/');
  const [open, setOpen] = useState(false);
  const title = countDownInfo.isActive ? activeTitle : ''; // Phase 1 in progress
  return (
    <OverviewWrapperDiv vertical={vertical}>
      <div>
        <TitleDiv vertical={vertical} >
          {_t('trd.ca.title', { symbol: showSymbol })}
        </TitleDiv>
        <IntroDiv
          vertical={vertical} className="pointer"
          onClick={() => setOpen(true)}
          screen={screen}
        >
          {_t('trd.ca.qa')}
        </IntroDiv>
        <Dialog
          title={_t('trd.ca.name')}
          destroyOnClose
          size="basic"
          open={open}
          maskClosable
          okText={_t('confirm')}
          cancelText={null}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <div>
            <DiaLogTip>{_t('trd.ca.intro')}</DiaLogTip>
            <LinkDiv>
              <ALink href={getCallAuctionFAQLink(currentLang)} target="_blank" rel="noopener noreferrer">{_t('trd.ca.detail.show')}</ALink>
            </LinkDiv>
          </div>
        </Dialog>
      </div>
      {
        vertical && <PhaseDiv>
          <PhaseInfoTitleMd title={title} isActive screen={screen} />
          <PhaseTime style={{ margin: 0 }} countDownInfo={countDownInfo} />
        </PhaseDiv>
      }
    </OverviewWrapperDiv>
  );
};

export default memo(Overview);
