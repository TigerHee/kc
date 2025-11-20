/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICMechanismOutlined } from '@kux/icons';
import { Spin, styled, useResponsive } from '@kux/mui';
import { getKycLevel } from 'components/Account/Kyc/KycHome/config';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as ArrowRightIcon } from 'static/account/kyc/index/arrow_right.svg';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose } from 'utils/ga';
import { isTMA } from 'utils/tma/bridge';
import {
  KYC3Wrapper,
  MainLayout,
  MainLeftBox,
  MainRightBox,
  TopLayout,
  TopLeftBox,
  TopLeftTitle,
} from '../../components/commonUIs';
import FAQ from '../../components/FAQ';
import KycStatusCard from './components/KycStatusCard';
import useKyc3Status from './hooks/useKyc3Status';

const TopRightBox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const KYBIcon = styled(ICMechanismOutlined)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.text};
  @media screen and (max-width: 767px) {
    width: 16px;
    height: 16px;
  }
`;
const KYBDesc = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 2px 0 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const ArrowIcon = styled(ArrowRightIcon)`
  width: 16px;
  height: 16px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const Kyc3Home = ({ triggerType }) => {
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const dispatch = useDispatch();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const { kycInfo, kyc_id_photo_catch_type } = useSelector((state) => state.kyc);

  const [showModal, setShowModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('app');
  const [backUrl, setBackUrl] = useState('');
  const [query, setQuery] = useState({});
  const { from = '', type, backurl } = query;

  const kycLevel = useMemo(() => {
    return (
      getKycLevel(kycInfo) || { btnText: _t('ujZc9hLkSmYHhQy4CQHo6u'), level: 0, showBtn: true }
    );
  }, [kycInfo]);

  useEffect(() => {
    dispatch({ type: 'kyc/getPrivileges' });
    // 获取kyc福利信息
    dispatch({ type: 'kyc/getKYC3RewardInfo' });
  }, []);

  useEffect(() => {
    const queryStr = window.location.search?.split('?')[1];
    const _query = {};
    if (queryStr) {
      const queryArr = queryStr.split('&') || [];
      queryArr.map((item) => {
        const itemArr = item.split('=');
        const key = itemArr[0];
        const val = itemArr[1];
        _query[key] = val;
      });
    }
    setQuery(_query);
  }, []);

  useEffect(() => {
    if (backurl) {
      let _backurl = backurl;
      if (!backurl.includes('https://')) {
        _backurl = `https://${backurl}`;
      }
      if (window._CHECK_BACK_URL_IS_SAFE_(_backurl)) {
        setBackUrl(_backurl);
      }
    }
  }, [backurl]);

  useEffect(() => {
    if (from === 'advanceResult') {
      setShowModal(true);
      setCurrentRoute(type === 'success' ? 'countdown' : 'kyc1');
    }
    if (from === 'legoAdvanceResult') {
      setShowModal(true);
      setCurrentRoute('result');
      try {
        kcsensorsManualExpose(
          [],
          {
            apply_kyc_level: 'kyc1',
            current_kyc_level:
              kycLevel?.level === 0 ? 'kyc0' : kycLevel?.level === 1 ? 'kyc1' : 'kyc2',
            kyc_country_type:
              kycInfo?.regionType === 1
                ? '1OT'
                : kycInfo?.regionType === 2
                ? '2OT'
                : kycInfo?.regionType === 3
                ? 'normal'
                : 'unkonw',
            kyc_channel: 'web_lego',
            kyc_submit_result: 'success',
            kyc_id_photo_front_catch_type: kyc_id_photo_catch_type,
            kyc_id_photo_back_catch_type: kyc_id_photo_catch_type,
            kyc_liveness_catch_type: 'screen',
            kyc_submit_terminal: isH5 ? 'web_mobile' : 'web_pc',
          },
          'kyc_submit_result',
        );
      } catch (error) {}
    }
  }, [from, type, isH5]);

  // 没有kyc信息
  const isKycInfoEmpty = useMemo(() => isEmpty(kycInfo), [kycInfo]);

  // 只要用户不是审核中/已通过/假失败，就可以任意提交KYC/KYB
  const isCannotSwitchType = [
    kyc3StatusEnum.VERIFYING,
    kyc3StatusEnum.VERIFIED,
    kyc3StatusEnum.FAKE,
  ].includes(kyc3Status);

  /* 有kyc提交记录不显示切换 */
  const hiddenRightSwitch = isCannotSwitchType || isTMA();

  return (
    <Spin spinning={isKycInfoEmpty} size="small">
      <KYC3Wrapper id="kyc">
        <TopLayout>
          <TopLeftBox>
            <TopLeftTitle>{_t('kyc.certification.personal')}</TopLeftTitle>
          </TopLeftBox>
          {hiddenRightSwitch ? null : (
            <TopRightBox onClick={triggerType}>
              <KYBIcon />
              <KYBDesc>{_t('2tDn1oYBdzHNdG5Hp2kTYh')}</KYBDesc>
              <ArrowIcon />
            </TopRightBox>
          )}
        </TopLayout>

        <MainLayout>
          <MainLeftBox>
            <KycStatusCard setCurrentRoute={setCurrentRoute} setShowModal={setShowModal} />
          </MainLeftBox>
          <MainRightBox>
            <FAQ />
          </MainRightBox>
        </MainLayout>
      </KYC3Wrapper>
    </Spin>
  );
};

export default Kyc3Home;
