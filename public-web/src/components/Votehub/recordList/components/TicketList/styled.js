/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 15:22:36
 * @FilePath: /public-web/src/components/Votehub/recordList/components/TicketList/styled.js
 * @Description:
 */
import { css, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

// style start
export const TicketItemWrapper = styled.div`
  .KuxDivider-horizontal {
    margin: 0;
  }
`;

export const TicketItemRow = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  padding: 16px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const TicketItemLine = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const TicketItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${(props) => {
    return (
      props.isEnd &&
      css`
        align-items: flex-end;
      `
    );
  }}
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
const TicketItem = styled.div``;

export const getTicketStatus = (ticketStatus) => {
  switch (ticketStatus) {
    case 2:
      return <TicketItem ticketStatus={ticketStatus}>{_t('fkqNoMHTFGTBuxeLzQ1eF2')} </TicketItem>;
    case 3:
      return <TicketItem ticketStatus={ticketStatus}>{_t('pb5kJEVcGSwLRsyrk9us9H')}</TicketItem>;
    case 5:
      return <TicketItem ticketStatus={ticketStatus}>{_t('wMA2pvJ55M1c9gCE2ZJWB3')}</TicketItem>;
    default:
      return null;
  }
};

export const TicketListPage = styled.div`
  padding: 0 16px;
  font-size: 14px;
  .ticketListRow {
    height: 80px;
  }
  .ticketListRow td {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const DateTimeSpan = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

export const TicketsNumSpan = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;
