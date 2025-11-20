import { styled } from '@kux/mui/emotion';
import { useKuxMediaQuery } from 'src/hooks';
import { useCallback } from 'react';
import JsBridge from 'utils/jsBridge';
import { _BASE_ } from 'config';
import { getPageClickBlockId, useCommunityTrack } from 'components/$/CommunityCollect/hooks/useCommunityTrack';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function LinkButton(props) {
  const { text, src, className, platformTrackId } = props;
  const { upLg, upSm } = useKuxMediaQuery();
  const { trackClick } = useCommunityTrack();
  const isInApp = JsBridge.isApp();

  const handleTriggerClick = useCallback(() => {
    trackClick({
      blockId: getPageClickBlockId(platformTrackId),
      data: {
        account_id: text,
      },
    });

    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/external/link?url=${src}`,
        }
      });
      return;
    }

    const newTab = window.open();
    newTab.opener = null;
    newTab.location = `${src}`.replace(/^\//, _BASE_ + '/');
  }, [isInApp]);

  let linkText = (<span className="link-text">{text}</span>);

  let pointer;
  if (upSm) {
    pointer = (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M5.86192 3.52876C6.12227 3.26841 6.54438 3.26841 6.80473 3.52876L10.8047 7.52876C11.0651 7.78911 11.0651 8.21122 10.8047 8.47157L6.80473 12.4716C6.54438 12.7319 6.12227 12.7319 5.86192 12.4716C5.60157 12.2112 5.60157 11.7891 5.86192 11.5288L9.39051 8.00016L5.86192 4.47157C5.60157 4.21122 5.60157 3.78911 5.86192 3.52876Z"
              fill="#8C8C8C" fillOpacity="0.4" />
      </svg>
    );
  }

  return (
    <div
      onClick={handleTriggerClick}
      className={className}>
      <div className="link-main">
        {linkText}
        {pointer}
      </div>
    </div>
  );
}

export const StyledLinkButton = styled(LinkButton)`
  width: 23.2%;
  cursor: pointer;
  padding: 19px 16px;
  box-sizing: border-box;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.colors.divider8};

  &:hover {
    background-color: ${props => props.theme.colors.cover2};
  }

  & {
    .link-main {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .link-text {
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
  }

  // 适配平板等设备 3 列
  @media screen and (max-width: 1025px) {
    width: 31.5%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 15px 0;
    border: 0 none;
    border-bottom: 1px solid ${props => props.theme.colors.divider8};
    border-radius: 0;
    font-size: 14px;

    &:hover {
      background-color: transparent;
    }
  }}
`;
