/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { Divider, Tag as KuxTag } from '@kux/mui';
import { addLangToPath, _t } from 'src/tools/i18n';
import { getAccountTypeInfo, getOrderTypeInfo } from '../constants';
import { getValidAppTransferLink } from '../utils/url';
import {
  ActionColumnWithCount,
  CommonTableText,
  CountTag,
  FirstColumn,
  FreezeCell,
  FreezeCellTitle,
  FreezeCrypto,
  StyledATag,
  TipsComponent,
  WarnTag,
} from './components/StyleComponents';

export const actionJump = (text, record) => {
  const isApp = JsBridge.isApp();
  const webLink = addLangToPath(record.webUrl);
  const jumpLink = isApp ? getValidAppTransferLink(record.appUrl) : webLink;
  if (jumpLink) {
    return (
      <StyledATag
        href={webLink}
        onClick={(e) => {
          // App内嵌H5时需要用JsBridge跳转
          if (isApp) {
            e.preventDefault();
            JsBridge.open({
              type: 'jump',
              params: {
                // url: `/link?url=${encodeURIComponent(jumpLink)}`,
                url: jumpLink,
              },
            });
          }
        }}
        target="_blank"
      >
        <span style={{ width: 'max-content' }}>{text || _t('94JeGusfZS5Yo1tiHSnohP')}</span>
        <ICArrowRight2Outlined size={16} />
      </StyledATag>
    );
  }
  return null;
};

const getActionColumn = (text) => {
  return {
    dataIndex: 'action',
    key: 'action',
    render: (value, record) => (
      <ActionColumnWithCount>
        <CountTag>
          <span>{record?.count || 0}</span>
        </CountTag>
        {actionJump(text || _t('94JeGusfZS5Yo1tiHSnohP'), record)}
      </ActionColumnWithCount>
    ),
  };
};

export const getAccountColumns = () => ({
  title: _t('as1BsgsURUCW6mTPrEtiv8'),
  columnList: [
    {
      dataIndex: 'accountType',
      key: 'accountType',
      render: (item) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <CommonTableText>{getAccountTypeInfo(item)?.desc || item} </CommonTableText>
          {['fait_currency', 'kucard'].includes(item) && (
            <WarnTag>{_t('4a0243ca73994000ab94')}</WarnTag>
          )}
        </div>
      ),
    },
    {
      dataIndex: 'action',
      key: 'action',
      render: (value, record) => {
        if (record.accountType !== 'p2p') {
          return <TipsComponent>{getAccountTypeInfo(record.accountType)?.tips}</TipsComponent>;
        }
        return actionJump(getAccountTypeInfo(record.accountType)?.tips, record);
      },
    },
  ],
});

export const getFinanceColumns = () => ({
  title: _t('2f75f9267fcd4800a2e9'),
  columnList: [
    {
      dataIndex: 'categoryText',
      key: 'categoryText',
    },
    getActionColumn(_t('dd1d394b3e984000a8e2')),
  ],
});

// 欧洲站理财结构化产品的特殊列展示逻辑
// const financeEuColumn = [
//   {
//     title: '理财产品',
//     dataIndex: 'categoryText',
//     key: 'categoryText',
//     width: '70%',
//     render(text, record) {
//       return <FreezeCell>
//         <FianceEuCellProductWrapper>

//         </FianceEuCellProductWrapper>
//       </FreezeCell>
//     }
//   },
//   ...commonColumns,
// ]

export const getAssetsColumns = () => ({
  title: _t('assets'),
  columnList: [
    {
      dataIndex: 'noSupportCurrencies',
      key: 'noSupportCurrencies',
      render(text, record) {
        return (
          <FreezeCell>
            <FreezeCellTitle>
              <span>{_t('c45b8048cd7c4800a27c')}</span>
              <KuxTag color="default">{_t('1f686334e6ab4000a944')}</KuxTag>
            </FreezeCellTitle>
            <FreezeCrypto>
              {record.noSupportCurrencies?.map((item, index) => {
                return (
                  <>
                    {index > 0 && <Divider type="vertical" />}
                    <div>{getAccountTypeInfo(item)?.desc}</div>
                  </>
                );
              })}
            </FreezeCrypto>
          </FreezeCell>
        );
      },
    },
    getActionColumn(),
  ],
});

