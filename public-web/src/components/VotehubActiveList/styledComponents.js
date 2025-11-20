/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { BaseContainer, CurrentProjectContainer } from 'components/Votehub/styledComponents';

export const StyledActiveList = styled.main`
  min-height: 80vh;
`;

export const ActiveListContainer = styled(BaseContainer)``;

export const ProjectContainer = styled(CurrentProjectContainer)`
  padding-top: 20px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 40px;
  }
`;

export const StyledAppFooter = styled.div`
  padding-bottom: 40px;
`;

export const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 80vh;
  width: 100%;
`;

export const PaginationWrap = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 28px;
  }
`;

export const InfiniteScrollList = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  // padding: 12px 12px;
  // padding-bottom: 40px;
  -webkit-overflow-scrolling: touch; /* 在iOS设备上使用流畅的滚动 */

  .loader {
    width: 100%;
    margin: 4px 0;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 1.3;
    text-align: center;
  }
`;
