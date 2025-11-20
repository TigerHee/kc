/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import classnames from 'classnames';
import { useSnackbar, styled, Button } from '@kux/mui';
import { Wrapper, ContentBox } from '../../commonStyle';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import { postJsonWithPrefix } from '../../../service';
import pendingIcon from './img/pending.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 8px;
  img {
    width: 148px;
  }
  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
    letter-spacing: 0px;
    text-align: center;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0px;
    width: 100%;
    text-align: left;
    color: ${({ theme }) => theme.colors.text60};
  }
  .desc1 {
    text-align: center;
  }
`;
const NextBtn = styled(Button)`
  min-width: 220px;
  margin-top: 24px;
`;

export default ({ onNextPage, pageId, pageAfterApi }) => {
  const { isSmStyle, flowData, setInnerPageElements } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: '',
    });
  }, []);

  const onNext = async () => {
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
      });

      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
  };

  return (
    <Wrapper>
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <Container>
          <img src={pendingIcon} alt="tip" />
          <div className="title">
            <div>{_t('f0921f1e154a4000a2ac')}</div>
            <div>09:00 – 24:00 (UTC+3)</div>
          </div>
          <div className="desc desc1">{_t('e2390116fa994000acf7')}</div>
          <NextBtn onClick={onNext} size="large">
            {_t('5e456e56b9914000abd2')}
          </NextBtn>
        </Container>
      </ContentBox>
    </Wrapper>
  );
};
