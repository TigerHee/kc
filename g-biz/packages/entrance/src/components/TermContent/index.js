import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { useTheme, Button, Checkbox, Steps } from '@kux/mui';
import throttle from 'lodash/throttle';
import { getTermId } from '@tools/term';
import { get } from '@tools/request';
import {
  AgreementContainer,
  AgreementCheckBoxWrap,
  AgreementLabel,
  AgreementStep,
  AgreementContent,
  SpinLoading,
  AgreementContentFail,
  AgreementEmpty,
  AgreementBtn,
} from './styled';
import { useToast, useLang, useIsRTL } from '../../hookTool';
import { NoSSG, sentryReport, kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';

const { Step } = Steps;

// 获取协议文章内容
const getTermContent = (id) => {
  return get(`/kc-cms/helpCenter/articles?id=${id}`);
};

export const TermContent = forwardRef((props, ref) => {
  const {
    title = null,
    // 协议列表
    agreementList = [],
    // 多站点配置
    multiSiteConfig,
    // 多份协议签署，每份协议签署回调
    onSignSingle,
    // 多份协议签署，每份协议点击同意回调
    onAgreeCheck,
    // 全部完成回调
    onFinish,
    // 底部内容
    extra = null,
    // 按钮文案
    buttonText,
    // 默认从第几份协议开始，
    defaultTermIdx = 0,
  } = props;
  const theme = useTheme();
  const { t } = useLang();
  const toast = useToast();
  const isRTL = useIsRTL();

  // 是否是第一次加载
  const firstLoadRef = useRef(true);

  // 加载中
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // 当前属于第几份协议
  const [idx, setIdx] = useState(defaultTermIdx);
  const idxRef = useRef(idx);
  idxRef.current = idx;
  // 协议内容
  const [content, setContent] = useState('');
  // 是否已经阅读完当前协议
  const [hasRead, setHasRead] = useState(false);
  const hasReadRef = useRef(hasRead);
  hasReadRef.current = hasRead;
  // 同意协议复选框是否选中
  const [hasChecked, setHasChecked] = useState(false);
  // 协议内容 div 元素
  const agreementContentRef = useRef(null);

  // 点击同意协议内容
  const handleClickPrivacyAgree = () => {
    // 有 key 才上报埋点
    if (agreementList[idxRef.current]?.key) {
      kcsensorsClick([`${agreementList[idxRef.current].key}_Checkbox`, 1], {
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
      // 签署的协议 id 列表
      const userTermList = agreementList.map((item) => {
        // 如果有 termId 就不从多站点配置中获取了
        const termId = item.termId || getTermId(item.termCode, multiSiteConfig?.termConfig);
        return {
          termId,
        };
      });
      onFinish?.(userTermList);
    }
  };
  const handleReadAllTermRef = useRef(handleReadAllTerm);
  handleReadAllTermRef.current = handleReadAllTerm;

  // 点击下一页按钮
  const handleNext = () => {
    onSignSingle?.(agreementList[idxRef.current]?.termId, idxRef.current);

    // 阅读下一份
    idxRef.current += 1;
    // 未阅读完所有协议
    if (idxRef.current < agreementList.length) {
      // 有 key 才上报埋点
      if (agreementList[idxRef.current]?.key) {
        kcsensorsClick([`${agreementList[idxRef.current].key}_Nextpage`, 1]);
      }
      // 新的协议重置
      firstLoadRef.current = true;
      // 重置协议内容
      setContent('');
      // 阅读下一份协议
      setIdx(idxRef.current);
      // 重置阅读状态 & 复选框选中态
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
      // 有内容计算滚动才正确
      if (content && agreementContentRef.current && !hasReadRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = agreementContentRef.current;
        // 字体大小是 14px, 误差小于字体的一半，暂定 5px
        if (scrollHeight - (scrollTop + clientHeight) <= 5) {
          // 有 key 才上报埋点
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
    { 'trailing': true },
  );

  // 请求协议内容
  const fetchAgreement = async (id) => {
    setIsLoading(true);
    try {
      const res = await getTermContent(id);
      setContent(res?.data?.context || '');
      setIsError(false);
    } catch (err) {
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

  // 暴露给调用方
  useImperativeHandle(
    ref,
    () => {
      return {
        isError,
      };
    },
    [isError],
  );

  // 更新协议
  useEffect(() => {
    if (
      // 每次只加载一次
      firstLoadRef.current &&
      agreementList &&
      agreementList[idx] &&
      // 如果有 termId 或者没有 termId 但是有 termCode 和多站点配置
      (agreementList[idx].termId ||
        // 多站点接口返回有数据
        (multiSiteConfig?.termConfig && agreementList[idx]?.termCode))
    ) {
      // 加载过就不通过 useEffect 加载了，通过重试按钮重新加载
      firstLoadRef.current = false;
      // 有 key 才上报曝光埋点
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
    // 只判断第一次，如果默认阅读协议，是否已经是最后一个了
    handleReadAllTermRef.current();
  }, []);

  useEffect(() => {
    // 更新完协议，判断下用户是否不需要滚动就能阅读完协议
    handleScroll();
  }, [handleScroll]);

  return (
    <>
      {title}
      <AgreementContainer className="agreement-container">
        {/* 多份协议才展示进度 */}
        {agreementList.length > 1 ? (
          <AgreementStep size="small" type="simple" current={idx} className="agreement-step">
            {agreementList.map((item, itemIdx) => {
              return <Step key={item.name} title={itemIdx === idx ? item.name : null} />;
            })}
          </AgreementStep>
        ) : null}

        <div className="agreement-content">
          <div className="agreement-content-term">
            {/* ssg 无法渲染这块 */}
            <NoSSG>
              {!isError ? (
                <AgreementContent
                  ref={agreementContentRef}
                  onScroll={handleScroll}
                  data-inspector="signup-agreement-box"
                  className="agreement-box"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <AgreementContentFail className="agreement-fail">
                  {isLoading ? (
                    <SpinLoading isRTL={isRTL} spinning type="brand" size="small" />
                  ) : (
                    <>
                      <AgreementEmpty name="network-error" size="small" />
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
                </AgreementContentFail>
              )}
            </NoSSG>
          </div>

          <AgreementCheckBoxWrap
            data-inspector="signup-agreement-wrapper"
            className="agreement-checkbox"
            onClick={handleClickPrivacyAgree}
          >
            <Checkbox
              checked={hasChecked}
              checkOptions={{ type: 2, checkedType: theme?.currentTheme === 'dark' ? 2 : 1 }}
            >
              <AgreementLabel
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();
                }}
                theme={theme}
              >
                {agreementList[idx]?.desc || t('5145033235b14000af85')}
              </AgreementLabel>
            </Checkbox>
          </AgreementCheckBoxWrap>
          <AgreementBtn className="agreement-btns">
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
          </AgreementBtn>
        </div>
      </AgreementContainer>
    </>
  );
});
