/**
 * Owner: tiger@kupotech.com
 */
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { useTheme, Button } from '@kux/mui';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { postJsonWithPrefix } from '@kycCompliance/service';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import icon_light from '@kycCompliance/assets/img/light/error.svg';
import icon_dark from '@kycCompliance/assets/img/dark/error.svg';
import { Wrapper, ContentBox } from '@kycCompliance/components/commonStyle';
import { FailContent, BtnBox } from './style';
import Result from './Result';

const IMG_CONFIG = {
  light: icon_light,
  dark: icon_dark,
};

const htmlToReactParser = new Parser();

export default (props) => {
  const { _t } = useLang();
  const { pageElements } = props;
  const { currentTheme } = useTheme();
  const { isSmStyle, setInnerPageElements, onExitFlow, crossPageData, flowData } = useCommonData();
  const { questionnaire } = crossPageData;

  // 是否展示问卷答案
  const [isShowResult, setShowResult] = useState(false);
  // 问题 index
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    const onFinishFlow = async () => {
      try {
        const { transactionId, flowAfterApi, flowId } = flowData;
        await postJsonWithPrefix(flowAfterApi, { transactionId, flowId });
      } catch (error) {
        console.error(error);
      }
    };

    onFinishFlow();
  }, []);

  useEffect(() => {
    setInnerPageElements(
      isShowResult
        ? {
            ...pageElements,
            onHeaderRight: () => {
              setShowResult(false);
              setQIndex(0);
            },
            onHeaderLeft: () => {
              if (qIndex <= 0) {
                setShowResult(false);
                setQIndex(0);
                return;
              }
              setQIndex((pre) => pre - 1);
            },
            pageTitle: _t('24e9509a13d74000af23'),
          }
        : {
            ...pageElements,
            headerHidePre: true,
            pageTitle: '',
            ignoreExitModal: true,
          },
    );
  }, [isShowResult, pageElements, qIndex]);

  return isShowResult ? (
    <Result
      {...props}
      isSmStyle={isSmStyle}
      questionnaire={questionnaire}
      qIndex={qIndex}
      setQIndex={setQIndex}
      onClose={() => setShowResult(false)}
    />
  ) : (
    <Wrapper>
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <FailContent
          className={classnames({
            isSmStyle,
          })}
        >
          <div className="top">
            <img src={IMG_CONFIG[currentTheme]} alt="fail" />
            <div className="title">{_t('37d331a47b674800a163')}</div>
            <div className="desc">
              {questionnaire?.canViewAnswerAfterEvaluating ? (
                <>
                  <span>{_t('35caf4939d0b4800aa8d')}</span>
                  <span>{htmlToReactParser.parse(_t('12883fe8979a4800a198'))}</span>
                </>
              ) : (
                _t('748d121fc6cc4800a04f')
              )}
            </div>
          </div>
        </FailContent>
      </ContentBox>

      <BtnBox
        className={classnames({
          isSmStyle,
        })}
      >
        <Button onClick={onExitFlow} type="primary" size="large" fullWidth={isSmStyle}>
          {_t('0553ad651f4f4000a4b4')}
        </Button>
        {questionnaire?.canViewAnswerAfterEvaluating && (
          <Button
            onClick={() => setShowResult(true)}
            type="default"
            size="large"
            fullWidth={isSmStyle}
          >
            {_t('a95ad71811da4800a4eb')}
          </Button>
        )}
      </BtnBox>
    </Wrapper>
  );
};
