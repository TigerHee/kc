/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICInfoOutlined } from '@kux/icons';
import { styled, Table, useTheme } from '@kux/mui';
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { ROLLBACK_SUCCESS, SUCCESS } from '../../constants';
import AmountText from './AmountText';
import ClaimButton from './ClaimButton';
import ClaimStatus from './ClaimStatus';
import CoinDisplay from './CoinDisplay';

const MainContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RightText = styled.div`
  text-align: right;
  display: flex;
  justify-content: end;
`;

const PageTitle = styled.h1`
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

const PageSubTitle = styled.p`
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
  color: ${({ theme }) => theme.colors.text60};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  a {
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const AssetsTitle = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
`;

const InfoIcon = styled(ICInfoOutlined)`
  margin-top: 2px;
  min-width: 16px;
  min-height: 16px;
`;
const InfoBox = styled.div`
  margin-bottom: 16px;
  display: flex;
  /* align-items: baseline; */
  font-size: 14px;
  font-weight: 400;
  line-height: 160%;
  color: ${({ theme }) => theme.colors.text60};
  gap: 8px;
  a {
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const EmailTips = styled(InfoBox)`
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
  }
`;

const TableWrap = styled.div`
  width: 100%;
  margin-bottom: 54px;
`;

const Link = styled.a`
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  text-underline-offset: 2px;
`;

const AssetsTable = styled(Table)`
  tr td {
    padding: 18px 0;
  }
`;

const CLEARANCE_ANNOUNCEMENT_LINK =
  '/announcement/fr-important-notice-regarding-service-termination-for-french-users';

const SWAP_RULE_LINK = '/announcement/en-termination-and-withdrawal-procedures-for-french-users';

const MainContent = ({ assetsList }) => {
  const { user } = useSelector((state) => state.user) || {};
  const isEmailValid = user?.emailValidate;

  const theme = useTheme();
  const isApp = JsBridge.isApp();

  const columns = useMemo(
    () => [
      {
        // 币种
        title: _t('739763fa9d634800af64'),
        dataIndex: 'currency',
        width: 150,
        render: (text) => <CoinDisplay currency={text?.toUpperCase?.()} />,
      },
      {
        // 数量
        title: _t('qN61LLGpxv8GMe2HcBQg1j'),
        dataIndex: 'balance',
        render: (text) => <AmountText value={text} />,
        width: 150,
      },
      {
        // 状态
        title: <RightText>{_t('dfaa33bb0d7b4800ae49')}</RightText>,
        dataIndex: 'claimStatus',
        width: 150,
        render: (value) => (
          <RightText>
            <ClaimStatus status={value} />
          </RightText>
        ),
      },
    ],
    [],
  );

  const list = assetsList || [];
  const isRollback =
    list.length > 0 && list.every((item) => item?.claimStatus === ROLLBACK_SUCCESS);
  const isComplete = list.length > 0 && list.every((item) => item?.claimStatus === SUCCESS);

  let title = isComplete ? _t('16fb8231e8c64800ad38') : _t('4af17b1eb67d4000a9c9');
  let btnText = isComplete ? _t('dca64258b0de4000a212') : _t('85e0a7ac059c4000af4f');
  let description = _t('d787f470d3304800aba4');

  // 对已退回的标题，描述和按钮文案进行调整
  if (isRollback) {
    title = _t('6efefdcb207d4800ae56');
    btnText = _t('qjy6LbTdPfUvuA81w1YHDE');
    description = _t('eb02ff4bb56c4800aded');
  }

  // 未绑定邮箱按钮文案
  if (isEmailValid === false) {
    btnText = _t('a9ca02b3f6b54000a41c');
  }

  const handleEnterSWAP = (e) => {
    e?.preventDefault();
    const link = addLangToPath(SWAP_RULE_LINK);
    if (isApp) {
      window.location.href = link;
    } else {
      window.open(link);
    }
  };

  const handleEnterClearance = (e) => {
    e?.preventDefault();
    const link = addLangToPath(CLEARANCE_ANNOUNCEMENT_LINK);
    if (isApp) {
      window.location.href = link;
    } else {
      window.open(link);
    }
  };

  return (
    <MainContentWrap>
      <PageTitle>{title}</PageTitle>
      <PageSubTitle>
        <span>
          {description}
          <Link
            href={addLangToPath(CLEARANCE_ANNOUNCEMENT_LINK)}
            target="_blank"
            onClick={handleEnterClearance}
          >
            {_t('033f056846f04000a7cf')}
          </Link>
        </span>
      </PageSubTitle>
      <AssetsTitle>{_t('6d43984411d24000ab0d')}</AssetsTitle>
      <InfoBox>
        <InfoIcon size={16} color={theme.colors.complementary} />
        <span>{_tHTML('4ffdd24e20174000a27a')}</span>
      </InfoBox>
      <InfoBox>
        <InfoIcon size={16} color={theme.colors.complementary} />
        <span>
          {_tHTML('c7a110015c7e4000aa16')}
          <Link href={addLangToPath(SWAP_RULE_LINK)} target="_blank" onClick={handleEnterSWAP}>
            {_t('e59be64cabba4000a68f')}
          </Link>
        </span>
      </InfoBox>

      <TableWrap>
        <AssetsTable bordered rowKey={(_, index) => index} columns={columns} dataSource={list} />
      </TableWrap>

      {isEmailValid === false && (
        <EmailTips>
          <InfoIcon size={16} color={theme.colors.complementary} />
          <span>{_t('e8aaa02ebc194000ae4a')}</span>
        </EmailTips>
      )}
      <ClaimButton btnText={btnText} isRollback={isRollback} isEmailValid={isEmailValid} />
    </MainContentWrap>
  );
};

export default MainContent;
