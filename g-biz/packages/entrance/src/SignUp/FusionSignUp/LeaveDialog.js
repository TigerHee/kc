/**
 * Owner: willen@kupotech.com
 */

import React, { useEffect, useState, useRef } from 'react';

import { Checkbox, Dialog, styled, useTheme } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import useMktVisible from '@hooks/useMktVisible';
import { useCompliantShow } from '@packages/compliantCenter';
import reg_leave_pop_1 from '../../../static/reg_leave_pop_1.png';
import reg_leave_pop_1_dark from '../../../static/reg_leave_pop_1_dark.png';
import reg_leave_pop_2 from '../../../static/reg_leave_pop_2.png';
import reg_leave_pop_2_dark from '../../../static/reg_leave_pop_2_dark.png';
import { useLang } from '../../hookTool';
import { getRegGuideTextApi } from '../service';
import { SIGNUP_LEAVE_DIALOG_SPM } from '../constants';

const CheckboxGroup = Checkbox.Group;

const ExDialog = styled(Dialog)`
  .KuxModalHeader-root {
    padding: 36px 32px 16px;
  }
  .KuxDialog-content {
    overflow: unset;
  }
  .KuxModalFooter-root {
    padding: 28px 32px 32px;
  }
`;

const SubTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Desc = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 4px;
  > span {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CenterDesc = styled(Desc)`
  display: block;
  text-align: center;
  margin-bottom: 0;
  line-height: 150%;
`;

const BannerBox = styled.div`
  position: relative;
  height: 250px;
  margin: 16px -32px -20px;
`;

const Banner = styled.img`
  position: absolute;
  width: 400px;
  height: 222px;
  left: 0;
  top: 0;
  pointer-events: none;
`;
const Banner2 = styled.img`
  width: 180px;
  height: 180px;
  display: block;
  margin: -57px auto 24px;
`;

const ExCheckboxGroup = styled(CheckboxGroup)`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  .KuxCheckbox-checked .KuxCheckbox-inner {
    background: ${({ theme }) => theme.colors.text} !important;
    border-color: ${({ theme }) => theme.colors.text} !important;
  }
  label {
    font-size: 16px;
    font-weight: 400;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text60};
    margin-right: 0 !important;
    display: flex;
    align-items: flex-start;
    .KuxCheckbox-checkbox {
      top: 2px;
    }
    .KuxCheckbox-checkbox + span {
      line-height: unset;
    }
    ::after {
      content: unset;
    }
  }
`;

const StepOne = styled.div``;
const StepTwo = styled.div``;
const StepThree = styled.div``;

function LeaveDialog({ fromDrawer }) {
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(3); // 展业中台接口返回的营销弹窗展示，从严限制，接口未返回或失败，不展示第一 二屏的营销内容
  const [selectList, setSelectList] = useState([]);
  const [cacheLink, setCacheLink] = useState('');
  const [guideTextJson, setGuideTextJson] = useState(null);
  const { showMktContent } = useMktVisible();
  const { t } = useLang();
  const { currentTheme } = useTheme();

  const htmlToReactParser = useRef(null);
  // 英国、香港 ip, 返回 false, 不展示挽留弹窗
  const showLeaveDialog = useCompliantShow(SIGNUP_LEAVE_DIALOG_SPM);

  const options = [
    { label: t('vA9iM7q8WsXZWfEe1XizF8'), value: 'processToLong' },
    { label: t('g773PFZYw58q4ZUuqdDrPj'), value: 'noVerifyCode' },
    { label: t('2JzY9SiLvWogZi68G2qqLQ'), value: 'phoneCannot' },
    { label: t('dwjZ74rY2HmYkQpovBS7sA'), value: 'accountCannotRegister' },
    { label: t('aGBe5VMWDK3Pq4N4AXBVyu'), value: 'haveOtherAccountAlready' },
    { label: t('mRrnmAmfuwpQN727cjqpGV'), value: 'other' },
  ];

  const handleClickLogo = (e) => {
    e.preventDefault();
    setCacheLink(e?.currentTarget?.getAttribute?.('href'));
    setVisible(true);
  };

  const closeAndResetData = () => {
    setVisible(false);
    setStep(1);
    setSelectList([]);
  };

  const handleClose = () => {
    if (step === 1) {
      kcsensorsManualTrack({ spm: ['leavePop', 'leave'] }, 'page_click');
      // admin接口文案获取成功，跳到第2屏；获取失败，跳到第3屏
      setStep(guideTextJson ? 2 : 3);
    } else if (step === 2) {
      kcsensorsManualTrack({ spm: ['leavePopSecond', 'leave'] }, 'page_click');
      setStep(3);
    } else {
      kcsensorsManualTrack({ spm: ['leavePopThird', 'leave'] }, 'page_click');
      closeAndResetData();
      if (cacheLink) window.location.href = cacheLink;
    }
  };
  const handleOk = () => {
    closeAndResetData();
    if (step === 1) {
      kcsensorsManualTrack({ spm: ['leavePop', 'countinue'] }, 'page_click');
    } else if (step === 2) {
      kcsensorsManualTrack({ spm: ['leavePopSecond', 'countinue'] }, 'page_click');
    } else {
      kcsensorsManualTrack(
        {
          spm: ['leavePopThird', '3'],
          data: { contentType: selectList ? selectList.join(',') : '' },
        },
        'page_click',
      );
      // 延迟跳转，确保埋点埋上了
      setTimeout(() => {
        if (cacheLink) window.location.href = cacheLink;
      }, 100);
    }
  };

  useEffect(() => {
    // 注册抽屉不加载挽留弹窗
    if (!fromDrawer) {
      (async () => {
        // 非禁止弹窗的ip才加载弹窗
        if (showLeaveDialog) {
          setLoad(true);
        }
      })();
    }
  }, [fromDrawer, showLeaveDialog]);

  useEffect(() => {
    // 展业中台接口返回的营销弹窗展示，跳转到第一屏
    if (showMktContent) {
      setStep(1); // 显示营销弹窗，跳转到第一屏;
    }
  }, [showMktContent]);

  useEffect(() => {
    let headerLogo;
    // 点击header logo才展示弹窗
    if (load) headerLogo = document.querySelector('#hook_nav_links a');
    headerLogo && headerLogo.addEventListener('click', handleClickLogo);
    return () => {
      headerLogo && headerLogo.removeEventListener('click', handleClickLogo);
    };
  }, [load]);

  useEffect(() => {
    if (visible) {
      if (step === 1) {
        kcsensorsManualTrack({ spm: ['leavePop', '1'] });
      } else if (step === 2) {
        kcsensorsManualTrack({ spm: ['leavePopSecond', '1'] });
      } else {
        kcsensorsManualTrack({ spm: ['leavePopThird', '1'] });
      }
    }
  }, [visible, step]);

  useEffect(() => {
    async function fetchGuideText() {
      try {
        const { data } = await getRegGuideTextApi({
          businessLine: 'ucenter',
          codes: 'web202312homepagePop',
        });
        if (data?.properties?.[0]?.backupValues) {
          setGuideTextJson(data.properties[0]);
        }
      } catch (error) {
        console.error('getRegGuideText failed 1:', error);
      }
    }
    if (!guideTextJson) {
      fetchGuideText();
    }
  }, [guideTextJson]);

  useEffect(() => {
    import('html-to-react')
      .then((module) => {
        htmlToReactParser.current = new module.Parser();
      })
      .catch((err) => {
        console.error('load html-to-react failed', err);
      });
  }, []);

  return load ? (
    <ExDialog
      title={[t('feSy6C8S9XEixvkotkQg6x'), '', t('45uEPk2KTeqbbM6mzXs7ey')][step - 1]}
      open={visible}
      onCancel={handleClose}
      okText={
        [
          t('sAhi5Vt9gCrZbL6rBXRJjb'),
          guideTextJson?.backupValues?.firstWindowBtnA,
          t('oRkQYWD36iy3TjEGs1cFdj'),
        ][step - 1]
      }
      onOk={handleOk}
      cancelText={null}
      centeredFooterButton
      data-inspector="inspector_signup_leave_dialog"
    >
      {step === 1 ? (
        <StepOne>
          <Desc>
            <Trans i18nKey="t1LYgcH8CfDDbuPYJsCqpB" ns="entrance">
              _<span>_</span>_
            </Trans>
          </Desc>
          <Desc>
            <Trans i18nKey="j9HyzmwqMJX9QaeaYSLmGP" ns="entrance">
              _<span>_</span>_
            </Trans>
          </Desc>
          <BannerBox>
            <Banner
              src={currentTheme === 'dark' ? reg_leave_pop_1_dark : reg_leave_pop_1}
              alt="reg_leave_pop_1"
            />
          </BannerBox>
        </StepOne>
      ) : step === 2 ? (
        <StepTwo>
          <Banner2
            src={currentTheme === 'dark' ? reg_leave_pop_2_dark : reg_leave_pop_2}
            alt="reg_leave_pop_2"
          />
          <SubTitle>{guideTextJson?.backupValues?.firstWindowTitleA}</SubTitle>
          <CenterDesc>
            {htmlToReactParser.current &&
              htmlToReactParser.current.parse(
                guideTextJson?.backupValues?.firstWindowDscA?.replace('\n', '<br>'),
              )}
          </CenterDesc>
        </StepTwo>
      ) : (
        <StepThree>
          <ExCheckboxGroup
            checkOptions={{ type: 1, checkedType: 1 }}
            value={selectList}
            options={options}
            size="basic"
            onChange={(val) => setSelectList(val)}
          />
        </StepThree>
      )}
    </ExDialog>
  ) : null;
}

export default LeaveDialog;
