/**
 * Owner: jesse.shao@kupotech.com
 */
import { Fragment } from 'react';
import { useSelector } from 'dva';
import clsx from 'classname';
import PropTypes from 'prop-types';
import LeftLogo from './LeftLogo';
import RightBox from './RightBox';
import styles from './style.less';

const AnniversaryHeader = ({
  onClickGoBack,
  onClickLogo,
  logoUrl,
  showLogo,
  showRightBox,
  customRightOpt,
  showCheckedImg,
  checkedImgUrl,
  showAvatar,
  noUserInfo = false,
  blockId,
  sensorData,
  logoStyle,
  headerTitle,
  darkLang = false, // 是否使用深色语言选择
}) => {
  const { isInApp } = useSelector(state => state.app);
  return (
    <Fragment>
      <header className={clsx(styles.topHeaderBox, { [styles.inApp]: isInApp })}>
        <LeftLogo
          showLogo={showLogo}
          logoUrl={logoUrl}
          onClickGoBack={onClickGoBack}
          onClickLogo={onClickLogo}
          logoStyle={logoStyle}
        />
        {headerTitle}
        <Fragment>
          {showRightBox ? (
            <RightBox
              blockId={blockId}
              sensorData={sensorData}
              showAvatar={showAvatar}
              noUserInfo={noUserInfo}
              showCheckedImg={showCheckedImg}
              checkedImgUrl={checkedImgUrl}
              customRightOpt={customRightOpt}
              darkLang={darkLang}
            />
          ) : (
            ''
          )}
        </Fragment>
      </header>
    </Fragment>
  );
};

AnniversaryHeader.propTypes = {
  showLogo: PropTypes.bool, // 是否展示Logo
  logoUrl: PropTypes.string, // logo图片url
  logoStyle: PropTypes.object, // logo样式
  onClickGoBack: PropTypes.func, // 点击返回回调
  onClickLogo: PropTypes.func, // 点击logo 回调
  showRightBox: PropTypes.bool, // 是否右边的操作栏
  showCheckedImg: PropTypes.bool, // 是否展示选中语言展示的图片
  checkedImgUrl: PropTypes.string, // 选中语言展示的图片
  customRightOpt: PropTypes.any, // 自定义操作
  showAvatar: PropTypes.bool, // 是否展示头像框
  blockId: PropTypes.string, // 埋点的blockId
  sensorData: PropTypes.object, // 埋点的额外传递数据
};

AnniversaryHeader.defaultProps = {
  showLogo: true,
  showRightBox: true,
  logoUrl: undefined,
  customRightOpt: null,
  onClickGoBack: undefined,
  onClickLogo: undefined,
  showCheckedImg: false,
  checkedImgUrl: '',
  showAvatar: true, // 是否展示头像框
  blockId: null,
  sensorData: {},
  logoStyle: {},
};

export default AnniversaryHeader;
