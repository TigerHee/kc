/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Divider, Form } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { add, Decimal } from 'helper';
import isNil from 'lodash/isNil';
import { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';
import { trackClick } from 'utils/ga';
import numberFixed from 'utils/numberFixed';
import InputNumber from '../../ActivityCommon/InputNumber';
import Modal from '../../ActivityCommon/Modal';
import { greeterThan, lessThan } from '../../utils';
import {
  AssetsWrapper,
  ButtonWrapper,
  CotentWrapper,
  KCSDescWrapper,
  OperatorWrapper,
  TitleWrapper,
} from './styledComponents';

const { FormItem, useForm } = Form;
const emptyObj = {};

const UnStakingModal = () => {
  const { currentLang } = useLocale();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(emptyObj);
  const [validStatus1, setValidStatus1] = useState(true); // 第一个输入框状态
  const [validStatus2, setValidStatus2] = useState(true); // 第二个输入框状态
  const [validStatus, setValidStatus] = useState(false); // 按钮状态
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);

  const poolInfo = useSelector((state) => state.gempool.poolInfo, shallowEqual);
  const unstakeModal = useSelector((state) => state.gempool.unstakeModal);
  const loading = useSelector((state) => state.loading.effects['gempool/postGemPoolUnstaking']);

  const { poolId, stakingToken, stakingTokenLogo, stakingAmount, stakingEarnAmount, tokenScale } =
    poolInfo || {};

  const handleClose = useCallback(() => {
    form.resetFields();
    dispatch({
      type: 'gempool/update',
      payload: {
        unstakeModal: false,
      },
    });
    setValidStatus1(true);
    setValidStatus2(true);
    setValidStatus(false);
    setFormValues(emptyObj);
  }, [form, dispatch]);

  const handleConfirm = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        // 保存数值
        setFormValues(values);
        setConfirmDialogVisible(true);
      })
      .catch((err) => {
        console.log('validate error:', err);
      });
  }, [form]);

  const handleSubmit = useCallback(() => {
    const { redeemAmount, redeemEarnAmount } = formValues || {};
    // 去除小数尾部0
    const _num = add(redeemAmount || '0', redeemEarnAmount || '0').toFixed();

    trackClick(['ProjectDetail', 'gempoolRedemption'], {
      amount: _num,
      currency: stakingToken,
    });

    dispatch({
      type: 'gempool/postGemPoolUnstaking',
      payload: {
        redeemAmount: redeemAmount ? new Decimal(redeemAmount).toFixed() : undefined,
        redeemEarnAmount: redeemEarnAmount ? new Decimal(redeemEarnAmount).toFixed() : undefined,
        poolId,
      },
    }).then((res) => {
      if (res) {
        if (redeemEarnAmount) {
          dispatch({
            type: 'gempool/pullGempoolBalance',
          });
        }

        handleClose();
        setConfirmDialogVisible(false);
        setResultDialogVisible(true);
      }
    });
  }, [formValues, poolId, stakingToken, dispatch, handleClose]);

  const persicion = useMemo(() => {
    return isNil(tokenScale) ? '0' : numberFixed(1 / Math.pow(10, tokenScale));
  }, [tokenScale]);

  // 精度验证
  const validatorPersicion = useCallback(
    (value) => {
      if (!value || !+value) return false;
      if (value?.indexOf('.') > -1) {
        const [_, decimalNum] = value.split('.');
        // // 去除尾部0
        // const _num = decimalNum?.replace(/(0+)$/, '');
        return decimalNum?.length > tokenScale;
      }

      return false;
    },
    [tokenScale],
  );

  const handleFill = useCallback(
    (key, value) => {
      form.setFieldsValue({ [key]: value });
      form.validateFields();
    },
    [form],
  );

  const genAvailable = useCallback(
    (value) => {
      if (isNil(value)) return '--';
      return value
        ? numberFormat({
            number: value,
            lang: currentLang,
          })
        : '0';
    },
    [currentLang],
  );

  return (
    <>
      <Modal
        open={unstakeModal && !confirmDialogVisible}
        onClose={handleClose}
        title={
          <TitleWrapper>
            <img src={stakingTokenLogo} alt="logo" />
            <span>{_t('1390c45e71364000ab4e', { currency: stakingToken })}</span>
          </TitleWrapper>
        }
      >
        <CotentWrapper>
          <Form form={form}>
            {+stakingEarnAmount > 0 && (
              <div className="account-item-container">
                <div className="title">{_t('5f6e58725bb64000a12a')}</div>
                <div className="desc">{_t('15db182f53f54000ad94')}</div>
                <FormItem
                  name="redeemEarnAmount"
                  label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                  validateTrigger={['onInput']}
                  rules={[
                    {
                      validator: (rule, _, callback) => {
                        const value = form.getFieldValue('redeemEarnAmount');
                        // if (!+value) {
                        //   // 不能为空
                        //   callback(_t('form.required'));
                        // } else
                        if (lessThan(value, persicion)) {
                          // 不能小于质押精度
                          callback(
                            _t('97343c3d8ca44000a74e', {
                              num: numberFormat({
                                number: persicion,
                                lang: currentLang,
                              }),
                              currency: stakingToken,
                            }),
                          );
                        } else if (greeterThan(value, stakingEarnAmount || '0')) {
                          // 不能大于质押值
                          callback(_t('896c8b1584b84000ade3'));
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
                        } else {
                          const _value = form.getFieldValue('redeemAmount');
                          setValidStatus((value || _value) && validStatus1);
                          setValidStatus2(true);
                          callback();
                          return;
                        }
                        setValidStatus2(false);
                        setValidStatus(false);
                      },
                    },
                  ]}
                >
                  <InputNumber
                    label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                    suffix={
                      <OperatorWrapper>
                        <Button
                          type="brandGreen"
                          variant="text"
                          onClick={() => handleFill('redeemEarnAmount', stakingEarnAmount)}
                        >
                          {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
                        </Button>
                        <Divider type="vertical" />
                        <span>{stakingToken}</span>
                      </OperatorWrapper>
                    }
                    size="xlarge"
                  />
                </FormItem>
                <AssetsWrapper>
                  <span className="label">{_t('780357afeb574000a1c9')}</span>
                  <span className="value">
                    {`${genAvailable(stakingEarnAmount)} ${stakingToken}`}
                  </span>
                </AssetsWrapper>
              </div>
            )}

            {+stakingAmount > 0 && +stakingEarnAmount > 0 && <Divider />}
            {+stakingAmount > 0 && (
              <div className="account-item-container">
                <div className="title">{_t('52c27553c0de4800a82f')}</div>
                <FormItem
                  name="redeemAmount"
                  label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                  validateTrigger={['onInput']}
                  rules={[
                    {
                      validator: (rule, _, callback) => {
                        const value = form.getFieldValue('redeemAmount');
                        // if (!+value) {
                        //   // 不能为空
                        //   callback(_t('form.required'));
                        // } else
                        if (lessThan(value, persicion)) {
                          // 不能小于质押精度
                          callback(
                            _t('97343c3d8ca44000a74e', {
                              num: numberFormat({
                                number: persicion,
                                lang: currentLang,
                              }),
                              currency: stakingToken,
                            }),
                          );
                        } else if (greeterThan(value, stakingAmount || '0')) {
                          // 不能大于质押值
                          callback(_t('896c8b1584b84000ade3'));
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
                        } else {
                          const _value = form.getFieldValue('redeemEarnAmount');
                          setValidStatus((value || _value) && validStatus2);
                          setValidStatus1(true);
                          callback();
                          return;
                        }
                        setValidStatus1(false);
                        setValidStatus(false);
                      },
                    },
                  ]}
                >
                  <InputNumber
                    label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                    suffix={
                      <OperatorWrapper>
                        <Button
                          type="brandGreen"
                          variant="text"
                          onClick={() => handleFill('redeemAmount', stakingAmount)}
                        >
                          {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
                        </Button>
                        <Divider type="vertical" />
                        <span>{stakingToken}</span>
                      </OperatorWrapper>
                    }
                    size="xlarge"
                  />
                </FormItem>
                <AssetsWrapper>
                  <span className="label">{_t('780357afeb574000a1c9')}</span>
                  <span className="value">{`${genAvailable(stakingAmount)} ${stakingToken}`}</span>
                </AssetsWrapper>
              </div>
            )}
            <KCSDescWrapper className="unStake">{_t('f106a7ec81b54000aa92')}</KCSDescWrapper>
          </Form>
        </CotentWrapper>
        <ButtonWrapper>
          <Button fullWidth disabled={!validStatus} size="large" onClick={handleConfirm}>
            {_t('9f75bc41bbcc4000ad4c')}
          </Button>
        </ButtonWrapper>
      </Modal>
      {confirmDialogVisible && (
        <StatusModal
          visible={confirmDialogVisible}
          setDialogVisible={setConfirmDialogVisible}
          resultStatus={EnumStatus.Warning}
          contentTitle={_t('13e86d16ffa74000ae85')}
          contentText={_t('69b5ad279c274000a65b')}
          okText={_t('confirm')}
          cancelText={_t('cancel')}
          handleSubmit={handleSubmit}
          submitCallback={() => {}}
          okLoading={loading}
        />
      )}
      {resultDialogVisible && (
        <StatusModal
          visible={resultDialogVisible}
          setDialogVisible={setResultDialogVisible}
          resultStatus={EnumStatus.Success}
          contentTitle={_t('0dd2116bd6dd4000af8a')}
          contentText={_t('7fa8fad3ab734000a1e0')}
        />
      )}
    </>
  );
};

export default UnStakingModal;
