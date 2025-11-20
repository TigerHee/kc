/**
 * Owner: iron@kupotech.com
 */
import { ICTriangleBottomOutlined } from '@kux/icons';
import { Accordion, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import React, { useCallback, useState } from 'react';
import LoaderComponent from '../../components/LoaderComponent';
import { useLang } from '../../hookTool';
import AnimateDropdown from '../AnimateDropdown';
import { long_language } from '../config';
import { CusAccordion, OverlayWrapper, TextWrapper } from './styled';

const Overlay = loadable(() => import('./Overlay'));

const { AccordionPanel: Panel } = Accordion;

export default (props) => {
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

  const { t } = useLang();
  const theme = useTheme();

  const overlayProps = {
    hostConfig,
    inDrawer,
    isLong_language,
    inTrade,
    currentLang,
    isSub,
    currency,
  };

  const onVisibleChange = useCallback((v) => {
    setState(v);
  }, []);

  if (inDrawer) {
    return (
      <CusAccordion>
        <Panel header={title} key={0}>
          <LoaderComponent show={inDrawer}>
            <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
          </LoaderComponent>
        </Panel>
      </CusAccordion>
    );
  }
  return (
    <AnimateDropdown
      visable={state}
      trigger="hover"
      onVisibleChange={onVisibleChange}
      overlay={
        <LoaderComponent show={state}>
          <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
        </LoaderComponent>
      }
      anchorProps={{ style: { 'display': 'block' } }}
      placement="bottom"
      inDrawer={inDrawer}
      keepMounted
    >
      <TextWrapper inTrade={inTrade}>
        {t('aQfpD2cHLtWKzCxZpt79qG')}
        <ICTriangleBottomOutlined size="12" className="arrow" color={theme.colors.icon60} />
      </TextWrapper>
    </AnimateDropdown>
  );
};
