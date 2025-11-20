/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useMemo } from 'react';
import { map } from 'lodash';
import JumpImg from 'components/img/JumpImg'
import { setTwoDimensionalArray } from 'utils/array'
import { useIsMobile } from 'components/Responsive';
import KSlider from '../components/KSlider'
import styles from './style.less';

/**
 * Kucionlabs Partnership
 * @param {{
 *  data: {
 *    link: string,
 *    mediaContent: string,
 *    id: string
 *  }[]
 * }} props
 */
const Partnership = (props) => {
  const { data = [] } = props
  const isMobile = useIsMobile();
  const formatList = useMemo(() => {
    return setTwoDimensionalArray(data, isMobile ? 12 : 15);
  }, [data, isMobile])
  return (
    <div className={styles.container}>
      <div className={styles.partnership}>
        <div className={styles.title} inspector="partnership_title">{window._BRAND_NAME_} Labs Partnership</div>
        <div className={styles.sliderWrapper}>
          <KSlider data={formatList} slidesToShow={1} render={(list, index) => {
            return (
              <div key={index} className={styles.sliderContent} inspector="partnership_item">{
                map(list, ({ link, mediaContent, id }) => {
                  return (
                    <JumpImg key={id} className={styles.item} link={link} imgUrl={mediaContent} />
                  );
                })
              }</div>
            )
          }} />
        </div>
      </div>
    </div>
  );
};
export default Partnership;
