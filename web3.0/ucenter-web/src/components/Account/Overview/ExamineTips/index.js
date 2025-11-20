/**
 * Owner: lena@kupotech.com
 */
import history from '@kucoin-base/history';
import remoteTools from '@kucoin-biz/tools';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { Alert, styled, useResponsive } from '@kux/mui';
import { showDateTimeByZone } from 'helper';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import { ReactComponent as ArrowIcon } from 'static/account/overview/arrow.svg';
import { _tHTML } from 'tools/i18n';
import { getPageId, kcsensorsManualExpose } from 'utils/ga';
import storage from 'utils/storage';
import H5 from './H5';

const { getTermId, getTermUrl } = remoteTools;

const ExtendAlert = styled(Alert)`
  width: 100%;
  font-weight: 400;
  border-radius: 0;
  .KuxAlert-icon {
    position: relative;
    top: 2px;
  }
  .KuxAlert-description {
    margin-top: 0;
    color: ${(props) => props.theme.colors.secondary};
  }
`;
const Tips = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: ${(props) => (props?.kycClearStatus === 1 ? '6px' : '0px')}
    ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    margin: 0;
  }
`;
const KycLevel = styled.div`
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.secondary};
  strong {
    font-weight: 600;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    margin: 0;
  }
`;
const UserAgreement = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.secondary};
  strong {
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
  }
  margin-bottom: 10px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    margin: 0;
  }
`;
const Btn = styled.div`
  padding: 2px 8px 2px 12px;
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  cursor: pointer;
  border-radius: 20px;
  color: ${(props) => props.theme.colors.secondary};
  border: ${(props) => `1px solid ${props.theme.colors.secondary}`};
  margin-left: ${(props) => (props.kycClearStatus === 1 ? '0px' : '8px')};
  & > div {
    display: flex;
    align-items: center;
    svg {
      flex-shrink: 0;
      width: 12px;
      height: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 8px;
  }
`;
const Wrapper = styled.div``;

const Content = ({ notice, isH5, url }) => {
  const Button = () => {
    return isH5 ? null : (
      <Btn
        data-inspector="examine-tips-btn"
        kycClearStatus={notice?.kycClearStatus}
        onClick={() => {
          kcsensorsManualExpose(
            ['topMessage', '1'],
            {
              guideType: 'EXAMINE_MESSAGE',
              name: 'card',
              reportType: 'click',
              guideColor: notice?.displayType,
              page_id: getPageId(),
            },
            'publicGuideEvent',
          );
          history.push('/account/kyc?app_line=UCENTER&source=DEFAULT');
        }}
      >
        <div>
          {_t('3Dn54WPNF5VzE5PZNVQ42C')}
          <ArrowIcon />
        </div>
      </Btn>
    );
  };

  //计算打回结束时间 - 当前时间 > 1年
  const isOverOneYear = moment.duration(moment(notice.kycClearAt).diff(moment())).asYears() >= 1;

  return notice?.kycClearStatus === 1 ? (
    <>
      {notice?.topMessage && !isH5 ? (
        <Tips kycClearStatus={notice?.kycClearStatus}>{notice?.topMessage}</Tips>
      ) : null}
      <KycLevel>
        <strong>{_t('2vW7TMpb66typtNx1LDyNt')}：</strong>
        {_t('hXuuxGgQZ3pYpPEhtXFepB')}
        {isOverOneYear
          ? _t('262ee07aefe84000a800')
          : _tHTML('ugX6gMQu3aTn5fgBnWUC2o', {
              date: showDateTimeByZone(notice?.kycClearAt, 'YYYY/MM/DD HH:mm:ss', 0),
            })}
      </KycLevel>
      <UserAgreement
        onClick={(e) => {
          if (e?.target?.nodeName?.toLocaleUpperCase() === 'STRONG') {
            const newWindow = window.open(url);
            if (newWindow) {
              newWindow.opener = null;
            }
          }
        }}
      >
        {_tHTML('s7bVrYwynBGUQWmFfoTnsA')}
      </UserAgreement>
      <Button />
    </>
  ) : (
    <Tips>
      {_t('g3qDpMcCoxeKi1vbF8pmJ5')}
      <Button />
    </Tips>
  );
};
const ExamineTips = () => {
  const [showH5Tips, setShowH5Tips] = useState(true);
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const [show, setShow] = useState(false);
  const restrictDialogStatus = useSelector((state) => state.$header_header?.restrictDialogStatus);
  const [isClosed, setIsClosed] = useState(false);
  const { examinInfo: notice } = useSelector((state) => state.accountOverview);
  const dispatch = useDispatch();

  const { multiSiteConfig } = useMultiSiteConfig();

  useEffect(() => {
    dispatch({ type: 'accountOverview/queryExamine' });
  }, []);

  useEffect(() => {
    if (restrictDialogStatus?.bizType && restrictDialogStatus?.bizType === 'EXAMINE_DIALOG') {
      if (restrictDialogStatus?.visible) {
        storage.removeItem('isClosedDialog');
      } else {
        storage.setItem('isClosedDialog', true);
      }
      //登录进入用户中心首页
      setShow(
        !restrictDialogStatus?.visible && !isClosed && [1, 2].includes(notice?.kycClearStatus),
      );
    } else {
      setShow([1, 2].includes(notice?.kycClearStatus));
    }
  }, [restrictDialogStatus, isClosed, notice]);

  useEffect(() => {
    if (show) {
      kcsensorsManualExpose(
        ['topMessage', '1'],
        {
          guideType: 'EXAMINE_MESSAGE',
          name: 'card',
          reportType: 'show',
          guideColor: notice?.displayType,
          page_id: getPageId(),
        },
        'publicGuideEvent',
      );
    }
  }, [show, notice?.displayType]);

  const onClose = () => {
    kcsensorsManualExpose(
      ['topMessage', '1'],
      {
        guideType: 'EXAMINE_MESSAGE',
        name: 'card',
        reportType: 'close',
        guideColor: notice?.displayType,
        page_id: getPageId(),
      },
      'publicGuideEvent',
    );
    setIsClosed(true);
  };

  const url = useMemo(() => {
    const _url = getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig));
    return _url;
  }, [multiSiteConfig?.termConfig]);

  return show ? (
    isH5 ? (
      showH5Tips ? (
        <H5
          closable={true}
          closeShow={() => {
            kcsensorsManualExpose(
              ['topMessage', '1'],
              {
                guideType: 'EXAMINE_MESSAGE',
                name: 'card',
                reportType: 'close',
                guideColor: notice?.displayType,
                page_id: getPageId(),
              },
              'publicGuideEvent',
            );
            setShowH5Tips(false);
            setIsClosed(true);
          }}
          url={url}
          notice={{
            title: _t('aGLiVVCYQQc3qbqz9Rugmb'),
            topMessage: <Content notice={notice} isH5={isH5} url={url} />,
            adminTips: notice?.topMessage,
            kycClearStatus: notice?.kycClearStatus,
            kycClearAt: notice?.kycClearAt,
          }}
        />
      ) : null
    ) : (
      <ExtendAlert
        data-inspector="examine-tips"
        onClose={onClose}
        closable={true}
        type="error"
        description={
          <Wrapper>
            <Content notice={notice} isH5={isH5} url={url} />
          </Wrapper>
        }
      />
    )
  ) : null;
};
export default ExamineTips;
