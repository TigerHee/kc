/**
 * Owner: lucas.l.lu@kupotech.com
 * copy by platform-operation-web
 * @description h5 Header 使用场景
 *  挂载在 app 内使用原生 header / h5 页面使用带的 header
 */
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import backIconUrl from 'assets/global/arrow-left.svg';
import { useEventCallback } from '@kux/mui/hooks';
import siteCfg from 'utils/siteConfig';
import keysEquality from 'utils/tools/keysEquality';
import { styled } from '@kux/mui/emotion';
import JsBridge from 'utils/jsBridge';
import { useLocation } from 'react-router-dom';
import systemDynamic from 'utils/systemDynamic';
import { calculateTop } from 'components/$/CommunityCollect/tools/calculateTop';
import SiteRedirect from 'src/components/common/SiteRedirect';

const RestrictNotice = systemDynamic('@remote/header', 'RestrictNotice');

const { KUCOIN_HOST } = siteCfg;

export const media = {
  // rtl
  rtl: '[dir="rtl"] &',
};

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.backgroundMajor};
  width: 100%;
  height: ${(props) => calculateTop(props, props.isInApp ? 88 : 44)};
  padding-top: ${({ isInApp }) => (isInApp ? '46px' : '0px')};
  box-sizing: border-box;

  .main {
    height: 44px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const BackIcon = styled.img`
  max-width: 100%;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;

  ${media.rtl} {
    transform: rotate(180deg);
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const CustomIconBox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  ${media.rtl} {
    transform: scaleX(-1);
  }
`;

const Title = styled.h5`
  font-family: Roboto;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
  margin: 0;
`;

const H5Header = (props) => {
  const {
    title,
    customIcon,
    onBack,
    ...rest
  } = props;

  const { pathname } = useLocation();

  const headRef = useRef(null);
  const { isInApp, user, currentLang } = useSelector(
    (state) => state.app,
    keysEquality(['isInApp', 'user', 'currentLang']),
  );

  const handleBack = useEventCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    // app 中跳转回 App 首页
    if (isInApp) {
      jumpAppHome();
    } else {
      const newPage = window.open(KUCOIN_HOST, '_self');
      newPage.opener = null;
    }
  });

  function jumpAppHome() {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/home?page=0',
      },
    });
  }

  return (
    <Header ref={headRef} isInApp={isInApp} {...rest}>
      <RestrictNotice
        userInfo={user}
        pathname={pathname}
        currentLang={currentLang}
      />
      <div className="main">
        <HeaderLeft hasTitle={!!title}>
          <BackIcon onClick={handleBack} src={backIconUrl} alt="Back" />
        </HeaderLeft>
        {title && <Title>{title}</Title>}
        <HeaderRight>
          {customIcon && (
            <CustomIconBox>
              {customIcon}
            </CustomIconBox>
          )}
        </HeaderRight>
      </div>
      <SiteRedirect />
    </Header>
  );
};

H5Header.propTypes = {
  // 返回回调
  onBack: PropTypes.func,
  // 自定义图标
  customIcon: PropTypes.node,
};

H5Header.defaultProps = {
  onBack: null,
  customIcon: null,
};

export default H5Header;
