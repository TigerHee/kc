/**
 * Owner: tiger@kupotech.com
 * Alert文本
 */
import { Alert, styled } from '@kux/mui';
import { ICInfoOutlined } from '@kux/icons';
import { Parser } from 'html-to-react';

const htmlToReactParser = new Parser();

const ReAlert = styled(Alert)`
  .KuxAlert-title {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text60);
  }
`;
const InfoIcon = styled(ICInfoOutlined)`
  font-size: 16px;
  color: var(--color-text60);
`;

export default ({ componentTitle }) => {
  return <ReAlert showIcon type="info" title={htmlToReactParser.parse(componentTitle)} icon={<InfoIcon />} />;
};
