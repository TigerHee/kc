/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'dva';
import { useHistory } from 'react-router';
import { map, reduce } from 'lodash';
import classname from 'classname';
import { Button, Tooltip } from '@kufox/mui';
import ByVisible from 'components/$/LeGo/hocs/ByVisible';
import { _t } from 'utils/lang';
import { kcsensorsClick } from 'utils/ga';
import { openPage } from 'helper';
import { getText } from 'components/$/LeGo/config';
import { useIsMobile } from 'components/Responsive';
import { getSignUpUrl, handleSignUp } from 'components/$/MarketCommon/config';
import { ReactComponent as ArrowIcon } from 'assets/lego/arrow-right.svg';
import styles from './index.less';

const getListId = (idx) => {
  return `_lego_promotion_step_row_${idx}`;
}

const syncTitleHeight = (idx) => {
  const id = getListId(idx);
  const list = document.querySelector(`#${id}`);
  if (!list) return;
  const titleList = Array.from(list.querySelectorAll('[data-step-tlt]'));
  return reduce(titleList, (maxHeight, el) => {
    const h = el.clientHeight || 0;
    return h > maxHeight ? h : maxHeight;
  }, 0);
};

const StepItem = React.memo(
  ({ title = '', desc = '', weblink = '', applink = '', row = '', col = '', rowLen = 0 }) => {
    const {
      location: { pathname },
    } = useHistory();
    const { isInApp, supportCookieLogin } = useSelector(state => state.app);
    const { isLogin } = useSelector(state => state.user);
    const { channelCode = '', legoNameEn = '' } = useSelector(state => state.lego.config);
    const { isAe } = useSelector(state => state.lego);
    const [titleHeight, updateTitle] = useState(0);
    const isMobile = useIsMobile();
    // 是预览页
    const isPreview = pathname.includes('/promotions-preview/');

    const tryPage = () => {
      try {
        if (isInApp) {
          openPage(isInApp, applink);
        } else {
          openPage(isInApp, weblink);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const gotoPage = () => {
      kcsensorsClick([`step_${row}_${col}_${legoNameEn}`, '1']);
      // 预览页无需判断登陆态
      if (isPreview) {
        tryPage();
        return;
      }

      if (isLogin) {
        tryPage();
      } else {
        handleSignUp(isInApp, supportCookieLogin, getSignUpUrl(channelCode));
      }
    };

    useEffect(() => {
      if (rowLen < 2 || isMobile) {
        updateTitle(0);
        return;
      }
      setTimeout(() => {
        const height = syncTitleHeight(row);
        if (!height || height < 10) {
          updateTitle(0);
          return;
        };
        updateTitle(height);
      }, 10);
    }, [rowLen, row, isMobile]);

    const titleStyles = useMemo(() => {
      if (titleHeight < 1) return {};
      return {
        height: `${titleHeight}px`,
      };
    }, [titleHeight]);

    return (
      <div className={classname(styles.stepsItem, { [styles.stepsItemRever]: isAe })}>
        <div
          className={classname(styles.step, {
            [styles.single_bg]: !isMobile && rowLen < 2,
          })}
        >
          <Tooltip placement="top-start" title={title}>
            <p className={styles.stepTitle} data-step-tlt style={titleStyles}>
              <span>{title}</span>
            </p>
          </Tooltip>
        </div>
        <div className={styles.stepContent}>
          <p className={styles.stepDesc} data-step-desc>
            {desc}
          </p>
          <Button
            data-step-btn
            className={styles.stepButton}
            type="primary"
            size="small"
            onClick={() => {
              gotoPage();
            }}
          >
            <span>{_t('newCoin.step.go')}</span>
            <ArrowIcon className={styles.arrowRight} />
          </Button>
        </div>
      </div>
    );
  },
);

const Step = ({ content }) => {
  const { translate } = useSelector(state => state.lego);

  const getStepRowSize = (steps = []) => {
    return reduce(steps, (size, el) => {
      const title = getText(el.title, translate);
      const desc = getText(el.desc, translate);
      // title 和 描述同时不存在 则不展示
      if (!title && !desc) return size;
      return size + 1;
    }, 0);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h2 className={styles.title} data-step-title>
          {getText(content.title, translate)}
        </h2>
        <div>
          {map(content.steps, (item, idx) => {
            const rowLen = getStepRowSize(item.data || []);
            return (
              <div className={styles.steps} key={idx} id={getListId(idx + 1)}>
                {map(item.data, (el, index) => {
                  const title = getText(el.title, translate);
                  const desc = getText(el.desc, translate);
                  // title 和 描述同时不存在 则不展示
                  if (!title && !desc) {
                    return null;
                  }
                  return (
                    <StepItem
                      weblink={getText(el.weblink, translate)}
                      applink={getText(el.applink, translate)}
                      title={title}
                      desc={desc}
                      row={idx + 1}
                      col={index + 1}
                      key={index}
                      rowLen={rowLen}
                    />
                  );
                })}
              </div>
            )
          })}
        </div>
        <ByVisible visible={content.commentVisible}>
          <p className={styles.stepsInfo}>{getText(content.comment, translate)}</p>
        </ByVisible>
      </div>
    </div>
  );
};

export default React.memo(Step);
