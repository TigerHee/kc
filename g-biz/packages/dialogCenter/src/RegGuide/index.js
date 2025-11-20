/**
 * Owner: willen@kupotech.com
 */
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { kcsensorsManualTrack } from '@utils/sensors';
import addLangToPath from '@tools/addLangToPath';
import { useTranslation } from '@tools/i18n';
import { Dialog, styled, useTheme } from '@kux/mui';
import storage from '@utils/storage';
import { Parser } from 'html-to-react';
import useRealInteraction from '@hooks/useRealInteraction';
import useIpCountryCode from '@hooks/useIpCountryCode';
import useMktVisible from '@hooks/useMktVisible';
import { useCompliantShow } from '@packages/compliantCenter';
import reg_guide_1 from '../../static/reg_guide_1.png';
import reg_guide_1_dark from '../../static/reg_guide_1_dark.png';
import { tenantConfig } from '../tenantConfig';

const ExDialog = styled(Dialog)`
  .KuxDialog-body {
    margin: 0 16px;
  }
  .KuxDialog-content {
    padding: 0;
    margin-top: -90px;
    overflow: hidden;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .KuxModalFooter-root {
    padding: 24px 32px 32px;
  }
`;

const RegGuideWrapper = styled.div`
  text-align: center;
  font-size: 0;
`;
const Banner1 = styled.img`
  width: 100%;
  pointer-events: none;
  user-select: none;
  margin-bottom: 20px;
`;

const Title = styled.h4`
  margin: 0 32px 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
`;

const Desc = styled.p`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0 32px;
  > span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 18px;
  }
`;

const htmlToReactParser = new Parser();

// 英国 香港 IP 用户禁止注册引导弹窗
const HOME_PAGE_SIGNUP_GUIDE_SPM = 'compliance.homepage.signupGuide.1';

const RegGuide = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const dispatch = useDispatch();
  const [textJson, setTextJson] = useState({});
  const [visible, setVisible] = useState(false);
  const realInteraction = useRealInteraction();
  const ipCountryCode = useIpCountryCode();
  const { showMktContent } = useMktVisible();
  const { currentTheme } = useTheme();
  // 英国、香港 ip, 返回 false, 不展示注册引导弹窗
  const showSignUpGuide = useCompliantShow(HOME_PAGE_SIGNUP_GUIDE_SPM);

  useEffect(() => {
    const lastReadTimestamp = storage.getItem('REG_GUIDE_DIALOG_SHOW_TIMESTAMP') || 0;
    // 7天弹一次
    const durationTime = 7 * 24 * 60 * 60 * 1000;
    if (
      realInteraction.pass &&
      // 访问间隔频率检查
      Date.now() - lastReadTimestamp > durationTime
    ) {
      (async () => {
        // 非禁止弹窗的ip 且 展业中台判断可展示 才请求弹窗文案信息并展示
        if (tenantConfig.isShowRegGuide && showSignUpGuide && showMktContent) {
          const data = await dispatch({ type: '$dialog_center/getRegGuideText' });
          if (data?.properties?.[0]?.backupValues) {
            setTextJson(data.properties[0]);
            storage.setItem('REG_GUIDE_DIALOG_SHOW_TIMESTAMP', Date.now());
            setVisible(true);
          }
        }
      })();
    }
  }, [realInteraction.pass, ipCountryCode, showMktContent, showSignUpGuide, dispatch]);

  useEffect(() => {
    if (visible) {
      // 第一屏曝光
      kcsensorsManualTrack({ spm: ['defaultPop', '1'], data: { contentType: 'register' } });
    }
  }, [visible]);

  const handleCancel = () => {
    // 第一屏点离开
    kcsensorsManualTrack(
      { spm: ['defaultPop', 'leave'], data: { contentType: 'register' } },
      'page_click',
    );
    setVisible(false);
  };

  const handleConfirm = () => {
    // 第一屏点继续
    kcsensorsManualTrack(
      { spm: ['defaultPop', 'countinue'], data: { contentType: 'register' } },
      'page_click',
    );
    if (textJson?.jumpUrl) {
      window.location.href = addLangToPath(textJson.jumpUrl, language);
    } else {
      setVisible(false);
    }
  };

  return (
    <ExDialog
      title={null}
      cancelText={null}
      okText={textJson?.backupValues?.firstWindowBtnA}
      centeredFooterButton
      open={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      data-inspector="inspector_signup_guide_dialog"
    >
      <RegGuideWrapper>
        <Banner1 src={currentTheme === 'dark' ? reg_guide_1_dark : reg_guide_1} />
        <Title>{textJson?.backupValues?.firstWindowTitleA}</Title>
        <Desc>
          {htmlToReactParser.parse(textJson?.backupValues?.firstWindowDscA?.replace('\n', '<br>'))}
        </Desc>
      </RegGuideWrapper>
    </ExDialog>
  );
};

export default RegGuide;
