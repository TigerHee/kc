/**
 * Owner: judith.zhu@kupotech.com
 */

// 资产证明详情
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { trackClickSpm } from 'utils/gaTrack';
import config from 'config';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withRouter } from 'components/Router';
import { Row, Col, Table, Button, Spin } from '@kufox/mui';
import { ConfirmOutlined } from '@kufox/icons';
import { useColor, useMediaQuery } from '@kufox/mui';
import BreadCrumbs from 'components/KcBreadCrumbs';
import CoinPrecision from 'components/common/CoinPrecision';
import DetailDialog from '../Default/DetailDialog';
import { audithProgress, validateProgress } from './config';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { styled } from '@kufox/mui';
import styles from './style.less';
import { push } from 'src/utils/router';
import { showDateTimeByZoneEight } from 'src/helper';
import { getUrl } from 'src/services/trade2.0/por';

const { v2ApiHosts } = config;
const host = v2ApiHosts.WEB;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin: 0 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 23px;
  flex-wrap: wrap;
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 32px;
    line-height: 38px;
    ${({ theme }) => theme.breakpoints.down('md')} {
      margin-bottom: 16px;
    }
  }
  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    line-height: 19px;
    cursor: pointer;
  }
`;

const Audition = styled.div`
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 4px;
  padding: 30px 28px;
  margin-top: 26px;
  color: ${({ theme }) => theme.colors.text};
  div {
    display: flex;
    span {
      &:first-of-type {
        flex-shrink: 0;
        margin-right: 16px;
        ${({ theme }) => theme.breakpoints.down('lg')} {
          flex-basis: 20%;
        }
        ${({ theme }) => theme.breakpoints.down('md')} {
          flex-basis: 30%;
        }
      }
      display: inline-block;
      vertical-align: text-top;
      word-break: break-word;
    }
  }
`;

const AuditionResult = styled.div`
  h2 {
    margin: 30px 0 15px 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 18px;
    line-height: 130%;
  }
  p {
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    line-height: 19px;
    span {
      color: ${({ theme }) => theme.colors.primary};
      word-break: break-all;
    }
  }