export const getOrderColumns = () => ({
  title: _t('trade'),
  columnList: [
    {
      dataIndex: 'orderType',
      key: 'orderType',
      render: (value) => <FirstColumn>{getOrderTypeInfo(value)?.desc}</FirstColumn>,
    },
    getActionColumn(_t('926f0df755e94000a670')),
  ],
});

export const getFiatColumns = () => ({
  title: _t('9c7c2e90de0d4800a71f'),
  columnList: [
    {
      dataIndex: 'orderType',
      key: 'orderType',
      render: (value) => <FirstColumn>{getOrderTypeInfo(value)?.desc}</FirstColumn>,
    },
    getActionColumn(_t('926f0df755e94000a670')),
  ],
});

export const getCryptoColumns = () => ({
  title: _t('f59aa99230f54000aebe'),
  columnList: [
    {
      dataIndex: 'orderType',
      key: 'orderType',
      render: (value) => <FirstColumn>{getOrderTypeInfo(value)?.desc}</FirstColumn>,
    },
    getActionColumn(_t('926f0df755e94000a670')),
  ],
});

// 迁移指南链接
export const GUIDE_LINK_MAP = {
  global: {
    australia: '/announcement/au-migration',
    europe: '/announcement/eu-migration',
  },
  australia: {
    global: '/announcement/global-au-migration',
    europe: '/announcement/eu-migration',
  },
  europe: {
    global: '/announcement/global-eu-migration',
    australia: '/announcement/au-migration',
  },
};

/**
 * 
  主站迁移到澳洲：
  au站的用户隐私协议  https://www.kucoin.com/support/47497300093968
  au站的用户使用条款  https://www.kucoin.com/support/47497300093969

  澳洲迁移到主站：
  global站的用户隐私协议 https://www.kucoin.com/en-au/support/47497300093963
  global站的用户使用条款  https://www.kucoin.com/en-au/support/47497300093964
  -------------------------------------------------------------------------------------------
  主站迁移到欧洲站：
  eu站的用户隐私协议：https://www.kucoin.com/support/48142946141346
  eu站的用户使用条款：https://www.kucoin.com/support/48142946141347

  欧洲站迁移到主站：
  global站的用户隐私协议 ： https://www.kucoin.com/en-eu/support/48142946141351
  global站的用户使用条款： https://www.kucoin.com/en-eu/support/48142946141350
  -------------------------------------------------------------------------------------------
  澳洲迁移到欧洲站：
  eu站的用户隐私协议：https://www.kucoin.com/support/48142946141345
  eu站的用户使用条款：https://www.kucoin.com/support/48142946141344

  欧洲站迁移到澳洲站：
  au站的用户隐私协议 ： https://www.kucoin.com/en-eu/support/48142946141348
  au站的用户使用条款： https://www.kucoin.com/en-eu/support/48142946141349
 */

// 隐私条款链接
export const PRIVACY_LINK_MAP = {
  global: {
    australia: '/support/47497300093968',
    europe: '/support/48142946141346',
  },
  australia: {
    global: '/support/47497300093963',
    europe: '/support/48142946141345',
  },
  europe: {
    global: '/support/48142946141351',
    australia: '/support/48142946141348',
  },
};

// 使用条款链接
export const TERMS_LINK_MAP = {
  global: {
    australia: '/support/47497300093969',
    europe: '/support/48142946141347',
  },
  australia: {
    global: '/support/47497300093964',
    europe: '/support/48142946141344',
  },
  europe: {
    global: '/support/48142946141350',
    australia: '/support/48142946141349',
  },
};

// 链接类型
export const LINK_TYPE = {
  GUIDE: 1,
  PRIVACY: 2,
  TERMS: 3,
};
