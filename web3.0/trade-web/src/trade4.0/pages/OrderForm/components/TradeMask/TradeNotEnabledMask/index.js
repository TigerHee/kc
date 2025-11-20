/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import styled from '@emotion/styled';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { isMaintenanceScope, isSymbolMaintenance } from 'src/utils/noticeUtils';
import { _t } from 'src/utils/lang';
import { zoneTime2LocalTime } from 'src/helper';
import infoDark from '@/assets/toolbar/maintenance-dark.png';
import infoLight from '@/assets/toolbar/maintenance-light.png';
import { useTheme } from '@kux/mui';

export const WithdrawPanel = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
`;

export const MaintenanceLinkBtn = styled.div`
  max-width: 300px;
  color: ${(props) => props.theme.colors.primary};
  line-height: 24px;
  display: inline-block;
  padding: 2px 8px;
  text-align: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  margin-top: 12px;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & a,
  a:hover,
  a:visited,
  a:active {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }
`;

export const Announcement = styled.div`
  margin-top: 4px;
  max-width: 500px;
  a {
    text-decoration: underline;
    word-break: break-all;
  }
`;

export const TipWrapper = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text30};
`;

export const Img = styled.img`
  width: 130px;
  height: 132px;
  margin-bottom: 20px;
`;

/**
 * 系统维护中遮罩
 */
const TradeNotEnabledMask = (props) => {
  const { tip: _tip, announcement = {}, symbolCode: _symbolCode } = props;
  const symbolCode = _symbolCode || useGetCurrentSymbol();

  const isMaintenanceTrade = isMaintenanceScope(announcement);
  const symbolMaintenance = isSymbolMaintenance(announcement, symbolCode);
  const { currentTheme } = useTheme();

  const tip =
    _tip ||
    (symbolMaintenance
      ? _t('maintenance.tip.title', {
          date: zoneTime2LocalTime(announcement.endAt, 'MM-DD HH:mm'),
        })
      : _t('trd.forbidden'));

  return (
    <WithdrawPanel>
      <div className="text-center">
        <Img src={currentTheme === 'dark' ? infoDark : infoLight} />
        <TipWrapper>{tip}</TipWrapper>
        {symbolMaintenance && isMaintenanceTrade && !!announcement.link && (
          <MaintenanceLinkBtn>
            <a
              target="_blank"
              href={announcement.link}
              rel="noopener noreferrer"
            >
              {announcement.redirectContent || _t('view.more')}
            </a>
          </MaintenanceLinkBtn>
        )}
        {/* 兼容已有展示样式 */}
        {symbolMaintenance && !isMaintenanceTrade && !!announcement.title && (
          <Announcement>
            {_t('maintenance.tip.announcement')}
            <a
              target="_blank"
              href={announcement.link}
              rel="noopener noreferrer"
            >
              {announcement.title}
            </a>
          </Announcement>
        )}
      </div>
    </WithdrawPanel>
  );
};

export default memo(TradeNotEnabledMask);
