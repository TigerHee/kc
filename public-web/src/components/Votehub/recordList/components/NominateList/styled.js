/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 21:54:12
 * @FilePath: /public-web/src/components/Votehub/recordList/components/NominateList/styled.js
 * @Description:
 */
import { css, styled } from '@kux/mui';

export const PaginationWrap = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const NominateItemRow = styled.div`
  display: flex;
  max-width: 1200px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  flex-direction: column;
  padding: 24px;
  margin-bottom: 24px;
  ${(props) => {
    return (
      props.isH5 &&
      css`
        .KuxDivider-horizontal {
          margin: 0;
        }
        margin: 16px;
        margin-bottom: 12px;
        padding: 16px;
      `
    );
  }}
  &:hover {
    background-color: ${(props) => props.theme.colors.cover2};
  }
`;

export const ProjectItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  ${(props) => {
    return (
      props.isH5 &&
      css`
        margin-bottom: 16px;
        ${props.theme.breakpoints.up('sm')} {
          gap: 6px;
        }
        ${props.theme.breakpoints.up('lg')} {
          gap: 8px;
        }
      `
    );
  }}
  ${(props) => {
    return (
      props.isLast &&
      css`
        margin-bottom: 0px;
      `
    );
  }}
`;

export const ProjectItemFlexStart = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;

  ${(props) => props.theme.breakpoints.up('lg')} {
    gap: 48px;
  }
`;

export const ProjectItemFlexEnd = styled(ProjectItemFlexStart)`
  align-items: flex-end;
`;

export const OfficialReplyItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 24px;
  ${(props) => {
    return (
      props.isH5 &&
      css`
        margin-top: 16px;
      `
    );
  }}
`;

export const NominateItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 6px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    gap: 8px;
  }
  ${(props) => {
    return (
      props.isEnd &&
      css`
        align-items: flex-end;
        ${props.theme.breakpoints.up('sm')} {
          gap: 9px;
        }
        ${(props) => props.theme.breakpoints.up('lg')} {
          gap: 8px;
        }
      `
    );
  }}
`;

export const ColumnDesc = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 20px;
  }
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
      props.isSpendTime &&
      css`
        color: ${props.theme.colors.text40};
        font-weight: 400;
        font-size: 16px;
        ${props.theme.breakpoints.up('sm')} {
          gap: 9px;
          font-size: 12px;
        }
        ${props.theme.breakpoints.up('lg')} {
          font-size: 16px;
        }
      `
    );
  }}
  ${(props) => {
    return (
      props.isH5 &&
      css`
        color: ${props.theme.colors.text};
        font-weight: 700;
        font-size: 14px;
      `
    );
  }}
  ${(props) => {
    return (
      props.isH5 &&
      props.isReply &&
      css`
        color: ${props.theme.colors.text60};
        font-weight: 400;
        font-size: 14px;
      `
    );
  }}
  ${(props) => {
    return (
      props.isH5 &&
      props.isSpendNum &&
      css`
        color: ${props.theme.colors.text40};
        font-weight: 700;
        font-size: 14px;
      `
    );
  }}
  ${(props) => {
    return (
      props.isEnd &&
      css`
        align-items: flex-end;
      `
    );
  }}
`;

export const ColumnTitle = styled.div`
  color: ${(props) => props.theme.colors.text40};
  /* 16pt/Regular */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 20.8px */
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 12px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 16px;
  }
  ${(props) => {
    return (
      props.isH5 &&
      css`
        color: ${props.theme.colors.text40};
        font-weight: 400;
        font-size: 12px;
      `
    );
  }}
`;

export const NominateListPage = styled.div`
  font-size: 14px;
  .InfiniteDiv div:first-child {
    margin-top: 0px;
  }
`;
