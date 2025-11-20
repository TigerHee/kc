/**
 * Owner: borden@kupotech.com
 */
import { fx, styled, withMedia } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { name } from '@/pages/Chart/config';

const HOC = (FC) => withMedia(name, FC);

export const CountDownWrapper = styled.div`
`;

const DateTextMd = () => `
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  margin-bottom: 16px;
`;

export const DateText = HOC(styled.div`
  ${fx.fontWeight(500)}
  ${fx.fontSize(16)}
  ${fx.lineHeight(21)}
  ${(props) => fx.color(props, 'text60')}
  margin-bottom: 24px;

  ${({ $media }) => $media('md', DateTextMd())}
  ${({ $media }) => $media('sm', DateTextMd())}

  &.multiMarkClassName {
    ${({ $media }) => $media('lg', DateTextMd())}
  }
`);

const SubscribeMd = () => `
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  margin-top: 16px;
`;

export const Subscribe = HOC(styled.div`
  ${fx.fontWeight(500)}
  ${fx.fontSize(16)}
  ${fx.lineHeight(21)}
  ${(props) => fx.color(props, 'text60')}
  margin-top: 24px;

  a {
    ${(props) => fx.color(props, 'textPrimary')}
    ${fx.marginLeft(4)}
  }

  ${({ $media }) => $media('md', SubscribeMd())}
  ${({ $media }) => $media('sm', SubscribeMd())}

  &.multiMarkClassName {
    ${({ $media }) => $media('lg', SubscribeMd())}
  }
`);

export const TimeOutWrapper = HOC(styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`);

export const Item = HOC(styled.div`
  ${fx.width(72)}
  ${fx.textAlign('center')}
  ${fx.borderRadius('6px')}
  ${(props) => fx.backgroundColor(props, 'cover8')}

  ${({ $media }) => $media('md', `${fx.width(66)}`)}
  ${({ $media }) => $media('sm', `${fx.width(66)}`)}

  &.multiMarkClassName {
    ${({ $media }) => $media('lg', `${fx.width(60)}`)}
  }
`);

export const TimeColon = styled(FlexColumm)`
  ${fx.margin('0 10px')}
  ${fx.width(4)}
  ${fx.justifyContent('center')}
  &:before {
    content: ' ';
    ${fx.display('inline-block')}
    ${fx.width(4)}
    ${fx.height(4)}
    ${fx.borderRadius('4px')}
    ${fx.marginBottom(4)}
    ${(props) => fx.backgroundColor(props, 'text40')}
  }

  &:after {
    content: ' ';
    ${fx.display('inline-block')}
    ${fx.width(4)}
    ${fx.height(4)}
    ${fx.borderRadius('4px')}
    ${(props) => fx.backgroundColor(props, 'text40')}
  }
`;

export const TimeNum = styled.div`
  ${fx.textAlign('center')}
  ${fx.lineHeight(30)}
  ${fx.fontSize(24)}
  ${fx.fontWeight(500)}
  ${fx.padding('8px 0')}
  ${(props) => fx.color(props, 'textPrimary')}
`;

export const TimeTitle = styled.div`
  ${fx.height(20)}
  ${fx.lineHeight(20)}
  ${fx.fontSize(12)}
  ${fx.fontWeight(400)}
  ${(props) => fx.color(props, 'text60')}
  ${(props) => fx.backgroundColor(props, 'cover4')}
  ${fx.borderRadius('0 0 6px 6px')}
  ${fx.textAlign('center')}
`;
