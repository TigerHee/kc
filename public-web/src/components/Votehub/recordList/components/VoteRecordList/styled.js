/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:08
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 16:48:34
 * @FilePath: /public-web/src/components/Votehub/recordList/components/VoteRecordList/styled.js
 * @Description:
 */
import { css, styled } from '@kux/mui';
import CoinIcon from 'components/common/CoinIcon';
import { _t } from 'tools/i18n';

// style start

export const VoteRecordItemWrapper = styled.div`
  .KuxDivider-horizontal {
    margin: 0;
  }
`;

export const VoteRecordItemRow = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  padding: 16px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const VoteRecordItemLine = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const VoteRecordItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ColumnDesc = styled.div`
  ${(props) => {
    return props.isReply
      ? css`
          color: ${props.theme.colors.text60};
          font-weight: 400;
        `
      : css`
          color: ${props.theme.colors.text};
          font-weight: 700;
        `;
  }}
  ${(props) => {
    return (
      props.isTextRight &&
      css`
        text-align: right;
      `
    );
  }}

  color: ${(props) => props.theme.colors.text};
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

export const ColumnTitle = styled.div`
  color: ${(props) => props.theme.colors.text40};
  /* 16pt/Regular */
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 20.8px */
`;

export const VoteStatusItem = styled.div`
  ${(props) => {
    switch (props.voteStatus) {
      case 0:
        return css`
          color: ${props.theme.colors.text30};
          font-weight: 400;
        `;
      case 1:
        return css`
          color: ${props.theme.colors.text};
          font-weight: 400;
        `;
      case 2:
        return css`
          color: ${props.theme.colors.primary};
          font-weight: 400;
        `;
    }
  }}
`;

export const VoteStatus = (voteStatus) => {
  switch (voteStatus) {
    case 0:
      return (
        <VoteStatusItem voteStatus={voteStatus}>{_t('eDEcoXxtyjLh9iNQtatWUp')} </VoteStatusItem>
      );
    case 1:
      return (
        <VoteStatusItem voteStatus={voteStatus}>{_t('45AeCPrKv92ER8JMXGAz6j')}</VoteStatusItem>
      );
    case 2:
      return (
        <VoteStatusItem voteStatus={voteStatus}>{_t('qKD6BjWSbVGtu89LJoY5xC')}</VoteStatusItem>
      );
    default:
      return null;
  }
};

export const CoinListItemIcon = styled(CoinIcon)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 20px;
  object-fit: cover;
`;
export const CoinListItemName = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;
export const CoinListItemDesc = styled.div`
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;

export const CoinRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CoinListFullName = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
