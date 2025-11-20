/**
 * Owner: lori@kupotech.com
 */

import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  margin: 0;
  .boldBlackText {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
  }
  .tipColor {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 14px;
  }
`;

export const Title = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.text40};
`;

export const Tips1Wrapper = styled.div`
  font-size: 14px;
`;

export const BlackBold = styled.span`
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
`;

export const NeededAssetsTip = styled.span`
  margin: 12px 0;
  color: ${(props) => props.theme.colors.text40};
  opacity: 0.6;
  line-height: 22px;
`;

export const NeededAssetsItem = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  column-gap: 8px;
  color: ${(props) => props.theme.colors.text};
`;

export const NeededItemsPrefix = styled.div`
  line-height: 20px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 20, 42, 0.6);
  margin-right: 8px;

  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

export const NeededItemsPrefix0 = styled.div`
  color: #f65454;
  margin-right: 2px;

  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 2px;
  }
`;

export const ImgGuide = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
`;

export const ImgWrapper = styled.div`
  width: 270px;
  height: 160px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
  background: ${(props) => props.theme.colors.cover2};
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  & > img {
    width: auto;
    max-width: 270px;
    height: auto;
    transition: all 0.3s ease;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    height: 160px;
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const ShowVideo = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const ItemTitle = styled.div`
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
`;

export const Video = styled.video`
  outline: none !important;
  width: 100%;
  max-width: 800px;
`;

export const Desc = styled.div`
  opacity: 0.6;
  margin-top: 8px;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
`;

export const Desc2 = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 20, 42, 0.6);
  margin-top: 12px;
`;

export const TextWrapper = styled.div`
  display: block;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 12px;
`;
