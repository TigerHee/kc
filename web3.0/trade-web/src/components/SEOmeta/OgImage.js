/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const ogImage =
  'https://assets.staticimg.com/cms/media/7feiEEHmJE61RECXMyp8rTcA5Qcsl0zSv6rz9NVjg.png';
const ogImgWidth = 1200;
const ogImgHeight = 630;
const defCard = 'summary_large_image';

const OgImage = (props = {}) => {
  const { imgSrc } = props;
  const [img, setImg] = useState(ogImage);
  const [width, setWidth] = useState(ogImgWidth);
  const [height, setHeight] = useState(ogImgHeight);
  const [card, setCard] = useState(defCard);

  useEffect(() => {
    if (!imgSrc) {
      return;
    }
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      setWidth(image.width);
      setHeight(image.height);
      if (image.width >= 300 && image.height >= 150) {
        setCard('summary_large_image');
      } else {
        setCard('summary');
      }
    };
    setImg(imgSrc);
  }, [imgSrc]);

  return (
    <Helmet>
      <meta name="twitter:card" content={card} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:src" content={img} />
      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:width" content={width} />
      <meta property="og:image:height" content={height} />
    </Helmet>
  );
};

export default OgImage;
