/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '@kufox/mui';
import { debounce, isFunction } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { sensors } from 'utils/sensors';
import { _t, _tHTML } from 'src/utils/lang';
import { separateNumber } from 'helper';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import useLastTime, { formatCountDownTime } from 'src/components/$/Prediction/useLastTime';
import {
  Content,
  ProcessHeader,
  BodyWrapper,
  ProcessTip,
  InputWrapper,
  RoundCountDown,
  Text,
  ProcessStatusWrapper,
  Img,
} from './StyledComps';
import { DIALOG_TYPE, THEME_COLOR } from 'components/$/Prediction/config';
import TIP_WHITE from 'assets/prediction/tip-white.svg';
import PrizePool from './PrizePool';
import { styled } from '@kufox/mui/emotion';

const WrapInput = styled(Input)``;

const WrapButton = styled(Button)`
  background-color: ${THEME_COLOR.primary};
  height: 42px;
  &:active, &:hover{
    background-color: #786FE0};
  }
`;

// 输入数字的格式正则校验
const pattern = /^(([0-9])|([1-9][0-9]+))(\.\d{0,20})?$/;

// 倒计时组件
const CountDown = ({ data, onCountDownFinish }) => {
  const { end, now, id } = data;
  const lastTime = useLastTime({ start: now, end });
  const { h, m, s } = formatCountDownTime(lastTime);
  useEffect(
    () => {
      if (lastTime <= 0 && id) {
        // 派发获取最新请求
        isFunction(onCountDownFinish) && onCountDownFinish();
      }
    },
    [lastTime, onCountDownFinish, id],
  );
  return (
    <RoundCountDown>
      <div className="roundCountDown">
        <span className="time">{h}</span>:<span className="time">{m}</span>:
        <span className="time">{s}</span>
      </div>
    </RoundCountDown>
  );
};
// 进行中卡片
const ProcessingCard = ({ onShowTipDialog, round, btnClickCheck, onCountDownFinish, isSign }) => {
  const { id, end, closeTimeText, bigPrize, luckyPrize } = round;
  const dispatch = useDispatch();
  const [number, setNumber] = useState(undefined);
  const [isFocus, setIsFocus] = useState(false);
  const [numberLoading, setNumberLoading] = useState(undefined);
  const { message } = useSnackbar();
  const submitNumberLoading = useSelector(
    state => state.loading.effects['prediction/submitNumber'],
  );
  const { activityConfig = {}, userGuessInfo = {}, currentRoundIndex } = useSelector(
    state => state.prediction,
  );
  const { guessLimit } = activityConfig;
  const { userGuessRecords } = userGuessInfo;
  const loading = numberLoading || submitNumberLoading;
  const isUpperLimit = guessLimit >= userGuessRecords?.length; // 超过提交上限
  const date = moment.utc(end).format('YYYY-MM-DD');
  const { currentLang } = useSelector(state => state.app);

  useEffect(
    () => {
      return () => {
        setNumber('');
      };
    },
    [setNumber],
  );
  const submitNumber = useCallback(
    number => {
      setNumberLoading(false);
      dispatch({
        type: 'prediction/submitNumber',
        payload: {
          id,
          guessNum: number,
        },
        callback: res => {
          if (res.success) {
            // 清除数据
            setNumber('');
            // 埋点
            sensors.trackClick(['Submit', '1'], {
              language: currentLang,
              Sessions: `${date}/${currentRoundIndex + 1}`,
            });
            message.success(_t('prediction.submitSuccess'));
          } else {
            const text = res.msg || _t('prediction.submitError');
            message.error(text);
          }
        },
      });
    },
    [dispatch, id, message, setNumber, date, currentRoundIndex, currentLang],
  );
  // 提交号码
  const onSubmit = useCallback(
    // 防抖处理
    debounce(
      async () => {
        if (isFunction(btnClickCheck) && (await btnClickCheck())) {
          setNumberLoading(true);
          const canSubmit = pattern.test(number) && number?.length <= 20;
          if (!canSubmit || isUpperLimit) {
            // 先校验
            let text = _t('prediction.submitError');
            if (!canSubmit) {
              text = !pattern.test(number) ? _t('prediction.error1') : _t('prediction.error3');
            } else if (isUpperLimit) {
              text = _t('prediction.error3');
            }
            setNumberLoading(false);
            return message.warning(text);
          }
          if (!isSign) {
            // 如果没有报名先帮用户报名
            await dispatch({
              type: 'kcCommon/goSignUp',
              payload: { activity: 'guess_eth' },
              callback: res => {
                res?.success && submitNumber(number);
              },
            });
            return;
          }
          await submitNumber(number);
        }
      },
      300,
      { leading: true, trailing: false },
    ),
    [number, dispatch, id, isSign, message, setNumberLoading, isUpperLimit],
  );

  const onFocus = () => {
    setIsFocus(true);
  };

  const onBlur = () => {
    setIsFocus(false);
  };

  return (
    <Content className="processing">
      <ProcessHeader>
        <ProcessStatusWrapper>
          <div className="left_box">
            <div className="statusTitle">
              <>{_tHTML('prediction.quizeEndPrice', { a: closeTimeText })}</>
              <Img
                className="processTip"
                onClick={() => onShowTipDialog(DIALOG_TYPE.SCHEDULE_TIP)}
                src={TIP_WHITE}
                alt="TIP_WHITE"
              />
            </div>
            <div className="status-text">{_t('prediction.inProcess')}</div>
          </div>
          <div>
            <Fragment>
              {end ? <CountDown data={round} onCountDownFinish={onCountDownFinish} /> : ''}
            </Fragment>
            <Text>{_t('prediction.currentTimeOut')}</Text>
          </div>
        </ProcessStatusWrapper>
      </ProcessHeader>
      <BodyWrapper className="inProcessingWrapper">
        <ProcessTip>
          <PrizePool number={separateNumber(bigPrize.amount || 0)} />
          <div className="processTipText">
            {_tHTML('prediction.lucky.tip', { a: luckyPrize.num, b: luckyPrize.amount || 0 })}
          </div>
        </ProcessTip>
        <InputWrapper isFocus={isFocus}>
          <WrapInput
            id="ScheduleInput"
            classNames={{
              container: 'inputContainer',
              input: 'kc-input',
            }}
            value={number}
            onChange={e => {
              setNumber(e.target.value);
            }}
            placeholder={_t('prediction.endPrize.placeholdr')}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <WrapButton loading={loading} disabled={false} className="submit" onClick={onSubmit}>
            {_t('prediction.submit')}
          </WrapButton>
        </InputWrapper>
      </BodyWrapper>
    </Content>
  );
};

ProcessingCard.propTypes = {
  round: PropTypes.object, // 场次
  btnClickCheck: PropTypes.func.isRequired, // 操作前置登陆与否查询
  onShowTipDialog: PropTypes.func.isRequired, // 点击小问号时的回调
  onCountDownFinish: PropTypes.func.isRequired, // 倒计时结束后的回调
  isSign: PropTypes.bool.isRequired, // 用户是否报名
};

ProcessingCard.defaultProps = {
  round: {},
  btnClickCheck: () => {},
  onShowTipDialog: () => {},
  onCountDownFinish: () => {},
  isSign: false,
};

export default ProcessingCard;
