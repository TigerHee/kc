/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PropTypes from 'prop-types';
import OGImageTh from '../../../static/th/og.png';
import TWImageTh from '../../../static/th/tw.png';
import ImageTR from '../../../static/tr/image-tr.png';
import TwitterTR from '../../../static/tr/twitter-tr.png';

import ImageEU from '../../../static/eu/image-eu.png';
import TwitterEU from '../../../static/eu/twitter-eu.png';

import ImageAU from '../../../static/au/image-au.png';
import TwitterAU from '../../../static/au/twitter-au.png';
import { tenantConfig } from '../../tenantConfig';

const defCard = 'summary_large_image';

const defaultImage = {
  'KC': {
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
  'TR': {
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
  'TH': {
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
  'AU': {
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
  'EU': {
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
const site = window._BRAND_SITE_ || 'KC';

const imgTenantConfig = defaultImage[site] || defaultImage.KC;

const OgImage = (props = {}) => {
  const { imgSrc, twitterImgSrc } = props;
  // 多租户
  const [img, setImg] = useState(imgTenantConfig.og.image);
  const [width, setWidth] = useState(imgTenantConfig.og.imgWidth);
  const [height, setHeight] = useState(imgTenantConfig.og.imgHeight);
  const [card, setCard] = useState(defCard);
  const [twitterImg, setTwitterImg] = useState(imgTenantConfig.twitter.image);

  const { ogAndTwitterSiteNameConfig } = tenantConfig;

  useEffect(() => {
    if (!twitterImgSrc) {
      return;
    }
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
    if (!imgSrc) {
      return;
    }
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      setWidth(image.width);
      setHeight(image.height);
    };
    setImg(imgSrc);
  }, [imgSrc]);

  return (
    <HelmetProvider>
      <Helmet>
        <meta name="twitter:card" content={card} />
        <meta name="twitter:image" content={twitterImg} />
        <meta name="twitter:image:src" content={twitterImg} />
        {ogAndTwitterSiteNameConfig ? ogAndTwitterSiteNameConfig.twSiteName : null}

        <meta property="og:image" content={img} />
        <meta property="og:image:secure_url" content={img} />
        <meta property="og:image:width" content={width} />
        <meta property="og:image:height" content={height} />
        {ogAndTwitterSiteNameConfig ? ogAndTwitterSiteNameConfig.ogSiteName : null}
      </Helmet>
    </HelmetProvider>
  );
};

OgImage.propTypes = {
  imgSrc: PropTypes.string,
  twitterImgSrc: PropTypes.string,
};

OgImage.defaultProps = {
  imgSrc: '',
  twitterImgSrc: '',
};

export default OgImage;
