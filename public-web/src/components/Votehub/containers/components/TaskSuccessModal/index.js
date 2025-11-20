/**
 * Owner: jessie@kupotech.com
 */
import { ICCloseOutlined } from '@kux/icons';
import { Button } from '@kux/mui';
import LottieProvider from 'components/LottieProvider';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import star1 from 'static/votehub/star1.svg';
import star2 from 'static/votehub/star2.svg';
import star3 from 'static/votehub/star3.svg';
import successBg from 'static/votehub/successBg.png';
import successBgDark from 'static/votehub/successBgDark.png';
import successCoin from 'static/votehub/successCoin.png';
import successCoinDark from 'static/votehub/successCoinDark.png';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../../../hooks';
import { MaskWrapper } from './styledComponents';

export default () => {
  const dispatch = useDispatch();
  const size = useResponsiveSize();
  const taskSuccessNum = useSelector((state) => state.votehub.taskSuccessNum);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const onClose = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        taskSuccessModal: false,
      },
    });
  }, [dispatch]);

  return (
    <MaskWrapper className="in">
      <div className="dialog">
        <div className="bgWrapper">
          <LottieProvider iconName="pop_up_bg_light_green_web" speed={1} loop={false} />
        </div>
        <div className="contentDialog">
          <div className="header">
            <span>{_t('ds5wcmvak4vS1ebERE78HE')}</span>
            {size !== 'sm' ? (
              <span className="close" role="button" tabIndex={-1} onClick={onClose}>
                <ICCloseOutlined />
              </span>
            ) : null}
          </div>
          <div className="content">
            <img src={star1} alt="star" className="star1" />
            <img src={star2} alt="star" className="star2" />
            <img src={star3} alt="star" className="star3" />
            <img
              src={currentTheme === 'light' ? successBg : successBgDark}
              alt="bg"
              className="successBg"
            />
            <img
              src={currentTheme === 'light' ? successCoin : successCoinDark}
              alt="border"
              className="successCoin"
            />
            <div className="info">
              <div className="value">× {taskSuccessNum} </div>
              <div className="name">{_t('mXjmgDLZ4EvyZXZDVHysgp')}</div>
            </div>
          </div>
          <Button onClick={onClose} fullWidth size={size === 'sm' ? 'basic' : 'large'}>
            {_t('eww1PuWjvpLHhjvANh5Af1')}
          </Button>
        </div>
        {size === 'sm' ? (
          <div className="closeWrapper">
            <span className="close" onClick={onClose} role="button" tabIndex={-1}>
              <ICCloseOutlined />
            </span>
          </div>
        ) : null}
      </div>
    </MaskWrapper>
  );
};
