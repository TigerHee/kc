/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import OGImageTh from '../static/th/og.png';
import TWImageTh from '../static/th/tw.png';
import ImageTR from '../static/tr/image-tr.png';
import TwitterTR from '../static/tr/twitter-tr.png';

import ImageEU from '../static/eu/image-eu.png';
import TwitterEU from '../static/eu/twitter-eu.png';

import ImageAU from '../static/au/image-au.png';
import TwitterAU from '../static/au/twitter-au.png';

import { bootConfig } from 'kc-next/boot';
import { getTenantConfig } from 'packages/seo/tenantConfig';
import SSRHelmet from '../SSRHelmet';

interface OgImageProps {
  imgSrc?: string;
  twitterImgSrc?: string;
  ssr?: boolean;
}

const defCard = 'summary_large_image';

const defaultImage: Record<
  string,
  {
    og: { image: string; imgWidth: number; imgHeight: number };
    twitter: { image: string; imgWidth: number; imgHeight: number };
  }
> = {
  KC: {
    og: {
      image: 'https://assets.staticimg.com/cms/media/7feiEEHmJE61RECXMyp8rTcA5Qcsl0zSv6rz9NVjg.png',
      imgWidth: 1200,
      imgHeight: 630,
    },
    twitter: {
      image: 'https://assets.staticimg.com/cms/media/7feiEEHmJE61RECXMyp8rTcA5Qcsl0zSv6rz9NVjg.png',
      imgWidth: 1200,
      imgHeight: 630,
    },
  },
  TR: {
    og: {
      image: ImageTR,
      imgWidth: 1200,
      imgHeight: 630,
    },
    twitter: {
      image: TwitterTR,
      imgWidth: 1200,
      imgHeight: 675,
    },
  },
  TH: {
    og: {
      image: OGImageTh,
      imgWidth: 1200,
      imgHeight: 630,
    },
    twitter: {
      image: TWImageTh,
      imgWidth: 1200,
      imgHeight: 675,
    },
  },
  AU: {
    og: {
      image: ImageAU,
      imgWidth: 1200,
      imgHeight: 630,
    },
    twitter: {
      image: TwitterAU,
      imgWidth: 1200,
      imgHeight: 675,
    },
  },
  EU: {
    og: {
      image: ImageEU,
      imgWidth: 1200,
      imgHeight: 630,
    },
    twitter: {
      image: TwitterEU,
      imgWidth: 1200,
      imgHeight: 675,
    },
  },
};

const OgImage: React.FC<OgImageProps> = ({ imgSrc = '', twitterImgSrc = '', ssr = true }) => {
  const imgTenantConfig = defaultImage[bootConfig._BRAND_SITE_] || defaultImage.KC;
  const [img, setImg] = useState<string>(imgTenantConfig.og.image);
  const [width, setWidth] = useState<number>(imgTenantConfig.og.imgWidth);
  const [height, setHeight] = useState<number>(imgTenantConfig.og.imgHeight);
  const [card, setCard] = useState<string>(defCard);
  const [twitterImg, setTwitterImg] = useState<string>(imgTenantConfig.twitter.image);

  const { ogAndTwitterSiteNameConfig } = getTenantConfig();

  useEffect(() => {
    if (!twitterImgSrc) return;

    const image = new Image();
    image.src = twitterImgSrc;
    image.onload = () => {
      if (image.width >= 300 && image.height >= 150) {
        setCard('summary_large_image');
      } else {
        setCard('summary');
      }
    };
    setTwitterImg(twitterImgSrc);
  }, [twitterImgSrc]);

  useEffect(() => {
    if (!imgSrc) return;

    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      setWidth(image.width);
      setHeight(image.height);
    };
    setImg(imgSrc);
  }, [imgSrc]);

  return (
    <SSRHelmet ssr={ssr}>
      <meta name="twitter:card" content={card} />
      <meta name="twitter:image" content={twitterImg} />
      <meta name="twitter:image:src" content={twitterImg} />
      {ogAndTwitterSiteNameConfig ? ogAndTwitterSiteNameConfig.twSiteName : null}

      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:width" content={width.toString()} />
      <meta property="og:image:height" content={height.toString()} />
      {ogAndTwitterSiteNameConfig ? ogAndTwitterSiteNameConfig.ogSiteName : null}
    </SSRHelmet>
  );
};

export default OgImage;
