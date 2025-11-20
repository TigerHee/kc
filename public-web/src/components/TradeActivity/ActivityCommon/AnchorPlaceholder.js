/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { styled } from '@kux/mui';
import debounce from 'lodash/debounce';
import { memo, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

const AnchorWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: ${({ top }) => `-${top}px`}};
`;

const AnchorPlaceholder = memo(({ id }) => {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();

  const headerHeight = useSelector((state) => state.app.headerHeight);
  const isShowRestrictNotice = useSelector((state) => state.$header_header?.isShowRestrictNotice);

  const getTabBarOffSetTop = useCallback(
    debounce(() => {
      let top = 0;
      const headerEle = document.querySelector(isInApp ? '.app-custom-header' : '.gbiz-headeroom');
      top = headerEle?.clientHeight || 0;

      dispatch({
        type: 'app/update',
        payload: {
          headerHeight: top,
        },
      });
    }, 60),
    [dispatch, isShowRestrictNotice, isInApp],
  );

  useEffect(() => {
    getTabBarOffSetTop();
  }, [getTabBarOffSetTop]);

  useEffect(() => {
    window.addEventListener('resize', getTabBarOffSetTop);
    return () => {
      window.removeEventListener('resize', getTabBarOffSetTop);
    };
  }, [getTabBarOffSetTop]);

  return <AnchorWrapper id={id} className="anchor" top={headerHeight} />;
});

export default AnchorPlaceholder;
