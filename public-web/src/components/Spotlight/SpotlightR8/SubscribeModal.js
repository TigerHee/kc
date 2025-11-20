/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-02-21 10:42:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-02-24 21:02:55
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/StakingModal.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Divider, Form, styled } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import JsBridge from '@knb/native-bridge';
import Decimal from 'decimal.js';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import InputNumber from 'TradeActivity/ActivityCommon/InputNumber';
import { divide } from 'helper';
import { trackClick } from 'utils/ga';
import numberFixed from 'utils/numberFixed';
import siteCfg from 'src/utils/siteConfig';
import { ReactComponent as ArrowRightIcon } from 'static/spotlight8/arrowRight.svg';
import { ReactComponent as DiscountDownIcon } from 'static/spotlight8/discountDown.svg';
import Modal from 'TradeActivity/ActivityCommon/Modal';
import { greeterThan, lessThan } from 'TradeActivity/utils';
import AssetsComp from './components/AssetsComp';
import { addLangToPath } from 'src/tools/i18n';
import { add, sub } from 'src/helper';
import { pull } from 'src/tools/request';

const { KUCOIN_HOST } = siteCfg;

const CotentWrapper = styled.div`
  padding: 16px 0 32px;
  ::after {
    position: absolute;
    bottom: 100px;
    left: 0;
    display: block;
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.colors.cover8};
    content: '';
  }
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
    }
  }

  .KuxDivider-horizontal {
    margin: 24px 0;
  }

  .discount-wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
    align-self: stretch;
    justify-content: space-between;
    margin-top: 24px;
    padding: 12px 16px;
    background: ${(props) => props.theme.colors.primary4};
    border: 1px solid ${(props) => props.theme.colors.primary12};
    border-radius: 12px;
    cursor: pointer;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 20px;
    }
  }
  .discount-text {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%; /* 18.2px */

    span span {
      color: ${(props) => props.theme.colors.primary};
    }

    svg {
      width: 16px;
      min-width: 16px;
      height: 16px;
    }
  }
  .arrow-right {
    width: 16px;
    min-width: 16px;
    height: 16px;
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0px;
    ::after {
      display: none;
    }
  }

  &.is-kcs {
    .max-invest-label {
      font-size: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
      margin-bottom: 20px;
    }
  }

  .form-item-title {
    font-weight: 500;
    font-size: 18px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 16px;
  }

  .kcs-earn-account {
    padding-bottom: 20px;
    border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
    margin-bottom: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
    margin-bottom: 12px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
    object-fit: cover;
    border-radius: 24px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }
`;
const AssetsWrapper = styled.div`
  margin-top: 16px;
`;

const UserAssetsWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 130%;
  .value {
    margin-left: 16px;
    color: ${(props) => props.theme.colors.text};
  }
  .label {
    color: ${(props) => props.theme.colors.text40};
  }
`;
const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  > button {
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
`;
const ButtonWrapper = styled.div`
  padding: 24px 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 20px 0 32px;
  }
`;

