/**
 * Owner: iron@kupotech.com
 */
import { TriangleBottomIcon } from '@kux/iconpack';
import { Collapse } from '@kux/design';
import clsx from 'clsx';
import loadable from '@loadable/component';
import React, { useCallback, useState } from 'react';
import LoaderComponent from '../../components/LoaderComponent';
import AnimateDropdown from '../AnimateDropdown';
import { long_language } from '../config';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';

const Overlay = loadable(() => import('./Overlay'));

export default props => {
  const {
    currentLang,
    currency,
    hostConfig,
    isSub = false,
    // className = '',
    inDrawer,
    title,
    inTrade,
  } = props;
  const [state, setState] = useState(false);
  const isLong_language = long_language.indexOf(currentLang) > -1;

  const { t } = useTranslation('header');

  const overlayProps = {
    hostConfig,
    inDrawer,
    isLong_language,
    inTrade,
    currentLang,
    isSub,
    currency,
  };

  const onVisibleChange = useCallback(v => {
    setState(v);
  }, []);

  // TODO: 参考 MenuDrawer 的写法
  if (inDrawer) {
    return (
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <TriangleBottomIcon className={clsx(styles.collapseIcon, isActive && styles.collapseIconActive)} />
        )}
        items={[
          {
            key: 0,
            title: title,
            content: (
              <LoaderComponent show={inDrawer}>
                <Overlay
                  {...overlayProps}
                  fallback={
                    <div
                      className={clsx(styles.overlayWrapper, {
                        [styles.overlayWrapperInTrade]: inDrawer,
                        [styles.overlayWrapperInTrade]: !inDrawer && inTrade,
                      })}
                      style={{ width: inDrawer ? 'auto' : isLong_language ? '340px' : '320px' }}
                    />
                  }
                />
              </LoaderComponent>
            ),
          },
        ]}
      ></Collapse>
    );
  }
  return (
    <AnimateDropdown
      visible={state}
      trigger="hover"
      onVisibleChange={onVisibleChange}
      overlay={
        <LoaderComponent show={state}>
          <Overlay
            {...overlayProps}
            fallback={
              <div
                className={clsx(styles.overlayWrapper, {
                  [styles.overlayWrapperInTrade]: inDrawer,
                  [styles.overlayWrapperInTrade]: !inDrawer && inTrade,
                })}
                style={{ width: inDrawer ? 'auto' : isLong_language ? '340px' : '320px' }}
              />
            }
          />
        </LoaderComponent>
      }
      anchorProps={{ style: { display: 'block' } }}
      placement="bottom"
      inDrawer={inDrawer}
      keepMounted
    >
      <div className={styles.textWrapper}>
        {t('aQfpD2cHLtWKzCxZpt79qG')}
        <TriangleBottomIcon size={12} className={styles.arrow} color="var(--kux-icon60)" />
      </div>
    </AnimateDropdown>
  );
};
