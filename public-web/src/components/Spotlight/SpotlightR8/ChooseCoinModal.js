/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-02-21 10:42:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-02-24 19:42:38
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/ChooseCoinModal.js
 * @Description: 请选择认购币种
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICWarningOutlined, DownOutlined } from '@kux/icons';
import { Button, numberFormat, Radio, styled, useResponsive } from '@kux/mui';
import { divide } from 'helper';
import isNil from 'lodash/isNil';
import { Fragment, useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { ReactComponent as DiscountDownIcon } from 'static/spotlight8/discountDownDark.svg';
import { _t, _tHTML } from 'tools/i18n';
import Modal from 'TradeActivity/ActivityCommon/Modal';
import { trackClick } from 'utils/ga';

import k0Icon from 'static/spotlight8/k0.svg';
import k1Icon from 'static/spotlight8/k1.svg';
import k2Icon from 'static/spotlight8/k2.svg';
import k3Icon from 'static/spotlight8/k3.svg';
import k4Icon from 'static/spotlight8/k4.svg';

const kcsLevelIcons =[k0Icon, k1Icon, k2Icon, k3Icon, k4Icon]

const StyledModal = styled(Modal)`
  .KuxDialog-content {
    padding: 0;
  }

  .radio-group {
    position: relative;
    z-index: 2;
    // padding-top: 28px;
  }
`;

const DiscountTip = styled.div`
  margin-bottom: -22px;
  width: 100%;
  border-radius: 12px 12px 0px 0px;
  background: #d3f475;
  padding: 8px 8px 28px;
  color: #1d1d1d;
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;

  .discount-down-icon {
    width: 12px;
    min-width: 12px;
    height: 12px;
    margin-left: 2px;
  }
`;

const CoinOption = styled(Radio)`
  width: 100%;
  height: 80px;
  flex-direction: row-reverse;
  justify-content: space-between;
  z-index: 2;

  .coin-info {
    display: flex;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    &.is-recommended {
      .coin-price {
        color: ${(props) => props.theme.colors.primary};
      }
    }

    .coin-price {
      font-size: 13px;
      font-weight: 400;
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text40};
    }

    .kcs-level {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }

    .coin-name {
      display: flex;
      flex-direction: column;
      .coin-name-text {
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.colors.text};
        font-weight: 500;
        font-size: 16px;
        font-style: normal;
        line-height: 130%; /* 20.8px */
      }
      .recommend-tag {
        display: inline-flex;
        margin-left: 4px;
        align-self: flex-start;
        padding: 2px 4px;
        color: ${(props) => props.theme.colors.primary};
        font-weight: 500;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        background: ${(props) => props.theme.colors.primary8};
        border-radius: 4px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 64px;
    margin: 0;
    padding: 16px 0;

    .coin-info .coin-name {
      gap: 2px;
      .coin-name-text {
        font-size: 14px;
      }
    }
  }
`;

const Notice = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.complementary8};
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }

  .icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
    color: ${(props) => props.theme.colors.complementary};
  }
`;

const ContentWrapper = styled.div`
  padding: 0 32px 32px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0 0;
  }

  .coin-option {
    padding: 0 23px;
    border-radius: 12px;
    border: 1px solid ${(props) => props.theme.colors.divider8};
    margin: 0 0 16px 0;
    background: ${(props) => props.theme.colors.layer};
  }
  .kcs-level-price-detail {
    display: none;
  }
  .coin-option .arrow-icon {
    color: ${(props) => props.theme.colors.icon};
    margin: 0 4px;
    transition: all 0.3s ease-in-out;
  }
  .coin-option.expanded {
    .arrow-icon {
      transform: rotate(180deg);
    }
    .kcs-level-price-detail {
      display: flex;
    }
  }
`;
const ButtonWrapper = styled.div`
  padding: 20px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  border-top: 1px solid ${(props) => props.theme.colors.cover8};

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 0 16px;
    border-top: none;
    button {
      flex: 1;
    }
  }
