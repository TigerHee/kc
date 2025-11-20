/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/NewCustomerTask/Task/LimitTaskArea/components/FuturesTrailFundTask/EarnCard.js
 */
import { styled } from '@kux/mui/emotion';
import { memo, useEffect, useMemo } from 'react';
import useHtmlToReact from 'src/hooks/useHtmlToReact';
import { _t, _tHTML } from 'src/tools/i18n';
import useEarnDetailInfo from '../../hooks/useEarnDetailInfo';
import useEarnTask from '../../hooks/useEarnTask';
import { useFormat } from '../../hooks/useFormat';
import { add, divide } from '../../tools/helper';
const Wrapper = styled.section`
  position: relative;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.primary20};
  background: ${(props) => props.theme.colors.overlay};
  z-index: 0;
  line-height: 1.3;
  font-weight: 400;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.showShadow &&
    `
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 94px;
      z-index: -1;
      left: 0;
      top: 0;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      background: linear-gradient(180deg, rgba(1, 188, 141, 0.20) 0%, rgba(1, 188, 141, 0.00) 100%);
      opacity: .4;
    }
  `}
  &:not(:first-of-type) {
    margin-left: 12px;
  }
`;

const Holder = styled.div`
  height: 0;
  flex: 1;
`;

const Title = styled.h5`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  flex-wrap: wrap;
  margin-bottom: 0;
  .desc {
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 12px;
  }
`;

const Desc = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
`;

const DescItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-right: 0;
  margin-top: 18px;
  flex: ${(props) => (props.subscrpiton ? 'initial' : 1)};
  text-align: ${(props) => (props.subscrpiton ? 'right' : 'left')};
  max-width: ${(props) => (props.subscrpiton ? '90px' : 'initial')};
`;

const DescTitle = styled.span`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  margin-bottom: ${(props) => (props.subscrpiton ? '6px' : '4px')};
  word-break: break-word;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  flex-wrap: nowrap;
  .precent {
    font-weight: 600;
    font-size: 20px;
  }
  .tag {
    position: relative;
    margin-left: 7px;
    padding: 4px 8px;
    font-size: 10px;
    background: ${(props) => props.theme.colors.primary8};
    border-radius: 4px;
    .arrow {
      position: absolute;
      top: 50%;
      left: -3px;
      width: 0;
      height: 0;
      border-top: 2px solid ${(props) => props.theme.colors.primary8};
      border-right: 2px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 4px solid ${(props) => props.theme.colors.primary8};
      border-top-left-radius: 2px;
      transform: translateY(-50%) rotate(-45deg);
      content: ' ';
      [dir='rtl'] & {
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
`;

const SubDetail = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

const Operation = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .desc {
    flex: 1;
    > span {
      display: inline-block;
      max-width: ${(props) => (props.isActivityEnd ? '100%' : '144px')};
      color: ${(props) => props.theme.colors.text40};
      font-size: 12px;
      text-align: left;
    }
  }
  .leftContent {
    margin-top: 18px;
    br {
      display: none;
    }
  }

  &::after {
    display: block;
    clear: both;
    height: 0;
    content: '';
  }
  &:only-child::after,
  &:nth-last-child(2):first-child::after {
    display: none;
  }
`;

const BuyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  .item {
    flex: 1;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 12px;
    line-height: 1.3;
  }
  .dark {
    margin-top: 4px;
    color: ${(props) => props.theme.colors.text40};
  }
`;

const BuyInfo = ({ earnInfo, className = '', nFormatterK, showTotal }) => {
  const { currentBoughtAmount, maxBoughtAmount } = earnInfo || {};
  return (
    <BuyWrapper className={className}>
      <InfoWrapper>
        <span className="item">
          {_t('6XjkKLxbn47BF7PV97Kqag', {
            amount: nFormatterK(currentBoughtAmount || 0, 2),
            currency: window._BASE_CURRENCY_,
          })}
        </span>
        {showTotal && (
          <span className="item dark">
            {`${_t('fLXXHtmmwzgFvZXQYr2jgY')} ${nFormatterK(maxBoughtAmount || 0, 2)} ${
              window._BASE_CURRENCY_
            }`}
          </span>
        )}
      </InfoWrapper>
    </BuyWrapper>
  );
};

export default memo(
  ({ typeKey, title, showShadow, subscrpiton = true, isLast, options, onUpdateApr }) => {
    const { earnInfo, isBuyed, isActivityEnd } = useEarnTask(typeKey);
    const { formatNum, nFormatterK } = useFormat();

    const financialProductId = earnInfo?.financialProductId;
    const earnDetailInfo = useEarnDetailInfo(financialProductId);

    /* 新手专享任务 tags 包含 newbee 才是新手专享任务 tags?.includes('NEWBIE') */
    const { duration, apr, user_lower_limit, user_upper_limit } = earnDetailInfo || {};

    const totalApr = useMemo(() => {
      // 仅使用固定收益, 不再追加 自定义的apr
      // const { myApr } = options || {};
      // return add(myApr || 0, apr || 0).toFixed();
      return add(0, apr || 0).toFixed();
    }, [apr]);

    useEffect(() => {
      if (totalApr && onUpdateApr) onUpdateApr(totalApr);
    }, [totalApr, onUpdateApr]);
    const { eles: subtitleReact } = useHtmlToReact({
      html: options?.financialBenefitSubTitle || '',
    });
    if (!earnDetailInfo) return null;
    // 后台未配置 financialBenefitSubTitle 时，直接隐藏相关元素
    const aprDetail = subtitleReact;
    // ||
    //   _t('3CX4sxQ4NWvUEuGx3tDftm', {
    //     fixed: formatNum(apr),
    //     myApr: options?.myApr || 0,
    //   });
    return (
      <Wrapper showShadow={showShadow} isLast={isLast} className="earnCard">
        <Title>
          {title}
          <span className="desc">
            {_t('77B7MWfWSmTiyeY4LXUrDV', {
              days: formatNum(duration || 0),
            })}
          </span>
        </Title>
        <Desc>
          <DescItem>
            <DescTitle>
              {_t('4dmcz1DXPU8W83HzZu3pEB', {
                days: formatNum(duration || 0),
              })}
            </DescTitle>
            <Detail>
              <span className="precent">
                {formatNum(divide(totalApr, 100), {
                  style: 'percent',
                  _ignoreFractionDigits: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {aprDetail && (
                <span className="tag">
                  {aprDetail}
                  <span className="arrow" />
                </span>
              )}
            </Detail>
          </DescItem>
          {subscrpiton && (
            <DescItem subscrpiton>
              <DescTitle subscrpiton>{_t('64x3gkMmxDxnxwkR3kjace')}</DescTitle>
              <SubDetail>
                {formatNum(user_lower_limit || 0)} {window._BASE_CURRENCY_}
              </SubDetail>
            </DescItem>
          )}
        </Desc>
        <Holder />
        <Operation isActivityEnd={isActivityEnd}>
          {isBuyed ? (
            <BuyInfo
              showTotal={false}
              earnInfo={earnInfo}
              className="leftContent"
              nFormatterK={nFormatterK}
            />
          ) : (
            <div className="desc leftContent">
              {_tHTML('aZgprFYtPiMgT4M4ioj4R9', {
                num1: formatNum(user_lower_limit || 0),
                num2: nFormatterK(user_upper_limit || 0),
                amount: nFormatterK(user_upper_limit || 0),
                currency: window._BASE_CURRENCY_,
              })}
            </div>
          )}
        </Operation>
      </Wrapper>
    );
  },
);
