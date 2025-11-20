/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PostCard from './PostCard';
import { List, SectionHeader, Index, Desc, ListItem, Wrapper } from './StyledComps';
import { ReactComponent as FacebookIcon } from 'assets/eth-merge/facebook.svg';
import { ReactComponent as YoutubeIcon } from 'assets/eth-merge/youtube.svg';
import { ReactComponent as TelegramIcon } from 'assets/eth-merge/telegram.svg';
import { ReactComponent as TwitterIcon } from 'assets/eth-merge/twitter.svg';
import { ReactComponent as DiscordIcon } from 'assets/eth-merge/discord.svg';
import { _t } from 'src/utils/lang';
import { communityArr } from './config';
import { useSelector } from 'dva';
import { sensors } from 'src/utils/sensors';

const IconMap = {
  Discord: DiscordIcon,
  Telegram: TelegramIcon,
  Twitter: TwitterIcon,
  Youtube: YoutubeIcon,
  FaceBook: FacebookIcon,
};

const Community = () => {
  const postDetail = useSelector(state => state.ethMerge.postDetail || []);
  return (
    <Wrapper>
      <Index>
        <SectionHeader>{_t('gpwDeecsfuiLAZ7Q4U5gmd')}</SectionHeader>
        <Desc>{_t('gb6kCQSBC1Pdfgj2F2BQgR')}</Desc>
        <>
          {postDetail.map(topic => {
            const { id: topicId, posts = [] } = topic;
            return <PostCard key={topicId} post={posts[0]} />;
          })}
        </>
        <List>
          {communityArr.map(item => {
            const [name, url, channelName] = item;
            const Icon = IconMap[name];
            return (
              <ListItem key={url}>
                <Icon />
                <a
                  href={url}
                  onClick={evt => {
                    sensors.trackClick(['Social Channel', '1']);
                  }}
                >
                  {channelName}
                </a>
              </ListItem>
            );
          })}
        </List>
      </Index>
    </Wrapper>
  );
};

export default Community;
