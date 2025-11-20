/**
 * Owner: sean.shi@kupotech.com
 */
import { useRef } from 'react';
import { Avatar, Divider, Carousel, Tooltip } from '@kux/mui';
import useIsMobile from '../../../hooks/useIsMobile';
import clsx from 'clsx';
import { useLang } from '../../../hookTool';
import { InviterState } from '../../model';
import { getUserFlag, getUserNickname } from '../../../common/tools';
import styles from './index.module.scss';

type CampaignType = NonNullable<Required<InviterState['data']>>['campaigns'][number];

function CampaignItem({
  campaign,
  _t,
  isH5,
}: {
  campaign: CampaignType;
  _t: (k: string, v?: any) => string;
  isH5: boolean;
}) {
  return (
    <div className={styles.campaignItem}>
      <div className={styles.campaignItemIcon}>{_t('d7f73574d8024000a5bf')}</div>
      <div className={styles.campaignItemContent}>
        {isH5 ? (
          <>
            <Tooltip trigger="click" title={campaign.title} placement="top">
              <div className={styles.campaignItemTitle}>{campaign.title}</div>
            </Tooltip>
            <Tooltip trigger="click" title={campaign.desc} placement="top">
              <div className={styles.campaignItemDesc}>{campaign.desc}</div>
            </Tooltip>
          </>
        ) : (
          <>
            <div className={styles.campaignItemTitle}>{campaign.title}</div>
            <div className={styles.campaignItemDesc}>{campaign.desc}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function InviterCard({ inviterInfo }: { inviterInfo?: InviterState['data'] }) {
  const { t: _t } = useLang();
  const isH5 = useIsMobile();
  const sliderRef = useRef<any>(null);

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    vertical: false,
    adaptiveHeight: true,
  };

  return inviterInfo ? (
    <div className={styles.container}>
      <div className={styles.layoutTop}>
        <div>
          {inviterInfo.avatar ? (
            <Avatar src={inviterInfo.avatar} size={isH5 ? 41 : 80} />
          ) : (
            <span className={styles.userFlag}>{getUserFlag(inviterInfo)}</span>
          )}
        </div>
        <div className={styles.layoutRight}>
          <div className={styles.nickname}>{getUserNickname(inviterInfo)}</div>
          <div className={styles.rcode}>
            {_t('b92d97fd317c4000afe2')}&nbsp;
            {inviterInfo.rcode}
          </div>
          {isH5 ? null : <div className={styles.message}>{inviterInfo.message}</div>}
        </div>
      </div>
      {isH5 && <div className={clsx(styles.message, styles.h5Message)}>{inviterInfo.message}</div>}
      <Divider className={styles.dividerLine} />
      {inviterInfo.campaigns ? (
        <div className={styles.layoutBottom}>
          <div className={styles.campaignsTitle}>
            {_t('2a73b72f3e914800a6bc', { nickName: getUserNickname(inviterInfo) })}
          </div>
          <div className={styles.campaignsList}>
            {isH5 ? (
              <Carousel {...settings}>
                {inviterInfo.campaigns.map((campaign) => (
                  <CampaignItem isH5={isH5} key={campaign.id} campaign={campaign} _t={_t as any} />
                ))}
              </Carousel>
            ) : (
              inviterInfo.campaigns.map((campaign) => (
                <CampaignItem isH5={isH5} key={campaign.id} campaign={campaign} _t={_t as any} />
              ))
            )}
          </div>
        </div>
      ) : null}
      {inviterInfo.cashbackRatio ? <div className={styles.tag}>{inviterInfo.cashbackRatioText}</div> : null}
    </div>
  ) : null;
}

export default InviterCard;


