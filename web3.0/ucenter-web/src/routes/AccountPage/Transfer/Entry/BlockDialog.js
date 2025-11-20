/**
 * Owner: eli@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICWarningOutlined } from '@kux/icons';
import { useResponsive } from '@kux/mui';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import BlockDialogFooter from './components/BlockDialogFooter';
import CusTable from './components/CusTable';
import ReplenishInfo from './components/ReplenishInfo';
import {
  MainWrapper,
  Section,
  SectionDesc,
  SectionTitle,
  SectionWrapper,
  StyledDialog,
  StyledMDrawer,
  SubText,
} from './components/StyleComponents';
import {
  getAccountColumns,
  getAssetsColumns,
  getCryptoColumns,
  getFiatColumns,
  getFinanceColumns,
  getOrderColumns,
} from './constants';

function MainContent({
  accountBlockingInfo,
  financialBlockingInfo,
  assetBlockingInfo,
  tradeBlockingInfo,
  fiatBlockingInfo,
  cryptoBlockingInfo,
  replenishInfo,
}) {
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const targetSiteType = userTransferInfo?.targetSiteType;
  const targetSiteName = getSiteName(targetSiteType);

  const isShowUnavailable =
    accountBlockingInfo.length + financialBlockingInfo.length + assetBlockingInfo.length > 0;

  const isShowOrder =
    tradeBlockingInfo.length + fiatBlockingInfo.length + cryptoBlockingInfo.length > 0;

  return (
    <MainWrapper>
      <SubText>{_t('0f93e3e107554000a37c', { targetSiteName })}</SubText>

      {/* 补充信息 */}
      <ReplenishInfo replenishInfo={replenishInfo} />

      {isShowUnavailable && (
        <Section>
          <SectionTitle>
            <ICWarningOutlined />
            <span>{_t('26ffe4c0642d4800a5de')}</span>
          </SectionTitle>
          <SectionDesc>{_t('e1b4ffff3c9b4800a4df', { targetSiteName })}</SectionDesc>
          <SectionWrapper>
            {accountBlockingInfo.length > 0 && (
              // 账户
              <CusTable columns={getAccountColumns()} dataSource={accountBlockingInfo} />
            )}
            {financialBlockingInfo.length > 0 && (
              // 理财产品
              <CusTable columns={getFinanceColumns()} dataSource={financialBlockingInfo} />
            )}
            {assetBlockingInfo.length > 0 && (
              // 资产
              <CusTable columns={getAssetsColumns()} dataSource={assetBlockingInfo} />
            )}
          </SectionWrapper>
        </Section>
      )}

      {isShowOrder && (
        <Section>
          <SectionTitle>
            <ICWarningOutlined />
            <span>{_t('7baeb9eb54ed4000a0b0')}</span>
          </SectionTitle>
          <SectionDesc>{_t('f614626cb4bc4800acf4')}</SectionDesc>
          <SectionWrapper>
            {tradeBlockingInfo.length > 0 && (
              // 交易
              <CusTable columns={getOrderColumns()} dataSource={tradeBlockingInfo} />
            )}
            {fiatBlockingInfo.length > 0 && (
              // 法币充提
              <CusTable columns={getFiatColumns()} dataSource={fiatBlockingInfo} />
            )}
            {cryptoBlockingInfo.length > 0 && (
              // 加密货币充提
              <CusTable columns={getCryptoColumns()} dataSource={cryptoBlockingInfo} />
            )}
          </SectionWrapper>
        </Section>
      )}
      <BlockDialogFooter />
    </MainWrapper>
  );
}

export default function BlockDialog({
  open,
  onClose,
  accountBlockingInfo,
  financialBlockingInfo,
  assetBlockingInfo,
  tradeBlockingInfo,
  fiatBlockingInfo,
  cryptoBlockingInfo,
  replenishInfo,
}) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const title = _t('f322ec5eb18f4000a88f');
  const isApp = JsBridge.isApp();

  if (isH5) {
    return (
      <StyledMDrawer
        title={title}
        show={open}
        onClose={onClose}
        back={false}
        footer={null}
        isApp={isApp}
      >
        <MainContent
          accountBlockingInfo={accountBlockingInfo}
          financialBlockingInfo={financialBlockingInfo}
          assetBlockingInfo={assetBlockingInfo}
          tradeBlockingInfo={tradeBlockingInfo}
          fiatBlockingInfo={fiatBlockingInfo}
          cryptoBlockingInfo={cryptoBlockingInfo}
          replenishInfo={replenishInfo}
        />
      </StyledMDrawer>
    );
  }
  return (
    <StyledDialog title={title} open={open} onCancel={onClose} size="large" footer={null}>
      <MainContent
        accountBlockingInfo={accountBlockingInfo}
        financialBlockingInfo={financialBlockingInfo}
        assetBlockingInfo={assetBlockingInfo}
        tradeBlockingInfo={tradeBlockingInfo}
        fiatBlockingInfo={fiatBlockingInfo}
        cryptoBlockingInfo={cryptoBlockingInfo}
        replenishInfo={replenishInfo}
      />
    </StyledDialog>
  );
}
