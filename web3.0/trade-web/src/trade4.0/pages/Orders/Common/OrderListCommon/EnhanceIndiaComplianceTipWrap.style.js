/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-04 17:17:00
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-04 18:38:22
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderListCommon/EnhanceIndiaComplianceTipWrap.style.js
 * @Description:
 */
import { Tooltip } from '@kux/mui';
import styled from '@emotion/styled';
import { ICQuestionOutlined } from '@kux/icons';

export const Wrap = styled.section`
  display: flex;
  align-items: center;
`;

export const InfoIcon = styled(ICQuestionOutlined)`
  width: 12px;
  height: 12px;
  margin-right: 2px;
  fill: ${({ theme }) => theme.colors.icon60};
`;

export const StyledTooltip = styled(Tooltip)`
  padding: 5px 8px;
`;

export const ButtonArea = styled.section`
  padding: 32px 24px 24px;
  display: flex;
  margin-left: auto;
  a {
    color: ${({ theme }) => theme.colors.text};
  }
`;
