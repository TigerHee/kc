/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { Tabs } from '@kc/ui';
import { connect } from 'react-redux';
import AbsoluteLoading from 'components/AbsoluteLoading';
import { ActivityType } from 'config/base';
import { withRouter } from 'components/Router';
import Competition from './Template/Competition';
import AirDrop from './Template/AirDrop';
import Universal from './Template/Universal';
import Vote from './Template/Vote';
import Spotlight from './Template/Spotlight';
import Spotlight2 from './Template/Spotlight2';
import Distribute from './Template/Distribute';
import Spotlight5 from './Template/Spotlight5';
import Spotlight6 from './Template/Spotlight6';
import Spotlight7 from './Template/Spotlight7';
import Spotlight8 from './Template/Spotlight8';

import style from './style.less';
import Banner from './module/Banner';

const { TabPane } = Tabs;

const template = {
  [ActivityType.RANK]: (item) => {
    return <Competition item={item} />;
  },
  [ActivityType.AIRDROP]: (item) => {
    return <AirDrop item={item} />;
  },
  [ActivityType.UNIVERSAL]: (item) => {
    return <Universal item={item} />;
  },
  [ActivityType.VOTE]: (item) => {
    return <Vote item={item} />;
  },
  [ActivityType.SPOTLIGHT]: (item, id) => {
    return <Spotlight item={item} id={id} />;
  },
  [ActivityType.SPOTLIGHT2]: (item) => {
    return <Spotlight2 item={item} />;
  },
  [ActivityType.DISTRIBUTE]: (item) => {
    return <Distribute item={item} />;
  },
  [ActivityType.SPOTLIGHT5]: (item, id) => {
    return <Spotlight5 item={item} id={id} />;
  },
  [ActivityType.SPOTLIGHT6]: (item, id) => {
    return <Spotlight6 item={item} id={id} />;
  },
  [ActivityType.SPOTLIGHT7]: (item, id) => {
    return <Spotlight7 item={item} id={id} />;
  },
  [ActivityType.SPOTLIGHT8]: (item, id) => {
    return <Spotlight8 item={item} id={id} />;
  },
};

@connect((state) => {
  const { pageData } = state.activity;
  return {
    pageData,
  };
})
@withRouter()
export default class Index extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      query: { id },
    } = this.props;

    // 适配新类型id_name 旧类型不受影响
    const activityId = this.getNewId(id);
    dispatch({
      type: 'activity/filter',
      payload: {
        id: activityId,
      },
    });
  }

  componentWillUnmount() {
    const {
      dispatch,
      // query: { id },
    } = this.props;

    // const activityId = this.getNewId(id);
    // TODO 遇到访问量大的活动，在此处修改 id,开启缓存请求
    // if (+activityId === 86) {
    //   setOnCache(false);
    // }

    dispatch({
      type: 'activity/reset',
    });
  }

  getNewId = (id) => {
    const idStr = `${id}`;
    if (idStr.indexOf('_') > -1) {
      return idStr.split('_')[0];
    } else {
      return id;
    }
  };

  getContent = () => {
    const {
      pageData,
      query: { id },
    } = this.props;
    const { activity } = pageData;
    if (activity.length === 1) {
      const item = activity[0];
      const { type } = item;
      return template[type](item, id);
    }
    return (
      <Tabs defaultActiveKey="0">
        {activity.map((item, idx) => {
          const { type } = item;
          return (
            <TabPane tab={item.tag_name} key={idx}>
              {template[type](item, id)}
            </TabPane>
          );
        })}
      </Tabs>
    );
  };

  render() {
    const { pageData } = this.props;
    if (!pageData) {
      return <AbsoluteLoading />;
    }

    const { activity } = pageData;
    const findSpotlight = (activity || []).filter(({ type }) => {
      const excludeArr = [
        ActivityType.SPOTLIGHT,
        ActivityType.SPOTLIGHT2,
        ActivityType.DISTRIBUTE,
        ActivityType.SPOTLIGHT5,
        ActivityType.SPOTLIGHT6,
        ActivityType.SPOTLIGHT7,
        ActivityType.SPOTLIGHT8,
      ];
      return _.indexOf(excludeArr, type) > -1;
    });
    const noSpotlight = findSpotlight.length === 0;

    return (
      <div className={style.activityPageWrapper}>
        {noSpotlight && !!pageData.image_url && <Banner imgUrl={pageData.image_url} />}
        <div className={style.activityPageContent}>{this.getContent()}</div>
      </div>
    );
  }
}
