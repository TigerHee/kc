/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import { Checkbox, Dialog, useTheme } from '@kux/mui';
import { Trans } from 'tools/i18n';
import { kcsensorsManualTrack } from 'tools/sensors';
import useMktVisible from 'hooks/useMktVisible';
import { useCompliantShow } from 'packages/compliantCenter';
import reg_leave_pop_1 from '../../../static/reg_leave_pop_1.png';
import reg_leave_pop_1_dark from '../../../static/reg_leave_pop_1_dark.png';
import reg_leave_pop_2 from '../../../static/reg_leave_pop_2.png';
import reg_leave_pop_2_dark from '../../../static/reg_leave_pop_2_dark.png';
import { useHtmlToReact, useLang } from '../../hookTool';
import { SIGNUP_LEAVE_DIALOG_SPM } from '../constants';
import { getClientPropertyByCodeUsingGet1 } from '../../api/growth-config'
import styles from './index.module.scss';

const CheckboxGroup = Checkbox.Group;

interface LeaveDialogProps {
  fromDrawer?: boolean;
}

interface GuideTextJson {
  backupValues?: {
    firstWindowBtnA?: string;
    firstWindowTitleA?: string;
    firstWindowDscA?: string;
  };
}

interface HtmlToReactParser {
  parse: (html: string) => React.ReactNode;
}

const LeaveDialog: React.FC<LeaveDialogProps> = ({ fromDrawer }) => {
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(3); // 展业中台接口返回的营销弹窗展示，从严限制，接口未返回或失败，不展示第一 二屏的营销内容
  const [selectList, setSelectList] = useState<string[]>([]);
  const [cacheLink, setCacheLink] = useState('');
  const [guideTextJson, setGuideTextJson] = useState<GuideTextJson | null>(null);
  const { showMktContent } = useMktVisible();
  const { t } = useLang();
  const { currentTheme } = useTheme();

  const htmlToReactParser = useRef<HtmlToReactParser | null>(null);
  // 英国、香港 ip, 返回 false, 不展示挽留弹窗
  const showLeaveDialog = useCompliantShow(SIGNUP_LEAVE_DIALOG_SPM);

  const { eles: guideTextDesc } = useHtmlToReact({
    html: guideTextJson?.backupValues?.firstWindowDscA?.replace('\n', '<br>') || '',
  });

  const options = [
    { label: t('vA9iM7q8WsXZWfEe1XizF8'), value: 'processToLong' },
    { label: t('g773PFZYw58q4ZUuqdDrPj'), value: 'noVerifyCode' },
    { label: t('2JzY9SiLvWogZi68G2qqLQ'), value: 'phoneCannot' },
    { label: t('dwjZ74rY2HmYkQpovBS7sA'), value: 'accountCannotRegister' },
    { label: t('aGBe5VMWDK3Pq4N4AXBVyu'), value: 'haveOtherAccountAlready' },
    { label: t('mRrnmAmfuwpQN727cjqpGV'), value: 'other' },
  ];

  const handleClickLogo = (e: Event) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    setCacheLink(target?.getAttribute?.('href') || '');
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
        'page_click'
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
        const { data } = await getClientPropertyByCodeUsingGet1({
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
      .then(module => {
        const ParserClass = module.Parser as any;
        htmlToReactParser.current = new ParserClass() as HtmlToReactParser;
      })
      .catch(err => {
        console.error('load html-to-react failed', err);
      });
  }, []);

  return load ? (
    <Dialog
      title={[t('feSy6C8S9XEixvkotkQg6x'), '', t('45uEPk2KTeqbbM6mzXs7ey')][step - 1]}
      open={visible}
      onCancel={handleClose}
      okText={
        [t('sAhi5Vt9gCrZbL6rBXRJjb'), guideTextJson?.backupValues?.firstWindowBtnA, t('oRkQYWD36iy3TjEGs1cFdj')][
          step - 1
        ]
      }
      onOk={handleOk}
      cancelText={null}
      centeredFooterButton
      data-inspector="inspector_signup_leave_dialog"
      className={styles.exDialog}
    >
      {step === 1 ? (
        <div className={styles.stepOne}>
          <p className={styles.desc}>
            <Trans i18nKey="t1LYgcH8CfDDbuPYJsCqpB" ns="entrance">
              _<span>_</span>_
            </Trans>
          </p>
          <p className={styles.desc}>
            <Trans i18nKey="j9HyzmwqMJX9QaeaYSLmGP" ns="entrance">
              _<span>_</span>_
            </Trans>
          </p>
          <div className={styles.bannerBox}>
            <img
              className={styles.banner}
              src={currentTheme === 'dark' ? reg_leave_pop_1_dark : reg_leave_pop_1}
              alt="reg_leave_pop_1"
            />
          </div>
        </div>
      ) : step === 2 ? (
        <div className={styles.stepTwo}>
          <img
            className={styles.banner2}
            src={currentTheme === 'dark' ? reg_leave_pop_2_dark : reg_leave_pop_2}
            alt="reg_leave_pop_2"
          />
          <h3 className={styles.subTitle}>{guideTextJson?.backupValues?.firstWindowTitleA}</h3>
          <div className={styles.centerDesc}>
            {guideTextDesc}
          </div>
        </div>
      ) : (
        <div className={styles.stepThree}>
          <CheckboxGroup
            checkOptions={{ type: 1, checkedType: 1 }}
            value={selectList}
            options={options}
            size="basic"
            onChange={(val: string[]) => setSelectList(val)}
            className={styles.exCheckboxGroup}
          />
        </div>
      )}
    </Dialog>
  ) : null;
};

export default LeaveDialog;
