/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { Tabs, Tab } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { Element, Link } from 'react-scroll';
import { styled } from '@kux/mui/emotion';
import { useScrollOffset } from 'components/$/CommunityCollect/hooks/useScrollOffset';
import { useMediaQuery, useTheme } from '@kux/mui/hooks';
import { useKuxMediaQuery, useRTL } from 'src/hooks';
import { getConfigByLang } from 'components/$/CommunityCollect/tools/getConfigByLang';
import { calculateTop } from 'components/$/CommunityCollect/tools/calculateTop';
import { ListItem } from 'components/$/CommunityCollect/ChannelContent/ListItem';
import { getDomDataByKey, track } from 'components/$/CommunityCollect/tools/track';
import { useMount, useUnmount } from 'ahooks';
import {
  getExposeBlockId,
  getPlatformTrackId,
  useCommunityTrack,
} from 'components/$/CommunityCollect/hooks/useCommunityTrack';

const StyledPlatformIcon = styled('img')`
  max-width: 28px;
  height: auto;
  vertical-align: middle;
`;

const StyledTabs = styled(Tabs)`
  && {
    height: 81px;
  }

  &.rtl {
    .KuxTabs-rightScrollButtonBg {
      background-image: linear-gradient(
        to left,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 70%
      );
    }

    .KuxTabs-leftScrollButtonBg {
      background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 70%
      );
    }
  }

  .KuxTabs-Container {
    padding-top: 0;
    /* iPhone xs真机上 gap 失效了，修改为margin-right */
    .KuxTab-TabItem {
      margin-right: 64px;
      &:last-of-type {
        margin-right: 0px;
      }
    }
  }

  .KuxTabs-scrollButton {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    && {
      height: 44px;
    }
    .KuxTabs-Container {
      padding-top: 15px;
      /* iPhone xs真机上 gap 失效了，修改为margin-right */
      .KuxTab-TabItem {
        margin-right: 24px;
        &:last-of-type {
          margin-right: 0px;
        }
      }
    }
  }
  [dir='rtl'] & {
    .KuxTabs-Container {
      /* iPhone xs真机上 gap 失效了，修改为margin-left */
      .KuxTab-TabItem {
         /* @noflip */
        margin-right: 0px;
         /* @noflip */
        margin-left: 64px;
        &:last-of-type {
           /* @noflip */
          margin-right: 0px;
           /* @noflip */
          margin-left: 0px;
        }
      }
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      .KuxTabs-Container {
        /* iPhone xs真机上 gap 失效了，修改为margin-left */
        .KuxTab-TabItem {
           /* @noflip */
          margin-right: 0px;
           /* @noflip */
          margin-left: 24px;
          &:last-of-type {
             /* @noflip */
            margin-right: 0px;
             /* @noflip */
            margin-left: 0px;
          }
        }
      }
    }
  }
`;

const StyledTab = styled(Tab)`
  &.KuxTab-selected {
    .platform-name {
      color: ${(props) => props.theme.colors.text};
    }
  }

  && {
    margin-left: 0;
  }
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.text40};

  &:hover {
    color: ${(props) => props.theme.colors.text60};
  }
`;

export function PlatformTab(props) {
  const { name, iconUrl, className } = props;
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));

  return (
    <div className={className}>
      {upSm && (
        <div className="platform-img-wrap">
          <StyledPlatformIcon className="img" src={iconUrl} alt={name} />
        </div>
      )}
      <div className="platform-name">
        <span>{name}</span>
      </div>
    </div>
  );
}

const StyledPlatformTab = styled(PlatformTab)`
  & {
    display: flex;
    align-items: center;
    flex-direction: column;

    .platform-img-wrap {
      margin-bottom: 8px;
    }
  }
`;

export const StyledChannelContent = styled.div`
  & {
    .tabs-wrapper {
      position: sticky;
      top: ${(props) => calculateTop(props, 72)}; // 80-8
      padding-top: 48px;
      background: ${(props) => props.theme.colors.backgroundMajor};
      border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
    }

    .list-item-wrapper {
      padding-top: 48px;
    }

    // 特殊的一个断点，header 高度有变化
    @media screen and (max-width: 1439px) {
      .tabs-wrapper {
        top: ${(props) => calculateTop(props, 56)}; // 64-8
      }
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      .tabs-wrapper {
        top: ${(props) => {
          const { isInApp } = props;

          if (isInApp) {
            return 0;
          }

          return calculateTop(props, 44);
        }};
        padding: 0 16px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
      }

      .list-wrapper {
        padding: 0 15px;
      }

      .list-item-wrapper {
        padding-top: 25px;
      }
    }
  }
`;

function useTabSize() {
  const { downSm } = useKuxMediaQuery();

  if (downSm) {
    return 'small';
  }

  return 'medium';
}

export function ChannelContent(props) {
  const { dataSource = [], lang, enableRestrictNotice, restrictNoticeHeight, isInApp } = props;
  const theme = useTheme();
  const isRTL = useRTL();
  const offset = useScrollOffset({
    isInApp,
    enableRestrictNotice,
    restrictNoticeHeight,
  });
  const [value, setValue] = useState(0);
  const [listData, setListData] = useState([]);
  const tabSize = useTabSize();
  const { trackExpose } = useCommunityTrack();
  const trackInstance = useMemo(() => track(), []);

  useEffect(() => {
    const newListData = getConfigByLang(dataSource, lang);
    setListData(newListData);
  }, [props.dataSource, props.lang]);

  useMount(() => {
    trackInstance.createObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target) {
            const platform = getDomDataByKey(target, 'platform') || '-';

            // expose platform
            trackExpose({
              blockId: getExposeBlockId(platform),
            });
          }
        }
      });
    }, {
      threshold: 0.25,
    });
  });

  useUnmount(() => {
    trackInstance.destroyObserver();
  });

  return (
    <StyledChannelContent
      className={isRTL ? 'rtl' : ''}
      isInApp={isInApp}
      enableRestrictNotice={enableRestrictNotice}
      restrictNoticeHeight={restrictNoticeHeight}
    >
      <div className="tabs-wrapper">
        <StyledTabs
          className={isRTL ? 'rtl' : ''}
          direction={isRTL ? 'rtl' : 'ltr'}
          size={tabSize}
          theme={theme}
          variant="line"
          value={value}>
          {listData.map((item, index) => {
            const label = (
              <StyledLink
                offset={offset}
                spy={true}
                spyThrottle={500}
                onSetActive={() => setValue(index)}
                to={item.platform}
                activeClass="active">
                <StyledPlatformTab
                  name={item.platform}
                  iconUrl={item.iconUrl}
                />
              </StyledLink>
            );

            return (
              <StyledTab
                key={index}
                label={label}
              />
            );
          })}
        </StyledTabs>
      </div>
      <div className="list-wrapper">
        {listData.map((item, index) => {
          item.platformTrackId = getPlatformTrackId(item.platform);

          return (
            <Element
              key={index}
              name={item.platform}
              className={`list-item-wrapper ${item.platform}`}
            >
              <ListItem
                key={index}
                item={item}
                trackInstance={trackInstance}
              />
            </Element>
          );
        })}
      </div>
    </StyledChannelContent>
  );
}
