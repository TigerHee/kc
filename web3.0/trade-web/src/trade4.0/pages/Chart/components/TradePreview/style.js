/**
 * Owner: borden@kupotech.com
 */
import { fx, styled, withMedia } from '@/style/emotion';
import { name } from '@/pages/Chart/config';

const HOC = (FC) => withMedia(name, FC);

export const PreviewWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: auto;
  background: ${({ theme }) => theme?.colors?.overlay};
  z-index: 10;
`;

const NormalWrapperLg2 = () => `
  & .right {
    padding: 0 40px;
    margin-left: 80px;
    img {
      width: auto;
      height: 240px;
      max-height: 100%;
    }
  }
`;

const NormalWrapperLg1 = () => `
  & .right {
    display: none;
  }

  & .left {
    width: 100%;
    height: 100%;

    .topImg {
      ${fx.display('block')}
    }
  }
`;

const NormalWrapperLg = () => `
  min-height: 200px;
  ${fx.padding('24px')}
  & .left {
    .topImg {
      ${fx.display('none')}
    }
  }

  & .right {
    display: none;
  }
`;

const NormalWrapperMd = () => `
  ${fx.padding('16px')}
  & .left {
    .top {
      .symbolWrapper {
        .symbol {
          ${fx.fontWeight(700)}
          ${fx.fontSize(20)}
          ${fx.lineHeight(26)}
          ${fx.marginBottom(4)}
        }
      }
    }
  }

  & .right {
    display: none;
  }
`;

export const NormalWrapper = HOC(styled.div`
  ${fx.display('flex')}
  height: 100%;
  ${fx.alignItems('center')}
  ${fx.justifyContent('space-between')}
  ${fx.padding('40px 80px 18px')}

  & .left {
    ${fx.flex(1)}
    height: 100%;
    overflow: auto;

    .top {
      ${fx.display('flex')}
      ${fx.alignItems('center')}
      ${fx.justifyContent('space-between')}
      .symbolWrapper {
        .symbol {
          ${fx.fontWeight(700)}
          ${fx.fontSize(36)}
          ${fx.lineHeight(47)}
          ${fx.marginBottom(6)}
          ${(props) => fx.color(props, 'text')}
        }
      }
    }
    .topImg {
      ${fx.width(160)}
      ${fx.height(160)}
      ${fx.display('none')}
    }
  }

  & .right {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      width: auto;
      height: 240px;
      max-height: 100%;
    }
  }

  ${({ $media }) => $media('lg2', NormalWrapperLg2())}
  ${({ $media }) => $media('lg1', NormalWrapperLg1())}
  ${({ $media }) => $media('lg', NormalWrapperLg())}
  ${({ $media }) => $media('md', NormalWrapperMd())}
  ${({ $media }) => $media('sm', NormalWrapperMd())}
`);

export const MultiWrapper = HOC(styled.div`
  ${fx.display('flex')}
  height: 100%;
  min-height: 150px;
  ${fx.alignItems('center')}
  ${fx.justifyContent('center')}
  ${fx.padding('16px')}
`);

const CoinSummaryMd = () => `
  ${fx.marginTop(24)}
  height: calc(100% - 190px);
`;
export const CoinSummaryWrapper = HOC(styled.div`
  ${fx.marginTop(40)}
  height: calc(100% - 250px);

  ${({ $media }) => $media('md', CoinSummaryMd())}
  ${({ $media }) => $media('sm', CoinSummaryMd())}
`);

export const TitleWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.marginBottom(16)}

  img {
    ${fx.width(32)}
    ${fx.height(32)}
    ${fx.marginRight(12)}
  }
`;

const CoinWrapperMd = () => `
  ${fx.display('flex')}
  ${fx.flexFlow('column')}
  ${fx.alignItems('flex-start')}
  .coinSymbol {
    ${fx.fontSize(16)}
    ${fx.lineHeight(21)}
    ${fx.marginBottom(2)}
  }

  .coinName {
    ${fx.fontSize(14)}
    ${fx.lineHeight(18)}
  }
`;

export const CoinWrapper = HOC(styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.fontWeight(500)}
  ${fx.fontSize(18)}
  ${fx.lineHeight(23)}

  .coinSymbol {
    ${(props) => fx.color(props, 'text')}
    ${fx.marginRight(8)}
  }

  .coinName {
    ${(props) => fx.color(props, 'text40')}
  }

  ${({ $media }) => $media('md', CoinWrapperMd())}
  ${({ $media }) => $media('sm', CoinWrapperMd())}
`);

export const DescWrapper = styled.p`
  ${fx.margin(0)}
  ${fx.fontWeight(400)}
  ${fx.fontSize(14)}
  ${fx.lineHeight(21)}
  ${(props) => fx.color(props, 'text60')}
`;
