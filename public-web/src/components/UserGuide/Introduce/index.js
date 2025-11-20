/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICNoviceGuideOutlined, RightOutlined } from '@kux/icons';
import { map } from 'lodash';
import { memo } from 'react';
import { _t } from 'src/tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import { HeaderWrapper, IntroduceWrapper, ItemWrapper, MoreWrapper } from './styledComponents';

const Introduce = memo(({ introduces, moreUrl, introduceTitle }) => {
  const isInApp = JsBridge.isApp();

  return (
    <IntroduceWrapper data-inspector="app-video-introduce">
      <HeaderWrapper>
        <ICNoviceGuideOutlined />
        {introduceTitle()}
      </HeaderWrapper>
      {map(introduces, ({ text, url }, index) => {
        return (
          <ItemWrapper
            key={index}
            to={url}
            onClick={() => locateToUrlInApp(url)}
            dontGoWithHref={isInApp}
          >
            {text()}
            <RightOutlined />
          </ItemWrapper>
        );
      })}
      <div className="more">
        <MoreWrapper
          to={moreUrl}
          onClick={() => locateToUrlInApp(moreUrl)}
          dontGoWithHref={isInApp}
        >
          {_t('view.more')}
          <RightOutlined />
        </MoreWrapper>
      </div>
    </IntroduceWrapper>
  );
});
export default Introduce;