const LabelTip = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.text60};
  margin-top: 16px;
  .highlight {
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`

const { FormItem, useForm } = Form;
const emptyObj = {};

const SubscribeModal = ({
  visible,
  onConfirm,
  onClose,
  selectedCoin,
  setSelectedCoin,
  isFirstSubscribe,
}) => {

  const stakeModal = visible;
  const { currentLang } = useLocale();
  const [form] = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    // 打开申购弹框时更新用户申购信息
    if (stakeModal) {
      dispatch({
        type: 'spotlight8/getUserSubcribeInfo',
      });
    }
  }, [stakeModal, dispatch]);
  const [validStatus, setValidStatus] = useState(false);

  const tradeMap = useSelector((state) => state.user_assets.tradeMap, shallowEqual);
  const loading = useSelector((state) => state.loading.effects['spotlight8/subcribe']);
  const currencyList = useSelector(
    (state) => state.spotlight8.detailInfo?.currencyList,
    shallowEqual,
  );
  const { currencyConfig, userRemainingInvestAmount } = useSelector(
    (state) => state.spotlight8.userSubcribeInfo,
    shallowEqual,
  );

  const {
    minInvestmentAmount,
    precision: tokenScale,
    iconUrl,
  } = useMemo(() => {
    const sortItem = find(currencyList, (item) => item.currency === selectedCoin);
    return sortItem || emptyObj;
  }, [currencyList, selectedCoin]);

  const { discountRate: kcsDiscountRate, hasDiscount: kcsHasDiscount  } = useMemo(() => {
    if (selectedCoin !== 'KCS' && currencyList?.length) {
      const sortItem = find(currencyList, (item) => item.currency === 'KCS');
      return sortItem || emptyObj;
    }
    return emptyObj;
  }, [currencyList, selectedCoin]);

  const availableBalance = useMemo(() => {
    const { availableBalance: _availableBalance } = tradeMap?.[selectedCoin] || {};
    return _availableBalance ? numberFixed(_availableBalance, tokenScale || 0) : undefined;
  }, [tradeMap, selectedCoin, tokenScale]);

  // 计算当前用户最大可质押
  const maxUserInvestmentQuantity = useMemo(() => {
    let _num;
    if (!isNil(userRemainingInvestAmount)) {
      _num = userRemainingInvestAmount;
    } else if (currencyConfig?.length) {
      const { maxInvestmentQuantity: maxUserInvestmentQuantity } =
        find(currencyConfig, (item) => item.currency === selectedCoin) || {};
      _num = maxUserInvestmentQuantity;
    }

    return _num ? numberFixed(_num, tokenScale || 0) : undefined;
  }, [currencyConfig, userRemainingInvestAmount, selectedCoin, tokenScale]);

  const persicion = useMemo(() => {
    return isNil(tokenScale) ? '0' : numberFixed(1 / Math.pow(10, tokenScale));
  }, [tokenScale]);

  const handleConfirm = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        // 去除小数尾部0
        const subAmount = new Decimal(values?.subAmount || '0').toFixed();
        const stakingAmount = new Decimal(values?.stakingAmount || '0').toFixed();
        trackClick(['Subscribe', 'SubscribeCoin'], { currency: selectedCoin });
        const formData = {
          subAmount,
          subToken: selectedCoin,
        }
        // 仅KCS 申购时, 才传入 stakingAmount, 避免其他币种申购时后端出错, 给 0 亦会导致后端问题
        if (selectedCoin === 'KCS') {
          formData.stakingAmount = stakingAmount;
        }
        onConfirm(formData);
      })
      .catch((err) => {
        console.log('validate error:', err);
      });
  }, [selectedCoin, onConfirm, form]);

  // 精度验证
  const validatorPersicion = useCallback(
    (value) => {
      if (!value || !+value) return false;
      if (value?.indexOf('.') > -1) {
        const [_, decimalNum] = value.split('.');
        return decimalNum?.length > tokenScale;
      }

      return false;
    },
    [tokenScale],
  );

  const isKcs = selectedCoin === 'KCS';

  const handleFill = useCallback(() => {
    // 减去
    const rest = sub(maxUserInvestmentQuantity || 0, (Number(form.getFieldValue('stakingAmount')) || 0));
    // 取不到值可能导致 NaN, 此处 fallback 为 0
    const val = Math.min(Math.max(0, rest), availableBalance) || 0;
    // 非 kcs 申购时, max 可以设置为 0; kcs 申购时 0 则被清空, 保证两个输入框联动正常
    // 校验相关均默认值为字符串, 此处将值设置为字符串, 保证行为符合预期
    form.setFieldsValue({ subAmount: (!isKcs || val) ? String(val) : '' });
    form.validateFields();
  }, [form, availableBalance, maxUserInvestmentQuantity, isKcs]);

  const handleDiscount = useCallback(() => {
    setSelectedCoin('KCS');
    trackClick(['Subscribe', 'UpdateKCS']);
  }, [setSelectedCoin]);

  // 个人申购硬顶
  const maxInvestLabel = (
    <UserAssetsWrapper className='max-invest-label'>
      {/* 使用kcs 申购时展示: 最大可投; 其他展示个人申购硬顶 */}
      <span className="label">{_t(isKcs ? '1020bf2d123f4800ad7a' : 'efbb5a22e2204000a9ed')}</span>
      <span className="value">
        {isNil(maxUserInvestmentQuantity)
          ? `--  ${selectedCoin || ''}`
          : `${numberFormat({
              number: maxUserInvestmentQuantity,
              lang: currentLang,
            })} ${selectedCoin || ''}`}
      </span>
    </UserAssetsWrapper>
  )

  const onFormValuesChange = () => {
    if (isKcs) {
      // 表单变化时, 触发两个输入框同步校验, 避免其中一个校验通过, 另一个不通过的状态
      form.validateFields();
    }
  }

  return (
    <>
      <Modal
        restrictHeight
        fixedFooter
        open={stakeModal}
        onClose={onClose}
        destroyOnClose
        title={
          <TitleWrapper>
            <img src={iconUrl} alt={selectedCoin} />
            <span>{_t('bca5f23bbf2d4000a16e', { currencyName: selectedCoin })}</span>
          </TitleWrapper>
        }
      >
        <CotentWrapper className={isKcs ? 'is-kcs' : ''}>
          {isKcs && maxInvestLabel}
          <Form form={form} onValuesChange={onFormValuesChange}>
            {isKcs &&
            (
              <>
            <KcsEarnAccount
              form={form}
              validatorPersicion={validatorPersicion}
              persicion={persicion}
              currentLang={currentLang}
              maxUserInvestmentQuantity={maxUserInvestmentQuantity}
              setValidStatus={setValidStatus}
              minInvestmentAmount={minInvestmentAmount}
            />
            {/* 币币账户, 下方 form-item 的标题 */}
              <div className='form-item-title'>
                {_t('1b00ec1e96dc4800a42e')}
              </div>
              </>)
          }
            <FormItem
              name="subAmount"
              label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
              validateTrigger={['onInput']}
              rules={[
                {
                  validator: (rule, _, callback) => {
                    const value = form.getFieldValue('subAmount');
                    const stakingAmount = form.getFieldValue('stakingAmount');
                    const totalAmount = add(value || '0', stakingAmount || '0');

                    if (!value) {
                      // KCS 申购时, 不填写, 则不校验
                      if (isKcs) {
                        // 可能出现两个输入框都不填写的情况, 此时将 validStatus 设置为 false
                        if (lessThan(totalAmount, minInvestmentAmount || '0')) {
                          setValidStatus(false);
                        }
                        callback();
                        return;
                      } else {
                        // 不能为空
                        callback(_t('form.required'));
                      }
                    } else if (greeterThan(value, availableBalance || '0')) {
                      // 不能大于资产
                      callback(_t('7f8992468eef4000a5f7'));
                    } else if (lessThan(value, minInvestmentAmount || '0')) {
                      // 小于最小申购额度
                      callback(_t('97343c3d8ca44000a74e', {
                          num: isNil(minInvestmentAmount)
                            ? '--'
                            : numberFormat({
                                number: minInvestmentAmount,
                                lang: currentLang,
                              }),
                          currency: selectedCoin,
                        }),
                      );
                    } else if (validatorPersicion(value)) {
                      // 精度验证
                      callback(
                        _t('p7Zh4Pev4fwuQt8fCrbKer', {
                          priceIncrement: numberFormat({
                            number: persicion,
                            lang: currentLang,
                          }),
                        }),
                      );
                    } else if (greeterThan(totalAmount, maxUserInvestmentQuantity || '0')) {
                      // 使用kcs 申购时提示: 超过最大可投; 其他提示: 超过个人硬顶
                      callback(
                        isKcs
                        ? _t('0833b01bea304000a74f')
                        : _t('7514637f037d4000abb5', {
                          num: isNil(maxUserInvestmentQuantity)
                            ? '--'
                            : numberFormat({
                                number: maxUserInvestmentQuantity,
                                lang: currentLang,
                              }),
                          currency: selectedCoin,
                        }),
                      );
                    } else {
                      setValidStatus(true);
                      callback();
                      return;
                    }
                    setValidStatus(false);
                  },
                },
              ]}
            >
              <InputNumber
                label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                suffix={
                  <OperatorWrapper>
                    <Button type="brandGreen" variant="text" onClick={handleFill}>
                      {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
                    </Button>
                    <Divider type="vertical" />
                    <span>{selectedCoin}</span>
                  </OperatorWrapper>
                }
                controls={false}
                size="xlarge"
              />
            </FormItem>
          </Form>
          <AssetsWrapper>
            <AssetsComp stakingToken={selectedCoin} tokenScale={tokenScale} />
          </AssetsWrapper>
          { isKcs || maxInvestLabel}
          {/* 当您同时使用币币账户和金融账户投入认购时，认购结束将默认优先使用币币账户资金 */}
          {isKcs && (<LabelTip>{_t('6213b1bd25e94000a243')}</LabelTip>)}
          {isFirstSubscribe && selectedCoin !== 'KCS' && kcsHasDiscount && (
            <div className="discount-wrapper" onClick={handleDiscount}>
              <div className="discount-text">
                {/* 提示用户选择 KCS 有额外折扣 */}
                {_tHTML('b34137f137a54000a128', {
                  currency: 'KCS',
                  discount: numberFormat({
                    number: divide(kcsDiscountRate, 100),
                    lang: currentLang,
                    options: {
                      style: 'percent',
                    },
                  }),
                })}
                <DiscountDownIcon className="ml-4" />
              </div>
              <ArrowRightIcon className="arrow-right" />
            </div>
          )}
        </CotentWrapper>
        <ButtonWrapper>
          <Button
            fullWidth
            disabled={!validStatus}
            size="large"
            onClick={handleConfirm}
            loading={loading}
          >
            {_t('etf.action.subscribe')}
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  );
};

/**
 * KCS 账户
 */
function KcsEarnAccount({form, currentLang, maxUserInvestmentQuantity,
  validatorPersicion, persicion,
    setValidStatus,  minInvestmentAmount }) {
  const selectedCoin = 'KCS';
  const [availableBalance, setAvailableBalance] = useState(null);
  useEffect(() => {
    getEarnBalance().then(setAvailableBalance);
  }, [])

  const handleFill = () => {
    const rest = sub(maxUserInvestmentQuantity || 0, (Number(form.getFieldValue('subAmount')) || 0));
    // 取不到值可能导致 NaN, 此处 fallback 为 0
    const val = Math.min(Math.max(0, rest), availableBalance) || 0;
    // 校验相关均默认值为字符串, 此处将值设置为字符串, 保证行为符合预期
    form.setFieldsValue({ stakingAmount: val ? String(val) : '' });
    form.validateFields();
  }

  // 打开kcs staking 权益页面
  const onViewStakingRights = (e) => {
    if (!e.target?.classList?.contains('highlight')) return;
    if (JsBridge.isApp()) {
      const url = KUCOIN_HOST + addLangToPath('/kcs?loading=2');
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${encodeURIComponent(url)}`,
        },
      });
    } else {
      window.open(KUCOIN_HOST + addLangToPath('/kcs'));
    }
  }

  return (
    <div className='kcs-earn-account'>
    {/* 金融账户 */}
    <div className='form-item-title'>
      {_t('6c026313c1984800ad85')}
    </div>
    <FormItem
    name='stakingAmount'
    // 数量
    label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
    validateTrigger={['onInput']}
    rules={[
      {
        validator: (rule, _, callback) => {
          const value = form.getFieldValue('stakingAmount');
          // 币币账户申购金额
          const subAmount = form.getFieldValue('subAmount');
          const totalAmount = add(value || '0', subAmount || '0');

          // 未填写, 则不校验
          if (!value) {
            // 可能出现两个输入框都不填写的情况, 此时将 validStatus 设置为 false
            if (lessThan(totalAmount, minInvestmentAmount || '0')) {
              setValidStatus(false);
            }
            callback();
            return;
          }
          if (greeterThan(value, availableBalance || '0')) {
            // 不能大于金融账户资产
            callback(_t('d873cae97afa4000a0f5'));
          } else if (lessThan(value, minInvestmentAmount || '0')) {
            // 不能小于质押值
            callback(
              _t('97343c3d8ca44000a74e', {
                num: isNil(minInvestmentAmount)
                  ? '--'
                  : numberFormat({
                      number: minInvestmentAmount,
                      lang: currentLang,
                    }),
                currency: selectedCoin,
              }),
            );
          } else  if (validatorPersicion(value)) {
            // 精度验证
            callback(
              _t('p7Zh4Pev4fwuQt8fCrbKer', {
                priceIncrement: numberFormat({
                  number: persicion,
                  lang: currentLang,
                }),
              }),
            );
          } else if (greeterThan(totalAmount , maxUserInvestmentQuantity || '0')) {
            // 不能大于最大可投(个人硬顶)
            callback(
              _t('0833b01bea304000a74f'),
            );
          } else {
            setValidStatus(true);
            callback();
            return;
          }
          setValidStatus(false);
        },
      },
    ]}
  >
    <InputNumber
      label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
      suffix={
        <OperatorWrapper>
          <Button type="brandGreen" variant="text" onClick={handleFill}>
            {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
          </Button>
          <Divider type="vertical" />
          <span>{selectedCoin}</span>
        </OperatorWrapper>
      }
      controls={false}
      size="xlarge"
    />
  </FormItem>
  <UserAssetsWrapper>
    {/* 金融账户 */}
    <span className="label">{_t('6c026313c1984800ad85')}</span>
    <span className="value">
      {isNil(availableBalance)
        ? `--  ${selectedCoin}`
        : `${numberFormat({
            number: availableBalance,
            lang: currentLang,
          })} ${selectedCoin}`}
        </span>
  </UserAssetsWrapper>
  {/* 使用金融账户进行投入认购时，在认购期内您的理财权益依然保有, 详情查看 链接 */}
  <LabelTip onClick={onViewStakingRights}>
    {_tHTML('31dcaa72f2594800aaa9')}
  </LabelTip>

  </div>
  )
}

function getEarnBalance() {
  return pull('/spotlight/spotlight8/staking/balance')
    .then(res => {
      if (res && res.success) {
        return res.data?.availableBalance || 0;
      }
      return null;
    })
    .catch((err) => {
      console.warn('getEarnBalance error', err);
      return 0;
    });
}

export default SubscribeModal;
