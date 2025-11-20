/**
 * Owner: tiger@kupotech.com
 */
import { useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import InfoList from 'components/Account/Kyc/KycHome/components/InfoList';
import Unlock from 'components/Account/Kyc/KycHome/components/Unlock';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { ReactComponent as AssetIcon } from 'static/account/kyc/au/asset.svg';
import { ReactComponent as DerivativeIcon } from 'static/account/kyc/au/derivative.svg';
import { ReactComponent as KnowledgeIcon } from 'static/account/kyc/au/knowledge.svg';
import { ReactComponent as ComponyIcon } from 'static/account/kyc/au/kyb/compony.svg';
import { ReactComponent as DocumentIcon } from 'static/account/kyc/au/kyb/document.svg';
import { ReactComponent as ShareholderIcon } from 'static/account/kyc/au/kyb/shareholder.svg';
import { _t, _tHTML } from 'tools/i18n';
import {
  CopyIcon,
  Divider1,
  Divider2,
  Divider3,
  DownloadButton,
  DownloadIcon,
  ExButton,
  ReAlert,
  ReTag,
  StatusAlert,
  StatusCardWrapper,
  StatusWrapper,
} from './styled';
import WholesaleDetailDialog from './WholesaleDetailDialog';

const email = 'institutional_kyc_au@kucoin.com';
const email2 = 'institutional_kyc@kucoin.au';

const StatusTag = ({ statusData, isInMigrate }) => {
  const isUnverified = [KYC_STATUS_ENUM.UNVERIFIED].includes(statusData.status);
  const isVerified = [KYC_STATUS_ENUM.VERIFIED].includes(statusData.status);
  const isOngoing = [KYC_STATUS_ENUM.VERIFYING].includes(statusData.status);
  return (
    <>
      {isUnverified &&
        (isInMigrate ? (
          <ReTag color="complementary">{_t('5dd9bcca2e794800ab83')}</ReTag>
        ) : (
          <ReTag color="default">{_t('unverified')}</ReTag>
        ))}
      {isVerified && <ReTag color="primary">{_t('460cb69b03104000a1fc')}</ReTag>}
      {isOngoing && <ReTag color="complementary">{_t('a90983f924404800a3b8')}</ReTag>}
    </>
  );
};

const StatusCard = ({ statusData, privilegeList, content, title }) => {
  const isVerified = [KYC_STATUS_ENUM.VERIFIED].includes(statusData.status);

  return (
    <StatusCardWrapper>
      <div className="cardHeader">
        <b>{title}</b>
        <StatusTag statusData={statusData} />
      </div>
      <Unlock locking={!isVerified} list={privilegeList} className="UnlockEl">
        {isVerified ? null : content}
      </Unlock>
    </StatusCardWrapper>
  );
};

export default ({ isInMigrate }) => {
  const { message } = useSnackbar();
  const kybInfo = useSelector((state) => state.kyc.kybInfo);
  const kyb1 = useSelector((state) => state.kyc_au.kyb1);
  const kyb2 = useSelector((state) => state.kyc_au.kyb2);
  const kyb3 = useSelector((state) => state.kyc_au.kyb3);
  const kybCountryList = useSelector((state) => state.kyc_au.kybCountryList || []);
  const kybCountryName = kybCountryList.find((i) => i.code === 'AU')?.name;

  const [isWholeSaleDialogOpen, setWholeSaleDialogOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href =
      'https://assets.staticimg.com/cms/media/XnGURsCWezaodYLVyEZNM6JDqMyB5CUTlAsjIKnN7.zip';
    link.download = 'Apply for KYB Information List Template.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isHideKyb2 =
    kyb2.status !== KYC_STATUS_ENUM.VERIFIED && kyb3.status === KYC_STATUS_ENUM.VERIFIED;

  return (
    <StatusWrapper>
      {kybInfo.companyName && <div className="companyName">{kybInfo.companyName}</div>}

      {kybCountryName && !isInMigrate ? (
        <div className="countryInfo">
          {isInMigrate ? null : (
            <span className="countryInfoTip">{_t('d97e4707edb24800a230')}</span>
          )}
          <span>{_tHTML('cb3ada906dbc4800a1c2', { name: kybCountryName })}</span>
        </div>
      ) : null}

      <div className="statusList">
        <div
          className={classnames({
            statusItem: true,
            statusItemMb24: isInMigrate,
          })}
        >
          <div className="titleBox">
            {isInMigrate ? null : <div className="titleIndex">1</div>}

            <div className="titleTextBox">
              <div className="statusItemTitle">{_t('745e6b85c4864000ab0b')}</div>
              {isInMigrate && <StatusTag statusData={kyb1} isInMigrate={isInMigrate} />}
            </div>
          </div>

          <Divider2 />
          {isInMigrate ? null : (
            <>
              <StatusCard
                title={_t('745e6b85c4864000ab0b')}
                statusData={kyb1}
                privilegeList={[
                  _t('e57404fe43234000a932'),
                  _t('53174e36a46c4800acf5'),
                  _t('0a362fd6f9e84800ae57'),
                ]}
                content={
                  <>
                    <InfoList
                      list={[
                        {
                          title: _t('caf35a8931364800a24e'),
                          icon: <ComponyIcon className="infoIcon" />,
                        },
                        {
                          title: _t('336b699cae8e4000a675'),
                          icon: <ShareholderIcon className="infoIcon" />,
                        },
                        {
                          title: _t('d5b9e9b6dec14800a82d'),
                          icon: <DocumentIcon className="infoIcon" />,
                        },
                      ]}
                    />
                    <DownloadButton onClick={handleDownload} type="default">
                      <DownloadIcon />
                      <span className="downloadText">{_t('e0d834972f524800acb8')}</span>
                    </DownloadButton>
                  </>
                }
              />
              <Divider1 />
            </>
          )}

          <div className="emailBox">
            <div>
              <div className="emailTip">{_t('61179c99bd0d4800a426')}</div>
              <div>
                <a className="email" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>
            <CopyToClipboard
              text={email}
              onCopy={() => {
                message.success(_t('copy.succeed'));
              }}
            >
              <ExButton size="basic">
                <CopyIcon />
                <span>{_t('copy')}</span>
              </ExButton>
            </CopyToClipboard>
          </div>
        </div>

        {isInMigrate ? null : (
          <div
            className={classnames({
              statusItem: true,
            })}
          >
            <div className="titleBox">
              <div className="titleIndex">2</div>
              <div>
                <div className="statusItemTitle">{_t('b5f1bf6c35a04000a14d')}</div>
                <StatusAlert showIcon type="info" title={_t('605480ca11b64800acc1')} />
              </div>
            </div>

            <Divider2 />
            <div className="cardList">
              {isHideKyb2 ? null : (
                <>
                  <StatusCard
                    title={_t('7cc06427cc0e4000a70c')}
                    statusData={kyb2}
                    privilegeList={[_t('a96c0ae61bd74800a89e')]}
                    content={
                      <InfoList
                        tipMsg={_t('1a4cd6a8cc574800af2c')}
                        list={[
                          {
                            title: _t('a0c9c64ef9f64000a684'),
                            icon: <KnowledgeIcon className="infoIcon" />,
                          },
                          {
                            title: _t('188c199f940d4000a1c1'),
                            icon: <DerivativeIcon className="infoIcon" />,
                          },
                        ]}
                      />
                    }
                  />
                  <Divider3>{_t('a21b87444b2b4000a03c')}</Divider3>
                </>
              )}
              <StatusCard
                title={_t('59dc7f72a4894000a7d0')}
                statusData={kyb3}
                privilegeList={[_t('a96c0ae61bd74800a89e'), _t('fa61bd09a4594800aa1e')]}
                content={
                  <>
                    <InfoList
                      tipMsg={_t('8d4f8f6c0f914000af91')}
                      list={[
                        {
                          title: _t('6bcc603f4ea24000a278'),
                          icon: <AssetIcon className="infoIcon" />,
                        },
                        {
                          title: (
                            <div
                              className="viewDetail"
                              role="button"
                              tabIndex="0"
                              onClick={() => setWholeSaleDialogOpen(true)}
                            >
                              {_t('1036ad7534884800aa34')}
                            </div>
                          ),
                          icon: <AssetIcon className="infoIcon infoIconHidden" />,
                        },
                      ]}
                    />
                  </>
                }
              />
            </div>
            <Divider1 />
            <div className="emailBox">
              <div>
                <div className="emailTip">{_t('61179c99bd0d4800a426')}</div>
                <div>
                  <a className="email" href={`mailto:${email2}`}>
                    {email2}
                  </a>
                </div>
              </div>
              <CopyToClipboard
                text={email}
                onCopy={() => {
                  message.success(_t('copy.succeed'));
                }}
              >
                <ExButton size="basic">
                  <CopyIcon />
                  <span>{_t('copy')}</span>
                </ExButton>
              </CopyToClipboard>
            </div>
            <WholesaleDetailDialog
              open={isWholeSaleDialogOpen}
              onCancel={() => setWholeSaleDialogOpen(false)}
            />
          </div>
        )}
      </div>

      {isInMigrate && <ReAlert showIcon type="info" title={_t('0fda0a49508f4000abba')} />}
    </StatusWrapper>
  );
};
