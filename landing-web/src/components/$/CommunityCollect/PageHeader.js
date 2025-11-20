/**
 * Owner: lucas.l.lu@kupotech.com
 */
import Header from 'components/Header/KCHeader';
import H5Header from 'components/$/CommunityCollect/H5Header/H5Header';
import { useSelector } from 'dva';
import iconMenu from 'assets/communityCollect/icon-menu-x3.png';
import { styled } from '@kux/mui/emotion';
import JsBridge from 'utils/jsBridge';
import { isSupportAppNewJump } from 'components/$/CommunityCollect/tools/isSupportAppNewJump';
import { useKuxMediaQuery } from 'src/hooks';
import { useTheme } from '@kux/mui/hooks';

const CustomIconWrapper = styled.div`
  & {
    .icon {
      max-width: 20px;
      height: auto;
      vertical-align: middle;
    }
  }
`;

function H5HeaderCustomIcon(props) {
  const { onClick } = props;

  return (
    <CustomIconWrapper onClick={onClick}>
      <img className="icon" src={iconMenu} alt="Menu" />
    </CustomIconWrapper>
  );
}

export function PageHeader(props) {
  const { onRightClick, enableRestrictNotice, restrictNoticeHeight } = props;
  const { appVersion } = useSelector(state => state.app);
  const { downSm } = useKuxMediaQuery();
  const theme = useTheme();

  const isInApp = JsBridge.isApp();
  const support = isSupportAppNewJump(appVersion);

  const h5Header = (
    <H5Header
      title={`${window._BRAND_NAME_}`}
      theme={theme}
      isInApp={isInApp}
      enableRestrictNotice={enableRestrictNotice}
      restrictNoticeHeight={restrictNoticeHeight}
      customIcon={<H5HeaderCustomIcon onClick={onRightClick} />}
    />
  );

  if (!isInApp && downSm) {
    return h5Header;
  } else if (isInApp && !support) {
    return h5Header;
  } else if (isInApp && support) {
    // use Native Header
    return null;
  }

  return (
    <Header transparent theme={theme} />
  );
}
