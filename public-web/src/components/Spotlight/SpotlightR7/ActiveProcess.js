/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import {
  Button,
  Dialog,
  Divider,
  Form,
  useResponsive,
  dateTimeFormat,
  Steps,
  useSnackbar
} from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { formatLocalLangNumber } from 'helper';
import { useCountDown } from 'ahooks';
import { Link } from 'components/Router';
import Decimal from 'decimal.js';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { ReactComponent as CardBorderLeft } from 'static/spotlight7/cardBorderLeft.svg';
import { ReactComponent as CardInnerBorderLeft } from 'static/spotlight7/cardInnerBorderLeft.svg';
import { ReactComponent as CardInnerBottom } from 'static/spotlight7/cardInnerBottom.svg';
import { ReactComponent as CardInnerRight } from 'static/spotlight7/cardInnerRightTop.svg';
import { ReactComponent as CardInnerTop } from 'static/spotlight7/cardInnerTop.svg';
import { ReactComponent as CardInnerRightSm } from 'static/spotlight7/cardInnerRightSm.svg';
import { ReactComponent as H5TabLeftBottom } from 'static/spotlight7/h5TabLeftBottom.svg';
import { ReactComponent as H5TabRightBottom } from 'static/spotlight7/h5TabRightBottom.svg';
import { ReactComponent as H5TabInnerRight } from 'static/spotlight7/h5TabInnerRight.svg';
import { ReactComponent as H5TabRightTop } from 'static/spotlight7/h5TabRightTop.svg';
import { ReactComponent as H5TabArrowUp } from 'static/spotlight7/h5TabArrowUp.svg';
import { ReactComponent as H5TabArrowDown } from 'static/spotlight7/h5TabArrowDown.svg';
import leftIcon from 'static/spotlight7/pumpFun.svg';
import rightIcon from 'static/spotlight7/right_Icon.svg';
import Anchor1 from 'static/spotlight7/anchor1.svg';
import Anchor2 from 'static/spotlight7/anchor2.svg';
import Anchor3 from 'static/spotlight7/anchor3.svg';
import HistoryIcon from 'static/spotlight7/ic2_history.svg';
import TipsIcon from 'static/spotlight7/ic2_info.svg';
import { ICQuestionOutlined } from '@kux/icons';
import { _t } from 'tools/i18n';
import { greeterThan, lessThan, skip2Login } from 'TradeActivity/utils';
import AssetsComp from 'TradeActivityCommon/AssetsComp';
import InputNumber from 'TradeActivityCommon/InputNumber';
import { locateToUrl } from 'TradeActivity/utils';
import numberFixed from 'utils/numberFixed';
import clsx from 'clsx';
import ProgressLine from './ProgressLine';
import StatusModal from '../SpotlightR8/StatusModal';
import SubscriptionResultModal from './SubscriptionResultModal';
import get from 'lodash/get';
import AnchorNavigation from './AnchorNavigation';
import { PERIOD_STATUS, ERROR_CODE, SUB_RESULT } from './constants';
import { useDebounceFn } from 'ahooks';
import {transformNum} from 'src/utils/tool';
import { BASE_CURRENCY } from 'config/base';
import JsBridge from '@kucoin-base/bridge';
import kunlun from '@kucoin-base/kunlun';
import isNaN from 'lodash/isNaN';
import Tooltip from 'src/components/TradeActivity/ActivityCommon/Tooltip/index';
import { subcribe } from 'services/spotlight7';
import {
  Wrapper,
  ContentWrapper,
  TabWrapper,
  TabItem,
  H5TabWrapper,
  ModalWrapper,
  Content,
  LeftWrapper,
  LeftContent,
  RightWrapper,
  HistoryWrapper,
  PlaceholderText,
  FormWrapper,
  AssetsWrapper,
  OperatorWrapper,
  ButtonWrapper,
  CountdownWrapper,
  LinkButton,
  LabelWrapper,
  ValueWrapper,
  H5Step,
  ArrowCollapseBtn,
  PreValueWrapper,
  FooterWrapper,
  PersonalHardtop
} from './styled';
const { FormItem, useForm } = Form;
const { Step } = Steps;
const Countdown = memo(({ date, currentPeriod, onEnd }) => {
  const [__, formattedRes] = useCountDown({
    targetDate: date,
    onEnd,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountdownWrapper>
      {currentPeriod === 0 ?_t('6f393015d1754000acf8'):_t('866f66eaba144800a263') }
      <span className="timeCounter">
        <span className="item">{transformNum(days)}</span>
        <span className="split">:</span>
        <span className="item">{transformNum(hours)}</span>
        <span className="split">:</span>
        <span className="item">{transformNum(minutes)}</span>
        <span className="split">:</span>
        <span className="item">{transformNum(seconds)}</span>
      </span>
    </CountdownWrapper>
  );
});
const NumberDisplay = ({ value, lang, className, suffix, currentPeriod, interceptDigits }) => (
  <div className={className || "value"}>
    {currentPeriod === 0 && <span className="pre-value">/</span>}
    {!value ? (
      <PlaceholderText>--</PlaceholderText>
    ) : (<>
        {formatLocalLangNumber({
          data: Number(value),
          lang: lang,
          interceptDigits
        })} {suffix}
      </>
    )}
  </div>
);

const StepList = ({ statusTab, currentPeriod, onCollapse }) => (
  <H5Step size="small" direction="vertical" current={currentPeriod}>
    {statusTab.map((status, index) => (
      <Step
        className={`step-${index+1}`}
        title={status.label}
        description={<>
          {status.date}
          {index === 2 && (
            <ArrowCollapseBtn 
              onClick={(e) => {
                e.stopPropagation();
                onCollapse();
              }}
            >
              <H5TabArrowUp aria-label="Collapse tabs" role="button" />
            </ArrowCollapseBtn>
        )}
        </>}
      >
      </Step>
    ))}
  </H5Step>
); 

const ActiveTab = ({ currentPeriod, status, onExpand }) => (
  <div className="activeWrapper">
    <div className='flex-center'>
      <div className={`currentPeriod active`}>{currentPeriod + 1}</div>
      <div className="item-bg">
        <div className="status">{status?.label}</div>
        <div className="date">{status?.date}</div>
      </div>
    </div>
    <div className="h5TabArrowDown" onClick={onExpand} >
      <H5TabArrowDown
        aria-label="Expand tabs"
        role="button"
      />
    </div>
  </div>
);

const CountdownDisplay = ({ days, hours, minutes, seconds }) => (
  <span className="timeCounter">
    , {_t('e6ed1b133bcf4800a2ed')}
    <span className="item">{transformNum(days)}</span>
    <span className="split">:</span>
    <span className="item">{transformNum(hours)}</span>
    <span className="split">:</span>
    <span className="item">{transformNum(minutes)}</span>
    <span className="split">:</span>
    <span className="item">{transformNum(seconds)}</span>
  </span>
);

const ButtonContent = ({ btnText, showBtnCountDown, days, hours, minutes, seconds }) => (
  <div>
    {btnText}
    {showBtnCountDown && (
      <CountdownDisplay 
        days={days} 
        hours={hours} 
        minutes={minutes} 
        seconds={seconds} 
      />
    )}
  </div>
); 

const PCTabItem = memo(({ isActive, index, label, date }) => (
  <TabItem
    active={isActive}
    value={index}
    className={clsx({ active: isActive })}
  >
    <div className="item-bg">
      <div className="status">{label}</div>
      <div className="date">{date}</div>
    </div>
  </TabItem>
));

const ActiveProcess = (props) => {
  const {
    maxSubAmount,
    scale,
    campaignId,
    currentPeriod,
    distributeEndTime,
    distributeStartTime,
    formalSubEndTime,
    formalSubStartTime,
    presaleEndTime,
    presaleStartTime,
    tokenPrice,
    subAmountTotal,
    presaleHardTop,
    presaleRatio,
    minSubAmount,
    userSubAmount,  //用户投入
    userTokenAmount, //获得代币数量
    userSubFailAmountTotal, //用户投入剩余
    userSubSuccessExists,
    reachPresaleHardTop,
    tokenAmountTotal,
    fundsAvailable,
    fundsAvailableRatio,
    reachSubHardTop,
    userSubResultWindowShow,//弹认购结果的弹窗
    userSubFailExists,
    presaleSubAmountTotal,
    formalSubAmountTotalRatio,
    showPersonalHardtop, //是否展示个人申购硬顶
    personalHardtopDurationHour,

  } = props;
  const [form] = useForm();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const [showCountDown, setShowCountDown] = useState(false);
  const [showBtnCountDown, setShowBtnCountDown] = useState(false);
  const [refreshBtnText, setRefreshBtnText] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isInApp = JsBridge.isApp();
  // 弹窗类
  const [show, setShow] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(userSubSuccessExists);
  const [statusVisible, setShowStatusVisible] = useState(userSubSuccessExists);
  const [statusConfig, setStatusConfig] = useState({
    title: '',
    text: '',
    status: '',
    okText: '',
    cancelText: '',
    onOk: null,
    onCancel: null,
  });
  const PERSONAL_HARDTOP_CODE = "200006";
  // H5 Tab 展开或收起
  const [expand, setExpanded] = useState(false);
  const [num, setNum] = useState(0);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const balance = useSelector((state) => state.user_assets?.tradeMap?.[BASE_CURRENCY], shallowEqual);
  const qualification = useSelector((state) => state.spotlight7.qualification, shallowEqual);
  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const {
    baseCurrencyName: currencyFullName,
  } = useSelector((state) => state.spotlight7.detailInfo, shallowEqual);
  const pageId = get(pageData, 'id');
  const tokePath = get(pageData, 'token_path');
  const isNotDistribution = currentPeriod !== PERIOD_STATUS.DISTRIBUTION;

  // 认购结果弹窗
  useEffect(() => {
    setSubscriptionModalVisible(userSubResultWindowShow === SUB_RESULT.SUCCESS);
  }, [userSubResultWindowShow]);  
  const { completedKyc, signedCountryAgreement, signedAgreement, kycCountryAllow } = qualification || {};
  const refreshPage = () => {
    dispatch({ type: 'spotlight7/getTabData', payload: { id: campaignId } });
    setShowCountDown(false);
    setShowBtnCountDown(false);
    setRefreshBtnText((prev) => !prev);
  }
  // 预售期期倒计时
  const [__, formattedPresale] = useCountDown({
    targetDate: formalSubStartTime,
    interval: 1000,
    onEnd: () => {
      refreshPage();
    }
  });
  const { days, hours, minutes, seconds } = formattedPresale;
  const btnText = useMemo(() => {
    const now = Date.now();
    if(currentPeriod === PERIOD_STATUS.PRESALE) {
      // 预售结束 认购倒计时
      if(now >= presaleEndTime || reachPresaleHardTop === 1) {
        setDisabled(true);
        setShowBtnCountDown(true);
        setShowCountDown(false);
        return _t('5f1f9ea7fffa4800a583');
      } else {
        setDisabled(false);
        setShowBtnCountDown(false);
        // 没有达到总预售硬顶时
        if(reachPresaleHardTop !== 1){
          setShowCountDown(true);
        }
        // 预售期 申购
        return _t('07dc77fc83384000abe7');
      }
    } else if (currentPeriod === PERIOD_STATUS.FORMAL) {
      setShowBtnCountDown(false);
      // 认购结束 认购倒计时
      if(now >= formalSubEndTime || reachSubHardTop === 1) {
        setDisabled(true);
        setShowCountDown(false);
        return _t('70949149072f4000a493');
      } else {
        setDisabled(false);
        // 没有达到总预售硬顶时
        if(reachSubHardTop !== 1){
          setShowCountDown(true);
        }
        // 认购期 申购
        return _t('07dc77fc83384000abe7');
      }
    }
    // 分发中 分发结束（当前时间>=分发结束时间）
    setDisabled(true);
    setShowCountDown(false);
    setShowBtnCountDown(false);
    
    if(now < distributeEndTime) {
      return _t('43e6a43eb1054000aa70'); //分发中
    } else {
      return _t('28d49cfe3f444000a354');//分发结束
    }
  }, [currentPeriod, refreshBtnText, reachPresaleHardTop, reachSubHardTop]);

  const availableBalance = useMemo(() => {
    const { availableBalance: _availableBalance } = balance || {};
    return _availableBalance ? numberFixed(_availableBalance || '0', +scale || 0) : 0;
  }, [balance, scale]);

  const maxNum = useMemo(() => {
    let _maxNum;
    const mySubAmount = isNaN(Number(userSubAmount)) ? 0 : Number(userSubAmount);
    // 设置了最大申购
    if (maxSubAmount) {
      // 因增加个人申购硬顶 最大申购的值调整为 最大申购- 用户投入
      const maxAllowed = new Decimal(maxSubAmount).minus(mySubAmount);
      _maxNum = Decimal.min(maxAllowed, availableBalance);
    } else {
      _maxNum = availableBalance;
    }
    // 去除小数尾部0
    return new Decimal(`${_maxNum}` || '0').toFixed();
  }, [availableBalance, maxSubAmount, userSubAmount]);

  const persicion = useMemo(() => {
    return isNil(scale) ? '0' : numberFixed(1 / Math.pow(10, scale));
  }, [scale]);

  // 精度验证
  const validatorPersicion = useCallback(
    (value) => {
      if (!value || !+value) return false;
      const _value = `${value}`;
      if (_value.indexOf('.') > -1) {
        const [_, decimalNum] = _value.split('.');
        return decimalNum?.length > scale;
      }

      return false;
    },
    [scale],
  );

  const handleFill = useCallback(() => {
    form.setFieldsValue({ subAmount: maxNum });
    form.validateFields();
  }, [form, maxNum]);

  const { run: onConfirm } = useDebounceFn(
    () => {
      if (!user) {
        skip2Login();
        return;
      }

      form
        .validateFields()
        .then((values) => {
          setShow(true);
          // 去除小数尾部0
          const _num = new Decimal(values?.subAmount || '0').toFixed();
          setNum(_num);
        })
        .catch((err) => {
          console.log('validate error:', err);
        });
    },
    {
      wait: 1000,
      leading: true,
      trailing: false,
    },
  );
  const handleConfirm = useCallback(
    () => onConfirm(),
    [form, campaignId, user, dispatch],
  );

  const handleSubmit = useCallback( debounce(async () => {
    // 如果没资格参加
    if(!kycCountryAllow) {
      setShowStatusVisible(true);
      setStatusConfig({
        okText: _t('i.know'),
        title: _t('f73c9ad962924000a1d2'),
        status: 'warning',
        text: _t('4200d6381d8c4000a9f8'),
        cancelText: null,
        onOk: () => setShowStatusVisible(false),
        onCancel: () => setShowStatusVisible(false)
      });
      return;
    }
    try {
      const resp = await subcribe({
        subAmount: num,
        subToken: BASE_CURRENCY,
        campaignId,
        period: currentPeriod
      });
      if (resp.success) {
        setShowStatusVisible(true);
        setStatusConfig({
          okText: _t('6d0dbad46c024000a3c9'),
          title: _t('edf7b9d34a9a4800aa1d'),
          status: 'success',
          text: _t('fdb14898d7c34000ad3b', {num, currency: 'USDT'}),
          cancelText: null,
          onOk: () => setShowStatusVisible(false),
          onCancel: () => setShowStatusVisible(false)
        });
        form.resetFields();
        setShow(false);
        kunlun.report('spotlight7_subscribe_success', '200');
      } else {
        message.error(resp?.msg)
      }
    } catch(error) {
      if(!ERROR_CODE.includes(error.code)) {
        if(error.code == PERSONAL_HARDTOP_CODE) {
        message.error(_t('91c27a4c04ac4000a176'));

        } else {
          // 兜底提示
          setShowStatusVisible(true);
          setStatusConfig({
            okText: _t('c0f7b32b0af64000a7e5'),
            title: _t('37c26756c0244000ad74'),
            status: 'error',
            text: _t('e220e10109f34000a816'),
            cancelText: _t('back'),
            onOk: () => handleSubmit(),
            onCancel: () => setShowStatusVisible(false)
          });
        }
      } else {
        message.error(error?.msg)
      }
      kunlun.report('spotlight7_subscribe_failed', error.code);
    }
  },
  1000,
  { trailing: false, leading: true },
),[form, campaignId, num, dispatch]);

  const formatDateRange = (start, end) => {
    const format = (date) => dateTimeFormat({ date, lang: currentLang, options: { timeZone: 'UTC' } });
    return `${format(start) || '--'} ~ ${format(end) || '--'} (UTC)`;
  };

  const statusTab = useMemo(() => [
    {
      label: _t('cd27f270e5774800a41b'),
      date: formatDateRange(presaleStartTime, presaleEndTime)
    },
    {
      label: _t('90ee1a4759034800ab9c'),
      date: formatDateRange(formalSubStartTime, formalSubEndTime)
    },
    {
      label: _t('7033f75363114800a08f'),
      date: formatDateRange(distributeStartTime, distributeEndTime)
    }
  ], [
    presaleStartTime, presaleEndTime, 
    formalSubStartTime, formalSubEndTime,
    distributeStartTime, distributeEndTime
  ]);
  // 步骤引导
  const anchorList = [
    {
      icon: Anchor1,
      name: _t('af7f49f1fd7b4800aa68'),
      link: "#requirements"
  }, {
      icon: Anchor2,
      name: _t('674887a2bbb24000a7a7'),
      link: "#subscribe",
      callBack: () => {
        dispatch({ type: 'spotlight7/openExplainModal', payload: { type: 'Tips' }});
      },
    }, {
      icon: Anchor3,
      name: _t('69fa924edecf4800afc9'),
      link: "#subscribe",
      callBack: () => {
        dispatch({ type: 'spotlight7/openExplainModal', payload: { type: 'Rule' }});
      },
    }
  ];

  // 左侧卡片内容
  const leftContentData = [
    {label: _t('794eef63755f4800a48c', { currency: 'PUMP' }), value: Math.ceil(presaleHardTop), subValue: Math.ceil(presaleSubAmountTotal),  percent: presaleRatio},
    {label: _t('94f617a9f7624800a72d', { currency: 'PUMP' }), value: fundsAvailable, subValue: '', percent: formalSubAmountTotalRatio},
    {label: '', value: '', subValue: '',},
  ];
  // 历史记录
  const viewSubscribeHistory = () => {
    locateToUrl(`/spotlight7/purchase-record/${tokePath?.trim() || pageId}`);
  };
  // 认购弹窗内容
  const subscriptionInfo = {
    userTokenAmount,
    userSubAmount,
    userSubFailAmountTotal,
    tokenPrice,
    userSubFailExists
  };
  const getProgressData = () => {
    const currentData = leftContentData[currentPeriod] || {};
    const percent = currentData.percent || 0;
    const formattedPercent = numberFormat({
      number: percent,
      lang: currentLang,
      options: { style: 'percent' }
    });
    
    return {
      progress: percent * 100,
      iconTitle: formattedPercent
    };
  };
  const h5TabShow = !sm && [PERIOD_STATUS.PRESALE, PERIOD_STATUS.FORMAL, PERIOD_STATUS.DISTRIBUTION].includes(currentPeriod);
  return (
    <Wrapper>
      {/* 大中屏Tab */}
      {sm && (
        <TabWrapper>
          {statusTab.map((status, index) => (
            <PCTabItem
              key={`tab-${index}`}
              isActive={currentPeriod === index}
              index={index}
              label={status?.label}
              date={status?.date}
            />
          ))}
        </TabWrapper>
      )}
      {h5TabShow && (
        <H5TabWrapper>
          <H5TabLeftBottom className="h5TabLeftBottom" aria-hidden="true" />
          <H5TabRightBottom className="h5TabRightBottom" aria-hidden="true" />
          <H5TabInnerRight className="h5TabInnerRight" aria-hidden="true" />
          <H5TabRightTop className="h5TabRightTop" aria-hidden="true" />
          
          <div className="middleContent" aria-hidden="true" />
          <div className="leftContent" aria-hidden="true" />
          <div className="rightContent" aria-hidden="true" />
          
          <div className="content">
            {!expand ? (
              <ActiveTab
                currentPeriod={currentPeriod}
                status={statusTab[currentPeriod]}
                onExpand={() => setExpanded(true)}
              />
            ) : (
              <StepList
                statusTab={statusTab}
                currentPeriod={currentPeriod}
                onCollapse={() => setExpanded(false)}
              />
            )}
          </div>
        </H5TabWrapper>
      )}
      <ContentWrapper sm={sm}>
        {/* 卡片样式 start */}
        <div className="middleContent" />
        <div className="leftContent" />
        <div className="rightContent" />
        <CardBorderLeft className="leftBorderIcon" />
        <CardInnerBorderLeft className="innerLeftIcon" />
        <CardInnerBorderLeft className="innerRightIcon" />
        <CardInnerBottom className="innerBottomIcon" />
        {!sm && <CardInnerRightSm className="innerRightSmIcon" />}
        {isNotDistribution && <CardInnerTop className="innerTopIcon" />}
        {isNotDistribution && sm && <CardInnerRight className="innerRightTopIcon" />}

        {/* 卡片样式 end */}
        <Content>
          <LeftWrapper>
            <LeftContent showLine={currentPeriod < PERIOD_STATUS.DISTRIBUTION}>
              {sm && <div className="flex icon-wrapper mb-12">
                <img src={leftIcon} alt="leftIcon" />
                <img src={rightIcon} alt="leftIcon" />
              </div>}
              <LabelWrapper className={clsx({
                'mb-10': !sm,
                'mb-4': sm,
              })}>
                {/* 总计发售数量 */}
                <label >{_t('6efd5db6285b4800ad56', { currency: 'PUMP' })}</label>
                {sm && <label >{`${_t('2282b30353614000aaf6', { currency: BASE_CURRENCY })}`}</label>}
                {!sm && <NumberDisplay value={tokenAmountTotal} lang={currentLang} />}
              </LabelWrapper>
              <ValueWrapper>
                {!sm && <label >{`${_t('2282b30353614000aaf6', { currency: BASE_CURRENCY })}`}</label>}
                {sm && <NumberDisplay value={tokenAmountTotal} lang={currentLang} />}
                <NumberDisplay value={tokenPrice} lang={currentLang} />
              </ValueWrapper>
              {/* 是否展示个人申购硬顶 */}
              {showPersonalHardtop && <PersonalHardtop>
                <div className="flex-center">
                  <label>{_t("00290ab142564800ab1c", { currency: 'USDT' })}</label>
                  <Tooltip 
                      className="hard-top"
                      placement="top" 
                      header={_t("00290ab142564800ab1c", { currency: 'USDT' })}
                      title={_t("7516740658ce4000a7f6", {
                        num: numberFormat({
                          number: maxSubAmount,
                          lang: currentLang,
                        }),
                        time: personalHardtopDurationHour || '--',
                        time0: personalHardtopDurationHour || '--',
                      })}
                    >
                      <ICQuestionOutlined className="pointer ml-4 tips" size="15" />
                    </Tooltip>
                </div>
                <div>
                  <NumberDisplay 
                    value={maxSubAmount} 
                    lang={currentLang} 
                    className="pre-value"
                  />
                </div>
              </PersonalHardtop>}
              {currentPeriod < PERIOD_STATUS.DISTRIBUTION &&  <div className="line" />}
              {currentPeriod < PERIOD_STATUS.DISTRIBUTION &&  <PreValueWrapper className={clsx({
                'mb-16': sm,
                'mb-12': !sm,
              })} >
                {/* 根据不同状态展示不同显示内容 */}
                <label >{leftContentData[currentPeriod]?.label}</label>
                <div className={clsx({
                  'flex': sm
                })}>
                  {currentPeriod === 0 && 
                    <NumberDisplay 
                      value={leftContentData[currentPeriod]?.subValue} 
                      lang={currentLang} 
                      className="pre-value"
                    />}
                  <NumberDisplay 
                    value={leftContentData[currentPeriod]?.value} 
                    lang={currentLang} 
                    className={currentPeriod === 0? 'text40' : 'pre-value'} 
                    currentPeriod={currentPeriod}
                  />
                </div>
              </PreValueWrapper>}
              {/* 进度条 */}
              {isNotDistribution && (
                <ProgressLine 
                  {...getProgressData()} 
                />
              )} 
            </LeftContent>
          </LeftWrapper>
          <RightWrapper>
            {/* 历史记录 */}
            <HistoryWrapper to="subscribe">
              <div className="formTitle">{_t('946a8ed30daf4000a2cc')}</div>
              {!isInApp && <div className="history-wrapper" onClick={viewSubscribeHistory}>
                <img src={HistoryIcon} alt="HistoryIcon" />
                {_t('464e51a934924800adc9')}
              </div>}
            </HistoryWrapper>
            {/* 我已投入 */}
            <div className="flex">
              <label>{_t('0b5847a1267c4000a7c7')}</label>
              <div className="value">
               <NumberDisplay value={userSubAmount} lang={currentLang} className="pre-value" suffix="USDT" />
              </div>
            </div>
            {/* 获得代币数量 */}
            {currentPeriod === PERIOD_STATUS.DISTRIBUTION && <div className="flex mt-10">
              <label>{_t('f4c5750a87df4000ab5b')}</label>
              <div className="value">
               <NumberDisplay value={userTokenAmount} lang={currentLang} className="pre-value" />
              </div>
            </div>}
            <FormWrapper>
              {isNotDistribution && <Form form={form}>
                <FormItem
                  name="subAmount"
                  label={_t('fe08b93d451f4000a8eb')}
                  validateTrigger={['onInput']}
                  rules={[
                    {
                      validator: (rule, _, callback) => {
                        const value = form.getFieldValue('subAmount');
                        if (!+value) {
                          // 不能为空
                          callback(_t('form.required'));
                        } else if (lessThan(value || 0, minSubAmount || '0')) {
                          // 不能小于最小值
                          callback(
                            _t('97343c3d8ca44000a74e', {
                              num: numberFormat({
                                number: minSubAmount || '0',
                                lang: currentLang,
                              }),
                              currency: BASE_CURRENCY,
                            }),
                          );
                        } else if (greeterThan(value || 0, maxNum || '0')) {
                          // 登录后才验证
                          if (!user) {
                            callback();
                            return;
                          }

                          // 不能大于最大值
                          callback(
                            _t('7514637f037d4000abb5', {
                              num: numberFormat({
                                number: maxNum || '0',
                                lang: currentLang,
                              }),
                              currency: BASE_CURRENCY,
                            }),
                          );
                        } else if (validatorPersicion(value)) {
                          // 精度验证
                          callback(
                            _t('p7Zh4Pev4fwuQt8fCrbKer', {
                              priceIncrement: numberFormat({
                                number: persicion || '0',
                                lang: currentLang,
                              }),
                            }),
                          );
                        } else {
                          callback();
                          return;
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber
                    label={_t('fe08b93d451f4000a8eb')}
                    suffix={
                      <OperatorWrapper>
                        <Button type="brandGreen" variant="text" onClick={handleFill}>
                          {_t('63b61b9ddb4a4000aca4')}
                        </Button>
                        <Divider type="vertical" />
                        <span>{BASE_CURRENCY}</span>
                      </OperatorWrapper>
                    }
                    controls={false}
                    size="xlarge"
                  />
                </FormItem>
              </Form>}
              {currentPeriod !==PERIOD_STATUS.DISTRIBUTION && <AssetsWrapper>
                <AssetsComp stakingToken={BASE_CURRENCY} mini={false} tokenScale={scale} />
              </AssetsWrapper>}
        
              <ButtonWrapper showCountDown={showCountDown}>
                {/* 倒计时条件  认购期 和预售期展示*/}
                {showCountDown? (
                  <div className="timeCount">
                    <Countdown
                      date={!currentPeriod? presaleEndTime : formalSubEndTime}
                      currentPeriod={currentPeriod}
                      onEnd={refreshPage}
                    />
                  </div>
                ): <>
                  {reachPresaleHardTop === 1 && <div className="tips">{_t('64ff54a2898d4800a7de')}</div>}
                  {reachSubHardTop === 1 && <div className="tips">{_t('43f5565240cc4000a7db')}</div>}
                </>}
                {/* 可申购期（预热期 || 预售期），且已登陆，不满足申购条件时 */}
                {isNotDistribution && user &&
                !(completedKyc && signedCountryAgreement && signedAgreement && kycCountryAllow) ? (
                  <LinkButton to="#requirements" disabled={disabled}>
                    <ButtonContent 
                      btnText={btnText} 
                      showBtnCountDown={showBtnCountDown} 
                      days={days} 
                      hours={hours} 
                      minutes={minutes} 
                      seconds={seconds} 
                    />
                  </LinkButton>
                ) : (
                  <Button
                    fullWidth
                    size="large"
                    onClick={handleConfirm}
                    disabled={disabled}
                  >
                     <ButtonContent 
                      btnText={btnText} 
                      showBtnCountDown={showBtnCountDown} 
                      days={days} 
                      hours={hours} 
                      minutes={minutes} 
                      seconds={seconds} 
                    />
                  </Button>
                )}
              </ButtonWrapper>
            </FormWrapper>
          </RightWrapper>
        </Content>
        {/* 步骤引导 */}
        <AnchorNavigation anchorList={anchorList} />
      </ContentWrapper>

      {/* 申购确认弹窗 */}
      <Dialog
        title={_t('8eac15fa9ac14000a97b')}
        open={show}
        showCloseX={false}
        footer={<FooterWrapper>
          <Button
            variant="outlined"
            type="default"
            onClick={() => setShow(false)}
          >
            {_t('cancel')}
          </Button>
          <Button onClick={handleSubmit} className="submit-btn">
            {_t('submit')}
          </Button>
        </FooterWrapper>}
      >
        <ModalWrapper>
          <div className="flex">
            <div className="label">{_t('881a5298447f4000a404')}</div>
            <div className="value">
              <>{num} </>
              <span className="unit">{BASE_CURRENCY}</span>
            </div>
          </div>
          {/* 个人申购硬顶提示 */}
          {showPersonalHardtop && <div className="tips-wrapper">
            <div>
              <img src={TipsIcon} alt="tips" />
            </div>
            <div>
              {_t("7516740658ce4000a7f6", {
                num: numberFormat({
                  number: maxSubAmount,
                  lang: currentLang,
                }),
                time: personalHardtopDurationHour || '--',
                time0: personalHardtopDurationHour || '--',
              })}
            </div>
          </div>}
        </ModalWrapper>
      </Dialog>

      {/* 认购成功/认购失败弹窗 */}
      <StatusModal
        visible={statusVisible}
        contentTitle={statusConfig.title}
        contentText={statusConfig.text}
        okText={statusConfig.okText}
        cancelText={statusConfig.cancelText}
        resultStatus={statusConfig.status}
        onOk={statusConfig.onOk}
        onCancel={statusConfig.onCancel}
      />

      {/* 认购结果弹窗 */}
      <SubscriptionResultModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        subscriptionInfo={subscriptionInfo}
      />
    </Wrapper>
  );
};

export default memo(ActiveProcess);
