/**
 * Owner: mike@kupotech.com
 */
import {useCallback, useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {kyc3StatusEnum} from '../config';
import {KRNEventEmitter} from '@krn/bridge';

export default () => {
  const [kyc3Status, setKyc3Status] = useState(kyc3StatusEnum.UNVERIFIED);
  const [trackStatus, setTrackStatus] = useState(0);
  // kyc基础信息
  const kycInfo = useSelector(s => s.kyc.kycInfo);
  const kybInfo = useSelector(state => state.kyc.kybInfo);
  const kycClearInfo = useSelector(s => s.kyc.kycClearInfo);
  const recharged = useSelector(state => state.kyc.recharged);
  const isLogin = useSelector(state => state.app.isLogin);
  const userChange = useSelector(state => state.app.userChange);

  const [isFirstLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchAll = useCallback(async () => {
    // 登录发生变化，先清除本地持久化数据
    if (userChange) {
      setLoading(true);
      await dispatch({type: 'kyc/resetValues'});
    }
    if (isLogin) {
      // kyc 和清退状态数据
      dispatch({type: 'kyc/pullKycInfo'});
      // 是否充值/交易
      dispatch({type: 'kyc/getUserDepositFlag'});
      // 福利中心数据
      dispatch({type: 'kyc/getKYC3RewardInfo'});
      // 获取权益
      dispatch({type: 'kyc/getPrivileges'});
    }
  }, [isLogin, userChange]);

  const isShowKyb = useMemo(() => {
    // 非认证失败的才展示kyb
    return kycInfo?.type === 1 && ![2, 4].includes(kybInfo?.verifyStatus);
  }, [kycInfo, kybInfo]);

  useEffect(() => {
    if (kycInfo?.type === 1 && isLogin) {
      dispatch({
        type: 'kyc/pullKycInfo',
        payload: {type: 1},
      });
    }
  }, [kycInfo?.type, isLogin]);

  useEffect(() => {
    fetchAll();
    const subscription = KRNEventEmitter.addListener('onShow', fetchAll);
    return () => {
      subscription?.remove();
    };
  }, [fetchAll]);

  useEffect(() => {
    if (Object.keys(kycInfo).length && Object.keys(kycClearInfo).length) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    const {verifyStatus, regionType, primaryVerifyStatus} = kycInfo;
    const {clearStatus} = kycClearInfo;
    let trackState = 0;
    let _kyc3Status = kyc3StatusEnum.UNVERIFIED;
    // 显示优先级：打回状态 > 认证状态
    // 打回状态 0-无需打回 1-待打回 2-已打回
    // 待打回
    if (clearStatus === 1) {
      _kyc3Status = kyc3StatusEnum.CLEARANCE;
      trackState = 8;
    }
    // 已打回
    else if (clearStatus === 2) {
      _kyc3Status = kyc3StatusEnum.RESET;
      trackState = 9;
    }
    // 认证中断（verifyStatus=-1且primaryVerifyStatus=1）
    else if (verifyStatus === -1 && primaryVerifyStatus === 1) {
      _kyc3Status = kyc3StatusEnum.SUSPEND;
      trackState = 2;
    }
    // 未认证
    else if (verifyStatus === -1) {
      _kyc3Status = kyc3StatusEnum.UNVERIFIED;
      trackState = 1;
    }
    // 假失败（verifyStatus=5（假失败）或（verifyStatus=1且regionType!=3(假失败)））
    else if (verifyStatus === 5 || (verifyStatus === 1 && regionType !== 3)) {
      _kyc3Status = kyc3StatusEnum.FAKE;
      trackState = 4;
    }
    // 认证中（verifyStatus=0/3/6/7））
    else if ([0, 3, 6, 7].includes(verifyStatus)) {
      _kyc3Status = kyc3StatusEnum.VERIFYING;
      trackState = 3;
    }
    // 认证成功
    else if (verifyStatus === 1) {
      _kyc3Status = kyc3StatusEnum.VERIFIED;
      trackState = 6;
      if (recharged) trackState = 7;
    }
    // 认证失败
    else if ([2, 4, 8].includes(verifyStatus)) {
      _kyc3Status = kyc3StatusEnum.REJECTED;
      trackState = 5;
    }
    setKyc3Status(_kyc3Status);
    setTrackStatus(trackState);
  }, [kycInfo, kycClearInfo, recharged]);

  return {
    kyc3StatusEnum,
    kyc3Status,
    trackStatus, // 用于埋点的状态
    isFirstLoading,
    fetchAll,
    isShowKyb,
    kycInfo,
    kybInfo,
  };
};
