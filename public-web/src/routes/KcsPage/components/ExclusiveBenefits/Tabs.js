/**
 * Owner: chris@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kux/mui';
import clsx from 'clsx';
import { _t } from 'src/tools/i18n';
import webCenter from 'static/kcs-intro/web-center.svg';
import webLeft from 'static/kcs-intro/web-left.svg';
import webLineBottom from 'static/kcs-intro/web-line-bottom.svg';
import webLineTop from 'static/kcs-intro/web-line-top.svg';
import webRight from 'static/kcs-intro/web-right.svg';

import h5Center from 'static/kcs-intro/h5-center.svg';
import h5Left from 'static/kcs-intro/h5-left.svg';
import h5LineBottom from 'static/kcs-intro/h5-line-bottom.svg';
import h5LineTop from 'static/kcs-intro/h5-line-top.svg';
import h5Right from 'static/kcs-intro/h5-right.svg';

const Container = styled.div`
  position: relative;
  margin-bottom: 48px;
  .curveBgWrap {
    pointer-events: none;
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100%;
    height: 121px;
    .reverse {
      transform: scaleX(-1);
    }
    .bg1 {
      width: 19px;
      background: url(${({ tab }) => (tab === 0 ? webLeft : webRight)}) no-repeat;
    }
    .bg2,
    .bg4 {
      flex: 1;
    }
    .bg2 {
      background: url(${({ tab }) => (tab === 0 ? webLineTop : webLineBottom)});
    }
    .bg4 {
      background: url(${({ tab }) => (tab === 0 ? webLineBottom : webLineTop)});
    }
    .bg3 {
      width: 46px;
      background: url(${webCenter});
    }
    .bg5 {
      width: 17px;
      background: url(${({ tab }) => (tab === 0 ? webRight : webLeft)}) no-repeat;
      background-size: cover;
    }
  }
  .tabs {
    display: flex;
    align-item: center;
    position: relative:
    z-index:1;
    .tab {
      flex: 1;
      padding: 24px 10px;
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 600;
      font-size: 20px;
      line-height: 130%;
      text-align: center;
      cursor: pointer;
    }
    .active {
      color: ${({ theme }) => theme.colors.text};
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 28px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .tabs {
      .tab {
        font-size: 16px;
      }
    }
    .curveBgWrap {
      height: 117px;
      .bg1 {
        width: ${({ tab }) => (tab === 0 ? '16px' : '20px')};
        background: url(${({ tab }) => (tab === 0 ? h5Left : h5Right)}) no-repeat;;
      }
      .bg2,
      .bg4 {
        flex: 1;
      }
      .bg2 {
        background: url(${({ tab }) => (tab === 0 ? h5LineTop : h5LineBottom)});
      }
      .bg4 {
        background: url(${({ tab }) => (tab === 0 ? h5LineBottom : h5LineTop)});
      }
      .bg3 {
        width: 44px;
        background: url(${h5Center});
      }
      .bg5 {
        width: ${({ tab }) => (tab === 0 ? '20px' : '16px')};
        background: url(${({ tab }) => (tab === 0 ? h5Right : h5Left)}) no-repeat;
      }
    }
  }
`;

function Tabs({ updateTab, tab }) {
  const { isRTL } = useLocale();
  const tabs = [_t('eccfe86f17134000a21b'), _t('05a4f71aefd44000a696')];
  return (
    <Container tab={tab}>
      <div className="tabs">
        {tabs.map((t, idx) => (
          <div
            key={idx}
            onClick={() => {
              updateTab(idx);
            }}
            className={clsx('tab', {
              ['active']: idx === tab,
            })}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="curveBgWrap">
        <div
          className={clsx('bg1', {
            ['reverse']: (tab === 1 && !isRTL) || (isRTL && tab === 0),
          })}
        />
        <div className="bg2" />
        <div
          className={clsx('bg3', {
            ['reverse']: (tab === 1 && !isRTL) || (isRTL && tab === 0),
          })}
        />
        <div className="bg4" />
        <div
          className={clsx('bg5', {
            ['reverse']: (tab === 1 && !isRTL) || (isRTL && tab === 0),
          })}
        />
      </div>
    </Container>
  );
}
export default Tabs;