`;

const Descriotions = ({ descriptions = [] }) => {
  return descriptions.map((item, index) => (
    <div className={styles.description} key={item?.title}>
      <i>{index + 1}</i>
      <div>
        <h3>{item?.title}</h3>
        <p>{item?.value}</p>
      </div>
    </div>
  ));
};

const Detail = (props) => {
  const { query } = props;
  const id = query?.id;
  const dispatch = useDispatch();
  const colors = useColor();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { detail } = useSelector((state) => state.proof_of_reserves);
  const { isLogin } = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.loading.effects['proof_of_reserves/pullDetail']);
  const [copyText, setCopyText] = useState('');
  const [isCopy, setIsCopy] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const breadCrumbs = [
    {
      label: _t('back'),
      url: '/proof-of-reserves',
    },
    {
      label: _t('assets.por'),
    },
  ];
  const list = useMemo(() => {
    return [
      {
        title: _t('assets.por.audit.record'),
        content: detail?.leafNodeId,
      },
      {
        title: _t('assets.por.audit.time'),
        content: showDateTimeByZoneEight(detail?.auditDate),
      },
      {
        title: _t('assets.por.audit.type'),
        content: 'proof of reserve',
      },
      {
        title: 'uid',
        content: detail?.uid,
      },
      {
        title: _t('assets.por.audit.account'),
        content: _t('assets.por.audit.assets.listA'),
      },
      {
        title: _t('assets.por.audit.assets'),
        content: (detail?.auditAsset || []).join('、'),
      },
    ];
  }, [id, detail]);

  const columns = [
    {
      key: 'currency',
      dataIndex: 'currency',
      title: _t('assets.por.audit.assets'),
      align: 'center',
    },
    {
      key: 'userAsset',
      dataIndex: 'userAsset',
      title: _t('assets.por.userAssets'),
      render(item, record) {
        return <CoinPrecision coin={record?.currency} value={item} />;
      },
    },
    {
      key: 'walletAsset',
      dataIndex: 'walletAsset',
      title: _t('assets.por.walletAssets'),
      render(item, record) {
        return <CoinPrecision coin={record?.currency} value={item} />;
      },
    },
    {
      key: 'reserveRate',
      dataIndex: 'reserveRate',
      title: _t('assets.por.reserveRate'),
      render(item) {
        return `${item}%`;
      },
    },
  ];

  const handleLogin = () => {
    push(`/ucenter/signin?back=${encodeURIComponent(window.location.href)}`);
  };

  const handleCopy = () => {
    trackClickSpm(['copy', 1]);
    setIsCopy(true);
  };

  const handleDownload = () => {
    trackClickSpm(['downLoad', 1]);
    setIsDownload(true);
  };

  const handleDetailSwitch = () => {
    if (!showDetail) {
      trackClickSpm(['direction', 1]);
    }
    setShowDetail(!showDetail);
  };

  const handle2Support = () => {
    trackClickSpm(['direction', 2]);
    const supportUrl = addLangToPath(`/proof-of-reserves/faq?id=${id}`);
    window.open(supportUrl, '_blank');
  };

  const downloadMerklePath = ({ leafNodeId }) => {
    dispatch({
      type: 'proof_of_reserves/downloadMerklePath',
      payload: {
        leafNodeId,
      },
    }).then((path) => {
      if (path) {
        setCopyText(path);
      }
    });
  };

  useEffect(() => {
    // 防止undefined时误跳
    if (isLogin === false) {
      handleLogin();
    } else if (id && isLogin) {
      dispatch({
        type: 'proof_of_reserves/pullDetail',
        payload: {
          leafNodeId: id,
        },
      });
      downloadMerklePath({ leafNodeId: id });
    }
  }, [id, isLogin]);

  return (
    <Spin spinning={isLoading}>
      <div className={styles.por_detail}>
        <Content>
          <BreadCrumbs breadCrumbs={breadCrumbs} />
          <Header>
            <h1>{_t('assets.por')}</h1>
            <span onClick={handleDetailSwitch}>{_t('assets.por.audit.snapshot.intro')}</span>
          </Header>
          <Audition>
            <Row gutter={[24, 24]}>
              {list.map(({ title, content }, index) => (
                <Col sm={24} lg={8} md={24} key={title}>
                  <span>{title}:</span>
                  <span>{content}</span>
                </Col>
              ))}
            </Row>
          </Audition>
          <AuditionResult>
            <h2>{_t('assets.por.audit.intro.title')}</h2>
            <p>
              {_t('assets.por.audit.intro.info', {
                auditTime: showDateTimeByZoneEight(detail?.auditDate, 'YYYY/MM/DD'),
              })}{' '}
            </p>
            <p>
              {_t('assets.por.merkle.roofHash')} <span>{detail?.rootHash}</span>
            </p>
            <p>
              {_t('assets.por.merkle.leafHash')} <span>{detail?.leafHash}</span>
            </p>
            <div className={`${styles.table_container} ${isSm ? styles.isSm : ''}`}>
              <Table
                columns={columns}
                dataSource={detail?.assets || []}
                rowKey="currency"
                scroll={{ x: '100%' }}
              />
            </div>
            <Row justify={isSm ? 'center' : 'flex-start'}>
              <Col order={isSm ? 2 : 1}>
                {copyText && (
                  <CopyToClipboard text={copyText} onCopy={handleCopy}>
                    <Button fullWidth className={styles.btn_copy}>
                      {isCopy ? (
                        <>
                          <ConfirmOutlined
                            color={colors.base}
                            style={{ marginRight: 16, verticalAlign: 'middle' }}
                          />
                          {_t('assets.por.merkle.copied')}
                        </>
                      ) : (
                        _t('assets.por.merkle.copy')
                      )}
                    </Button>
                  </CopyToClipboard>
                )}
                <a
                  download
                  href={
                    host +
                    getUrl('/proof-of-reserves/wallet-asset/download', {
                      auditDate: detail?.auditDate,
                    })
                  }
                  onClick={handleDownload}
                >
                  <Button
                    fullWidth
                    className={`${styles.btn_download} ${isDownload ? styles.isDownload : ''}`}
                  >
                    {_t('assets.por.wallet.download')}
                  </Button>
                </a>
              </Col>
              <Col order={isSm ? 1 : 2}>
                <Button variant="text" className={styles.btn_underline} onClick={handle2Support}>
                  {_t('assets.por.merkle.link')}
                </Button>
              </Col>
            </Row>
          </AuditionResult>
        </Content>
      </div>
      <div className={styles.pro_intro}>
        <Content>
          <Row gutter={75}>
            <Col sm={24} lg={12} md={24}>
              <h2>{_t('assets.por.audit.progress')}</h2>
              <Descriotions descriptions={audithProgress} />
            </Col>
            <Col sm={24} lg={12} md={24}>
              <h2>{_t('assets.por.audit.verify')}</h2>
              <Descriotions descriptions={validateProgress} />
            </Col>
          </Row>
        </Content>
      </div>
      {/* 审计资产快照数据说明 */}
      <DetailDialog
        visible={showDetail}
        onClose={handleDetailSwitch}
        auditTime={detail?.auditDate}
        title={_t('assets.por.audit.snapshot.intro')}
        scope={(detail?.auditAsset || []).join('、')}
      />
    </Spin>
  );
};

export default withRouter()(Detail);
