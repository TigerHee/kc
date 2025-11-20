/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useCallback } from 'react'
import JumpImg from 'components/img/JumpImg'
import { useIsMobile } from 'components/Responsive';
import KSlider from '../components/KSlider'
import styles from './style.less'

/**
 * Kucoinlabs LatestUpdate
 * @param {{
 *  data: {
 *      id: string,
 *      link: string,
 *      mediaContent: string,
 *      title: string,
 *      publishDate: string
 *  }[]
 * }} props
 */
const LatestUpdate = (props) => {
    const { data } = props
    const isMobile = useIsMobile();
    const slidesToShow = Math.min(isMobile ? 2 : 3, data.length)
    const render = useCallback((item) => {
        const { id, link, mediaContent, title, publishDate } = item
        return (
            <div key={id} className={`sliderImg ${styles.item}`}>
                <JumpImg link={link} imgUrl={mediaContent} width={360} height={200} imgStyle={{ marginBottom: 36}} />
                <div style={{width: 360}}>
                    <div className='title'>{title}</div>
                    <div className='date'>{publishDate}</div>
                </div>
            </div>
        )
    })
    return (
        <div className={styles.container}>
            <div className="info">
                <div className="title">Latest update</div>
            </div>
            <div className={styles.kSlider}>
                <KSlider data={data} slidesToShow={slidesToShow} render={render} />
            </div>
        </div>
    )
}

export default LatestUpdate