`;

const ChooseCoinModal = ({ visible, onClose, onConfirm }) => {
  const chooseCoinModal = visible;
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const [selectedCoin, setSelectedCoin] = useState(); // 默认选中KCS

  const { currencyList, kcsLevel, kcsPrices } = useSelector(
    (state) => {
      const detail = state.spotlight8.detailInfo;
      return {
        currencyList: detail.currencyList,
        kcsLevel: detail.kcsLevel,
        kcsPrices: detail.kcsPrices,
      }
    },
    shallowEqual,
  );

  const onToggleKcsLevelDetail = (e) => {
    const target = e.currentTarget;
    if (!target || target.getAttribute('data-currency') !== 'KCS') return;
    const coinOption = target.closest('.coin-option');
    if (!coinOption) return;
    // 阻止选中radio的行为
    e.preventDefault();
    coinOption.classList.toggle('expanded');
  }


  useEffect(() => {
    if (currencyList.length && !selectedCoin) {
      setSelectedCoin(currencyList[0].currency);
    }
  }, [currencyList, selectedCoin]);

  return (
    <>
      <StyledModal
        restrictHeight
        fixedFooter
        destroyOnClose
        open={chooseCoinModal}
        onClose={onClose}
        title={_t('dd1b6dd9ef224000ab79')}
      >
        <ContentWrapper>
          <Radio.Group
            size={sm ? 'middle' : 'small'}
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="radio-group"
          >
            {currencyList.map((coin) => {
              // KCS 特殊处理
              const isKcs = coin.currency === 'KCS';
              return (
                <Fragment key={coin.currency}>
                  {coin.hasDiscount && (
                    <DiscountTip>
                      {_tHTML('b34137f137a54000a128', {
                        currency: coin.currency,
                        discount: isNil(coin.discountRate)
                          ? '--'
                          : numberFormat({
                              number: divide(coin.discountRate, 100),
                              lang: currentLang,
                              options: {
                                style: 'percent',
                              },
                            }),
                      })}
                      <DiscountDownIcon className="discount-down-icon" />
                    </DiscountTip>
                  )}
                  <div className='coin-option'>
                    <CoinOption value={coin.currency}>
                      <div className={"coin-info " + (coin.hasDiscount ? 'is-recommended' : '')}>
                        <img src={coin.iconUrl} alt={coin.currency} />
                        <div className="coin-name">
                          <div className="coin-name-text">
                            <span>{_t('bca5f23bbf2d4000a16e', { currencyName: coin.currency })}</span>
                            {coin.hasDiscount && (
                              <div className="recommend-tag">{_t('8ec8df36607a4000a8f4')}</div>
                            )}
                          </div>
                          <div className='coin-price' onClick={onToggleKcsLevelDetail} data-currency={coin.currency}>
                            {isKcs && <img src={kcsLevelIcons[kcsLevel]} className='kcs-level' alt="kcs level icon" />}
                            {_t('24d406c6fcf14000a64c', {
                              num: numberFormat({
                                level: '',
                                number: coin.tokenPrice,
                                lang: currentLang,
                              }),
                            })}
                            {isKcs && <DownOutlined className="arrow-icon" />}
                          </div>
                        </div>
                      </div>
                    </CoinOption>
                  {isKcs && (
                    <KcsLevelPriceProgress level={kcsLevel} currentLang={currentLang} prices={kcsPrices} />
                  )}
                  </div>
                </Fragment>
              );
            })}
          </Radio.Group>

          <Notice>
            <ICWarningOutlined className="icon" />
            <div className="notice-text">{_tHTML('726e347296c94000ad22')}</div>
          </Notice>
        </ContentWrapper>

        <ButtonWrapper>
          {sm && (
            <Button variant="text" onClick={onClose}>
              {_t('cancel')}
            </Button>
          )}

          <Button
            variant="contained"
            onClick={() => {
              trackClick(['Subscribe', 'ChooseCoin'], { currency: selectedCoin });
              onConfirm(selectedCoin);
            }}
            disabled={!selectedCoin}
          >
            {_t('caHePZWPZqASREnyQquAcH')}
          </Button>
        </ButtonWrapper>
      </StyledModal>
    </>
  );
};

const KcsLevelPriceProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid ${(props) => props.theme.colors.divider4};
  width: 100%;
  position: relative;

  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 8px 0;
  }
  .price {
    font-weight: 400;
    font-size: 14px;
    color: ${(props) => props.theme.colors.text40};
  }
  .level {
    width: 24px;
    height: 24px;
  }

  .active .price {
    color: ${(props) => props.theme.colors.text};
  }
  .active ~ .item .level {
    opacity: 0.4;
  }

  .progress {
    width: 100%;
    background: ${(props) => props.theme.colors.cover4};
    border-radius: 29px;
    position: absolute;
    left: 10px;
    width: 4px;
    top: 16px;
    bottom: 16px;
  }
  .progress-inner {
    position: absolute;
    left: 0;
    height: 100%;
    background: ${(props) => props.theme.colors.primary};
    border-radius: 29px;
    height: var(--progress, 0);
    width: 100%;
  }
`


/**
 * kcs 价格分级
 * * level 0~4
 * * prices 长度为5 的价格数组, 与级别对应
 */
function KcsLevelPriceProgress({level, currentLang, prices}) {
  if (!prices || !prices.length) return null;
  const progress = (level + 1) === prices.length ? '100%' : `${(level * 2 + 1) / (prices.length * 2) * 100}%`;
  return (
    <KcsLevelPriceProgressWrapper className='kcs-level-price-detail'>
      <div className="progress">
        <div className="progress-inner" style={{'--progress': progress}} />
      </div>
      {prices.map((priceItem, index) => (
        <div className={'item ' + (level === index ? 'active' : '')} key={index}>
          <img className='level' src={kcsLevelIcons[index]} alt={`kcs level ${index} icon`} />
          <div className='price'>{numberFormat({
            number: priceItem.discountTokenPrice,
            lang: currentLang,
          })}</div>
        </div>
      ))}
    </KcsLevelPriceProgressWrapper>
  )
}

export default ChooseCoinModal;
