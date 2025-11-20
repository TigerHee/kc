/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';

export const NewsWrapper = styled.div`
  background: ${(props) => props.theme.colors.layer};
  border-radius: 12px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 8px 0px 24px rgba(0, 0, 0, 0.16);
  max-width: 400px;
  width: 400px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
    width: 100%;
  }
`;

export const NewsTitle = styled.div`
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  color: ${(props) => props.theme.colors.text};
  display: flex;
  font-size: 18px;
  font-weight: 500;
  height: 56px;
  line-height: 130%;
  padding: 0 24px;
`;

export const NewsContent = styled.div`
  min-height: 240px;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

export const NewsItem = styled.a`
  display: block;
  padding: 0 24px;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.cover4};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

export const NewsItemContent = styled.div`
  padding: 16px 0;

  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  white-space: normal;
  word-break: break-word;
`;

export const NewsItemTitle = styled.div`
  border-bottom: ${(props) => props.theme.colors.divider8};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 8px;
`;

export const NewsItemTime = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  line-height: 130%;
`;

export const NewsMore = styled.a`
  align-items: center;
  color: ${(props) => props.theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  height: 50px;
  line-height: 130%;
  padding: 0 24px;
  text-decoration: none;
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

export const EmptyPro = styled.div`
  height: 240px;
  position: relative;
`;
