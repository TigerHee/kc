/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 21:51:01
 * @FilePath: /public-web/src/components/Votehub/recordList/components/NominateList/NominateItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { css, Divider, styled } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import React from 'react';
import { _t } from 'tools/i18n';
import {
  ColumnDesc,
  ColumnTitle,
  NominateItemColumn,
  NominateItemRow,
  OfficialReplyItem,
  ProjectItem,
  ProjectItemFlexEnd,
  ProjectItemFlexStart,
} from './styled';

const NominateStatusItem = styled.div`
  text-align: right;
  font-weight: 400;
  font-size: 20px;
  ${(props) => {
    switch (props.voteStatus) {
      case 0:
        return css`
          color: ${props.theme.colors.text};
        `;
      case 1:
        return css`
          color: ${props.theme.colors.complementary};
        `;
      case 2:
        return css`
          color: ${props.theme.colors.primary};
        `;
    }
  }}
  ${(props) => {
    return (
      props.isH5 &&
      css`
        font-weight: 400;
        font-size: 14px;
      `
    );
  }}
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 14px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 20px;
  }
`;

const nominateStatus = (voteStatus, isH5 = false) => {
  switch (voteStatus) {
    case 0:
      return (
        <NominateStatusItem isH5={isH5} voteStatus={voteStatus}>
          {_t('8MgMDpYUHp7Zg6Tpkvfb54')}
        </NominateStatusItem>
      );
    case 1:
      return (
        <NominateStatusItem isH5={isH5} voteStatus={voteStatus}>
          {_t('1Ftn8McETPH9VtiApoS5V7')}
        </NominateStatusItem>
      );
    case 2:
      return (
        <NominateStatusItem isH5={isH5} voteStatus={voteStatus}>
          {_t('45zBVLwMSird3THXh5QGNJ')}
        </NominateStatusItem>
      );
    // case 3:
    //   return (
    //     <NominateStatusItem isH5={isH5} voteStatus={voteStatus}>
    //       {_t('fztFvc8cifca5zyh4zvEjY')}
    //     </NominateStatusItem>
    //   );
    default:
      return null;
  }
};

// 上币票获得记录
const NominateItem = ({ item }) => {
  const { currentLang } = useLocale();
  return (
    <NominateItemRow>
      <ProjectItem>
        <ProjectItemFlexStart>
          <NominateItemColumn>
            <ColumnTitle>{_t('rBEencvQCSQRSicyf9ez1T')}</ColumnTitle>
            <ColumnDesc>{item?.currency}</ColumnDesc>
          </NominateItemColumn>
          <NominateItemColumn>
            <ColumnTitle>{_t('mGF5aMZPByw1mi1sCnj19V')}</ColumnTitle>
            <ColumnDesc>{item?.project}</ColumnDesc>
          </NominateItemColumn>
          <NominateItemColumn>
            <ColumnTitle>{_t('6Sceun3hwqwtsdGUVh334j')}</ColumnTitle>
            <ColumnDesc>{item?.chainType}</ColumnDesc>
          </NominateItemColumn>
          <NominateItemColumn>
            <ColumnTitle>{_t('5xFm3vsqdtq9tsWEC35tCE')}</ColumnTitle>
            <ColumnDesc>{item?.spendNum}</ColumnDesc>
          </NominateItemColumn>
        </ProjectItemFlexStart>
        <ProjectItemFlexEnd>
          <NominateItemColumn isEnd>
            <NominateStatusItem>{nominateStatus(item?.reviewStatus)}</NominateStatusItem>
            <ColumnDesc isSpendTime>
              <span>
                {dateTimeFormat({
                  lang: currentLang,
                  date: item?.spendTime,
                })}
              </span>
            </ColumnDesc>
          </NominateItemColumn>
        </ProjectItemFlexEnd>
      </ProjectItem>
      <Divider />
      <OfficialReplyItem>
        <ColumnTitle>{_t('kTWULUaiu5FJsSWc91iMRL')}</ColumnTitle>
        <ColumnDesc isReply>{_t(item?.reviewMemoTag)}</ColumnDesc>
      </OfficialReplyItem>
    </NominateItemRow>
  );
};

// 上币票获得记录
export const NominateItemH5 = ({ item }) => {
  const { currentLang } = useLocale();
  return (
    <NominateItemRow isH5>
      <ProjectItem isH5>
        <ColumnTitle isH5>
          {dateTimeFormat({
            lang: currentLang,
            date: item?.spendTime,
          })}
          <span> UTC+0</span>
        </ColumnTitle>
        <NominateStatusItem isH5>{nominateStatus(item?.reviewStatus, true)}</NominateStatusItem>
      </ProjectItem>
      <ProjectItem isH5>
        <NominateItemColumn>
          <ColumnTitle isH5>Currency name</ColumnTitle>
          <ColumnDesc isH5>{item?.currency}</ColumnDesc>
        </NominateItemColumn>
        <NominateItemColumn isEnd>
          <ColumnTitle isH5>{_t('mGF5aMZPByw1mi1sCnj19V')}</ColumnTitle>
          <ColumnDesc isH5>{item?.project}</ColumnDesc>
        </NominateItemColumn>
      </ProjectItem>
      <ProjectItem isH5 isLast={item?.reviewMemoTag ? false : true}>
        <NominateItemColumn>
          <ColumnTitle isH5>{_t('6Sceun3hwqwtsdGUVh334j')}</ColumnTitle>
          <ColumnDesc isH5>{item?.chainType}</ColumnDesc>
        </NominateItemColumn>
        <NominateItemColumn isEnd>
          <ColumnTitle isH5>{_t('5xFm3vsqdtq9tsWEC35tCE')}</ColumnTitle>
          <ColumnDesc isH5 isSpendNum>
            {item?.spendNum}
          </ColumnDesc>
        </NominateItemColumn>
      </ProjectItem>
      {item?.reviewMemoTag && (
        <>
          <Divider />
          <OfficialReplyItem isH5>
            <ColumnTitle isH5>{_t('kTWULUaiu5FJsSWc91iMRL')}</ColumnTitle>
            <ColumnDesc isReply isH5>
              {_t(item?.reviewMemoTag)}
            </ColumnDesc>
          </OfficialReplyItem>
        </>
      )}
    </NominateItemRow>
  );
};
export default React.memo(NominateItem);
