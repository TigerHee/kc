/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Button, Divider, Form, useResponsive } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { Link } from 'components/Router';
import { add, Decimal } from 'helper';
import isNil from 'lodash/isNil';
import { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';
import { trackClick } from 'utils/ga';
import numberFixed from 'utils/numberFixed';
import InputNumber from '../../ActivityCommon/InputNumber';
import Modal from '../../ActivityCommon/Modal';
import { greeterThan, lessThan } from '../../utils';
import { POOL_STATUS } from '../config';
import AssetsComp from './ProjectItem/AssetsComp';
import {
  AssetsWrapper,
  ButtonWrapper,
  CotentWrapper,
  // DescWrapper,
  KCSDescWrapper,
  OperatorWrapper,
  TitleWrapper,
} from './styledComponents';
import TaskContent from './TaskContent';

const { FormItem, useForm } = Form;

const StakingModal = ({ type }) => {
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const [form] = useForm();
  const dispatch = useDispatch();
  const { sm } = useResponsive();

  const [validStatus1, setValidStatus1] = useState(true); // 第一个输入框状态
  const [validStatus2, setValidStatus2] = useState(true); // 第二个输入框状态
  const [validStatus, setValidStatus] = useState(false); // 按钮状态
  // const [stakingNum, setStakingNum] = useState(0);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);

  const poolInfo = useSelector((state) => state.gempool.poolInfo, shallowEqual);
  const inviteBonusLevel = useSelector((state) => state.gempool.inviteBonusLevel);
  const tradeMap = useSelector((state) => state.user_assets.tradeMap, shallowEqual);
  const bonusTaskList = useSelector((state) => state.gempool.bonusTaskList, shallowEqual);
  const stakeModal = useSelector((state) => state.gempool.stakeModal);
  const taskShowVisible = useSelector((state) => state.gempool.taskShowVisible);
  const loading = useSelector((state) => state.loading.effects['gempool/postGemPoolStaking']);
  const kcsAvailable = useSelector((state) => state.gempool.kcsAvailable);

  const {
    campaignId,
    earnTokenName,
    poolId,
    stakingToken,
    stakingTokenLogo,
    minStakingAmount,
    status,
    tokenScale,
  } = poolInfo || {};

  const availableBalance = useMemo(() => {
    const { availableBalance: _availableBalance } = tradeMap?.[stakingToken] || {};
    return _availableBalance ? numberFixed(_availableBalance, tokenScale || 0) : undefined;
  }, [tradeMap, stakingToken, tokenScale]);

  const persicion = useMemo(() => {
    return isNil(tokenScale) ? '0' : numberFixed(1 / Math.pow(10, tokenScale));
  }, [tokenScale]);

  const handleClose = useCallback(() => {
    form.resetFields();

    dispatch({
      type: 'gempool/update',
      payload: {
        stakeModal: false,
      },
    });
    setValidStatus1(true);
    setValidStatus2(true);
    setValidStatus(false);
  }, [form, dispatch]);

  const handleConfirm = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const { stakingAmount, stakingEarnAmount } = values || {};
        // 去除小数尾部0
        const _num = add(stakingAmount || '0', stakingEarnAmount || '0').toFixed();
        // 记录质押值，结果弹框显示
        // setStakingNum(_num);
        trackClick(['ProjectDetail', 'gempoolStaking'], {
          amount: _num,
          currency: stakingToken,
        });

        dispatch({
          type: 'gempool/postGemPoolStaking',
          payload: {
            stakingAmount: stakingAmount ? new Decimal(stakingAmount).toFixed() : undefined,
            stakingEarnAmount: stakingEarnAmount
              ? new Decimal(stakingEarnAmount).toFixed()
              : undefined,
            poolId,
            type,
          },
        }).then((res) => {
          if (res) {
            if (stakingEarnAmount) {
              dispatch({
                type: 'gempool/pullGempoolBalance',
              });
            }
            // 区分首页和详情, 质押成功重新获取数据
            if (type === 'detail') {
              dispatch({
                type: 'gempool/pullGemPoolProjectDetail',
                payload: {
                  currency: earnTokenName,
                },
              });
            } else {
              dispatch({
                type: 'gempool/pullGemPoolRecords',
              });
            }
            dispatch({
              type: 'gempool/update',
              payload: {
                questionId: campaignId
              }
            })
            handleClose();
            setResultDialogVisible(true);
          }
        });

        // 获取任务列表及状态
        dispatch({
          type: 'gempool/pullGemPoolBonusTask',
          payload: {
            id: campaignId,
          },
        });
      })
      .catch((err) => {
        console.log('validate error:', err);
      });
  }, [type, poolId, campaignId, earnTokenName, stakingToken, form, dispatch, handleClose]);

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

  return (
    <>
      <Modal
        open={stakeModal}
        onClose={handleClose}
        title={
          <TitleWrapper>
            <img src={stakingTokenLogo} alt="logo" />
            <span>{_t('2181b1d746684000a157', { currency: stakingToken })}</span>
          </TitleWrapper>
        }
      >
        <CotentWrapper>
          <Form form={form}>
            {stakingToken === 'KCS' && (
              <>
                <div className="account-item-container">
                  <div className="title">{_t('6c026313c1984800ad85')}</div>
                  <FormItem
                    name="stakingEarnAmount"
                    label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                    validateTrigger={['onInput']}
                    rules={[
                      {
                        validator: (rule, _, callback) => {
                          const value = form.getFieldValue('stakingEarnAmount');
                          // if (!+value) {
                          //   // 不能为空
                          //   callback(_t('form.required'));
                          // } else
                          if (lessThan(value, minStakingAmount || '0')) {
                            // 不能小于质押值
                            callback(
                              _t('97343c3d8ca44000a74e', {
                                num: numberFormat({
                                  number: minStakingAmount,
                                  lang: currentLang,
                                }),
                                currency: stakingToken,
                              }),
                            );
                          } else if (greeterThan(value, kcsAvailable || '0')) {
                            // 不能大于资产
                            callback(_t('d873cae97afa4000a0f5'));
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
                            const _value = form.getFieldValue('stakingAmount');
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
                            onClick={() => handleFill('stakingEarnAmount', kcsAvailable)}
                          >
                            {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
                          </Button>
                          <Divider type="vertical" />
                          <span>{stakingToken}</span>
                        </OperatorWrapper>
                      }
                      controls={false}
                      size="xlarge"
                    />
                  </FormItem>
                  <AssetsWrapper>
                    <span className="label">{_t('7c65faa586b64000af61')}</span>
                    <span className="value">
                      {`${isNil(kcsAvailable) ? '--' : kcsAvailable} ${stakingToken}`}
                    </span>
                  </AssetsWrapper>
                </div>
                {/* 这里的文案，样式不需要调整 */}
                <KCSDescWrapper>
                  {_t('ff5d18e450504800a283')}
                  <Link
                    to={'/kcs'}
                    onClick={() => locateToUrlInApp('/kcs')}
                    dontGoWithHref={isInApp}
                    className="link"
                  >
                    {_t('e4cc550bda4e4000aad9')}
                  </Link>
                </KCSDescWrapper>
                <Divider />
              </>
            )}
            <div className="account-item-container">
              <div className="title">{_t('1b00ec1e96dc4800a42e')}</div>
              <FormItem
                name="stakingAmount"
                label={_t('1mDf2TmQsjAKqqUoKnVe4G')}
                validateTrigger={['onInput']}
                rules={[
                  {
                    validator: (rule, _, callback) => {
                      const value = form.getFieldValue('stakingAmount');
                      // if (!+value) {
                      //   // 不能为空
                      //   callback(_t('form.required'));
                      // } else
                      if (lessThan(value, minStakingAmount || '0')) {
                        // 不能小于质押值
                        callback(
                          _t('97343c3d8ca44000a74e', {
                            num: numberFormat({
                              number: minStakingAmount,
                              lang: currentLang,
                            }),
                            currency: stakingToken,
                          }),
                        );
                      } else if (greeterThan(value, availableBalance || '0')) {
                        // 不能大于资产
                        callback(_t('7f8992468eef4000a5f7'));
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
                        const _value = form.getFieldValue('stakingEarnAmount');
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
                        onClick={() => handleFill('stakingAmount', availableBalance)}
                      >
                        {_t('qqAXZJgVoLJ6bQdW6TP4QF')}
                      </Button>
                      <Divider type="vertical" />
                      <span>{stakingToken}</span>
                    </OperatorWrapper>
                  }
                  controls={false}
                  size="xlarge"
                />
              </FormItem>
              <AssetsWrapper>
                <AssetsComp stakingToken={stakingToken} isMini={!sm} tokenScale={tokenScale} />
              </AssetsWrapper>
            </div>
          </Form>
        </CotentWrapper>

        <ButtonWrapper>
          <Button
            fullWidth
            disabled={!validStatus}
            size="large"
            onClick={handleConfirm}
            loading={loading}
          >
            {_t('dfdce9d75b6b4000a782')}
          </Button>
        </ButtonWrapper>
      </Modal>
      {resultDialogVisible && (
        <StatusModal
          size="medium"
          restrictHeight
          visible={resultDialogVisible}
          setDialogVisible={setResultDialogVisible}
          resultStatus={EnumStatus.Success}
          contentTitle={_t('6e320aaf20ad4000a971')}
          contentText={null}
          okText={_t('87135cebc25e4000aaab')}
          contentExtra={
            taskShowVisible && status === POOL_STATUS.IN_PROCESS ? (
              <>
                <Divider />
                <TaskContent
                  list={bonusTaskList}
                  inviteBonusLevel={inviteBonusLevel}
                  questionId={campaignId}
                  onClose={() => setResultDialogVisible(false)}
                />
              </>
            ) : null
          }
        />
      )}
    </>
  );
};

export default StakingModal;
