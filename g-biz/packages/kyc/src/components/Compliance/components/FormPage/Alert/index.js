/**
 * Owner: tiger@kupotech.com
 * Alert文本
 */
import { Alert, styled } from '@kux/mui';
import { ICInfoOutlined } from '@kux/icons';

const ReAlert = styled(Alert)`
  .KuxAlert-title {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: ${(props) => props.theme.colors.text60};
  }
`;
const InfoIcon = styled(ICInfoOutlined)`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text60};
`;

export default ({ componentTitle }) => {
  return <ReAlert showIcon type="info" title={componentTitle} icon={<InfoIcon />} />;
};
