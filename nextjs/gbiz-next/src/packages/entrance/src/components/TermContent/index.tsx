/**
 * Owner: sean.shi@kupotech.com
 */
import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { Button, Checkbox, Spin, Steps, Empty, useTheme } from '@kux/mui';
import throttle from 'lodash-es/throttle';
import { getTermId } from 'tools/term';
import { pull } from 'tools/request';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { useToast, useLang, useIsRTL } from '../../hookTool';
import { NoSSG, sentryReport } from '../../common/tools';
import styles from './index.module.scss';

const { Step } = Steps;

// 获取协议文章内容
const getTermContent = (id: string) => {
  return pull(`/kc-cms/helpCenter/articles?id=${id}`);
};

interface TermContentProps {
  title?: React.ReactNode;
  agreementList?: any[];
  multiSiteConfig?: any;
  onSignSingle?: (termId: string, idx: number) => void;
  onAgreeCheck?: (termId: string, idx: number) => void;
  onFinish?: (userTermList: any[]) => void;
  extra?: React.ReactNode;
  buttonText?: string;
  defaultTermIdx?: number;
}

export const TermContent = forwardRef<any, TermContentProps>((props, ref) => {
  const {
    title = null,
    agreementList = [],
    multiSiteConfig,
    onSignSingle,
    onAgreeCheck,
    onFinish,
    extra = null,
    buttonText,
    defaultTermIdx = 0,
  } = props;
  const { t } = useLang();
  const toast = useToast();
  const isRTL = useIsRTL();
  const theme = useTheme();

  const firstLoadRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [idx, setIdx] = useState(defaultTermIdx);
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const [content, setContent] = useState('');
  const [hasRead, setHasRead] = useState(false);
  const hasReadRef = useRef(hasRead);
  hasReadRef.current = hasRead;
  const [hasChecked, setHasChecked] = useState(false);
  const agreementContentRef = useRef<HTMLDivElement>(null);

  // 点击同意协议内容
  const handleClickPrivacyAgree = () => {
    if (agreementList[idxRef.current]?.key) {
      trackClick([`${agreementList[idxRef.current].key}_Checkbox`, 1], {
        ReadComplete: hasReadRef.current ? 1 : 0,
      });
    }
    onAgreeCheck?.(agreementList[idxRef.current]?.termId, idxRef.current);
    if (!hasReadRef.current) {
      toast.success(t('e6b7f8dbf7b54800a038'));
      return;
    }
    setHasChecked((prev) => !prev);
  };

  // 阅读完所有协议，执行的回调
  const handleReadAllTerm = () => {
    if (idxRef.current >= agreementList.length) {
      const userTermList = agreementList.map((item) => {
        const termId = item.termId || getTermId(item.termCode, multiSiteConfig?.termConfig);
        return { termId };
      });
      onFinish?.(userTermList);
    }
  };
  const handleReadAllTermRef = useRef(handleReadAllTerm);
  handleReadAllTermRef.current = handleReadAllTerm;

  // 点击下一页按钮
  const handleNext = () => {
    onSignSingle?.(agreementList[idxRef.current]?.termId, idxRef.current);
    idxRef.current += 1;
    if (idxRef.current < agreementList.length) {
      if (agreementList[idxRef.current]?.key) {
        trackClick([`${agreementList[idxRef.current].key}_Nextpage`, 1]);
      }
      firstLoadRef.current = true;
      setContent('');
      setIdx(idxRef.current);
      setHasRead(false);
      setHasChecked(false);
      if (agreementContentRef.current) {
        agreementContentRef.current.scrollTop = 0;
      }
      return;
    }
    handleReadAllTerm();
  };

  // 监听滚动
  const handleScroll = throttle(
    () => {
      if (content && agreementContentRef.current && !hasReadRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = agreementContentRef.current;
        if (scrollHeight - (scrollTop + clientHeight) <= 5) {
          if (agreementList[idxRef.current]?.key) {
            kcsensorsManualTrack({
              spm: [`${agreementList[idxRef.current].key}_ReadComplete`, 1],
            });
          }
          setHasRead(true);
        }
      }
    },
    100,
    { trailing: true },
  );

  // 请求协议内容
  const fetchAgreement = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await getTermContent(id);
      setContent(res?.data?.context || '');
      setIsError(false);
    } catch (err: any) {
      setContent('');
      setIsError(true);
      sentryReport({
        level: 'warning',
        message: `fetch agreement error: ${err?.message}, id: ${id}`,
        tags: {
          errorType: 'signup_agreement_error',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAgreementRef = useRef(fetchAgreement);
  fetchAgreementRef.current = fetchAgreement;

  useImperativeHandle(
    ref,
    () => ({
      isError,
    }),
    [isError],
  );

  useEffect(() => {
    if (
      firstLoadRef.current &&
      agreementList &&
      agreementList[idx] &&
      (agreementList[idx].termId ||
        (multiSiteConfig?.termConfig && agreementList[idx]?.termCode))
    ) {
      firstLoadRef.current = false;
      if (agreementList[idx].key) {
        kcsensorsManualTrack({
          spm: [agreementList[idx].key, 1],
        });
      }
      const termId =
        agreementList[idx].termId ||
        getTermId(agreementList[idx].termCode, multiSiteConfig?.termConfig);
      fetchAgreementRef.current(termId);
    }
  }, [agreementList, idx, multiSiteConfig?.termConfig]);

  useEffect(() => {
    handleReadAllTermRef.current();
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <>
      {title}
      <div className={clsx(styles.agreementContainer)}>
        {agreementList.length > 1 ? (
          <Steps size="small" type="simple" current={idx} className={clsx(styles.agreementStep)}>
            {agreementList.map((item, itemIdx) => (
              <Step key={item.name} title={itemIdx === idx ? item.name : null} />
            ))}
          </Steps>
        ) : null}

        <div className={clsx(styles.agreementContentWrap)}>
          <div className={clsx(styles.agreementContentTerm)}>
            <NoSSG>
              {!isError ? (
                <div
                  ref={agreementContentRef}
                  onScroll={handleScroll}
                  data-inspector="signup-agreement-box"
                  className={clsx(styles.agreementContent, 'agreement-box')}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className={clsx(styles.agreementContentFail, 'agreement-fail')}>
                  {isLoading ? (
                    <Spin
                      className={clsx(styles.spinLoading)}
                      spinning
                      type="brand"
                      size="small"
                    />
                  ) : (
                    <>
                      <Empty className={clsx(styles.agreementEmpty)} name="network-error" size="small" />
                      <Button
                        size="small"
                        onClick={() => {
                          if (agreementList && agreementList[idx]) {
                            const termId =
                              agreementList[idx].termId ||
                              getTermId(agreementList[idx].termCode, multiSiteConfig?.termConfig);
                            fetchAgreement(termId);
                          }
                        }}
                      >
                        {t('1e66ea4209914800a9de')}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </NoSSG>
          </div>

          <div
            data-inspector="signup-agreement-wrapper"
            className={clsx(styles.agreementCheckBoxWrap, 'agreement-checkbox')}
            onClick={handleClickPrivacyAgree}
          >
            <Checkbox
              checked={hasChecked}
              checkOptions={{ type: 2, checkedType: theme?.currentTheme === 'dark' ? 2 : 1 }}
            >
              <span
                className={clsx(styles.agreementLabel)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();
                }}
              >
                {agreementList[idx]?.desc || t('5145033235b14000af85')}
              </span>
            </Checkbox>
          </div>
          <div className={clsx(styles.agreementBtn, 'agreement-btns')}>
            <Button
              fullWidth
              size="large"
              disabled={!(hasRead && hasChecked)}
              onClick={handleNext}
              data-inspector="signup_agreement_btn"
            >
              {buttonText || t('cc522478ba2a4800a6e6')}
            </Button>
            {extra}
          </div>
        </div>
      </div>
    </>
  );
});

export default TermContent;