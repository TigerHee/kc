/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import PropTypes from 'prop-types';
import classname from 'classname';
import arrowLeft from 'assets/registration/arrow_left_off.svg';
import arrowRight from 'assets/registration/arrow_right_off.svg';
import styles from './style.less';

export function Carousel(props) {
  const { isMobile = false } = props
  const [slideTotal, setSlideTotal] = useState(0);
  const [slideCurrent, setSlideCurrent] = useState(-1);
  const [slides, setSlides] = useState([]);
  const [height, setHeight] = useState('0px');
  const intervalRef = useRef(null);
  const handlers = useSwipeable({
    onSwipedLeft: () => slideRight(),
    onSwipedRight: () => slideLeft(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  useEffect(() => {
    const locSlides = [];
    props.slides.forEach(slide => {
      const slideobject = {
        class: classname([styles.sliderSingle, styles.proactivede]),
        ...slide,

      };
      locSlides.push(slideobject);
    });
    if (props.slides.length === 2) {
      props.slides.forEach(slide => {
        const slideobject = {
          class: classname([styles.sliderSingle, styles.proactivede]),
          ...slide,
        };
        locSlides.push(slideobject);
      });
    }
    setSlides(locSlides);
    setSlideTotal(locSlides.length - 1);
    setSlideCurrent(-1);
    //console.log(slideCurrent);
    if (slideCurrent === -1) {
      setTimeout(() => {
        slideRight();
        if (props.autoplay) {
          intervalRef.interval = setTimeout(() => {
            slideRight();
          }, props.interval);
        }
      }, 500);
    }
  }, [props.slides]);
  useEffect(() => {
    if (slideCurrent === -1) {
      setTimeout(() => {
        slideRight();
      }, 500);
    }
  }, [slides, slideCurrent]);

  const slideRight = () => {
    let preactiveSlide;
    let proactiveSlide;
    let slideCurrentLoc = slideCurrent;

    const activeClass = classname([styles.sliderSingle, styles.active]);
    const slide = [...slides];
    if (slideTotal > 1) {
      if (slideCurrentLoc < slideTotal) {
        slideCurrentLoc++;
      } else {
        slideCurrentLoc = 0;
      }
      if (slideCurrentLoc > 0) {
        preactiveSlide = slide[slideCurrentLoc - 1];
      } else {
        preactiveSlide = slide[slideTotal];
      }
      const activeSlide = slide[slideCurrentLoc];
      if (slideCurrentLoc < slideTotal) {
        proactiveSlide = slide[slideCurrentLoc + 1];
      } else {
        proactiveSlide = slide[0];
      }

      slide.forEach((slid, index) => {
        if (slid.class.includes('preactivede')) {
          slid.class = classname([styles.sliderSingle, styles.proactivede]);
        }
        if (slid.class.includes('preactive')) {
          slid.class = classname([styles.sliderSingle, styles.preactivede]);
        }
      });

      preactiveSlide.class = classname([styles.sliderSingle, styles.preactive, isMobile && styles.preactiveH5]);
      activeSlide.class = activeClass;
      proactiveSlide.class = classname([styles.sliderSingle, styles.proactive, isMobile && styles.proactiveH5]);
      setSlides(slide);
      setSlideCurrent(slideCurrentLoc);

      if (document.getElementsByClassName(`${styles.sliderSingle} ${styles.active}`).length > 0) {
        setTimeout(() => {
          if (
            document.getElementsByClassName(`${styles.sliderSingle} ${styles.active}`).length > 0
          ) {
            const height = document.getElementsByClassName(
              `${styles.sliderSingle} ${styles.active}`,
            )[0].clientHeight;
            setHeight(`${height}px`);
          }
        }, 500);
      }
      if (props.autoplay) {
        clearTimeout(intervalRef.interval);
        intervalRef.interval = setTimeout(() => {
          slideRight();
        }, props.interval);
      }
    } else if (slide[0] && slide[0].class !== activeClass) {
      slide[0].class = activeClass;
      setSlides(slide);
      setSlideCurrent(0);
    }
  };
  const slideLeft = () => {
    if (slideTotal > 1) {
      let preactiveSlide;
      let proactiveSlide;
      let slideCurrentLoc = slideCurrent;
      const slide = [...slides];
      if (slideCurrentLoc > 0) {
        slideCurrentLoc--;
      } else {
        slideCurrentLoc = slideTotal;
      }

      if (slideCurrentLoc < slideTotal) {
        proactiveSlide = slide[slideCurrentLoc + 1];
      } else {
        proactiveSlide = slide[0];
      }
      let activeSlide = slide[slideCurrentLoc];
      if (slideCurrentLoc > 0) {
        preactiveSlide = slide[slideCurrentLoc - 1];
      } else {
        preactiveSlide = slide[slideTotal];
      }
      slide.forEach((slid, index) => {
        if (slid.class.includes('proactivede')) {
          slid.class = classname([styles.sliderSingle, styles.preactivede]);
        }
        if (slid.class.includes('proactive')) {
          slid.class = classname([styles.sliderSingle, styles.proactivede]);
        }
      });
      preactiveSlide.class = classname([styles.sliderSingle, styles.preactive, isMobile && styles.preactiveH5]);
      activeSlide.class = classname([styles.sliderSingle, styles.active]);
      proactiveSlide.class = classname([styles.sliderSingle, styles.proactive, isMobile && styles.proactiveH5]);
      setSlides(slide);
      setSlideCurrent(slideCurrentLoc);
      if (document.getElementsByClassName(`${styles.sliderSingle} ${styles.active}`).length > 0) {
        setTimeout(() => {
          if (
            document.getElementsByClassName(`${styles.sliderSingle} ${styles.active}`).length > 0
          ) {
            const height = document.getElementsByClassName(
              `${styles.sliderSingle} ${styles.active}`,
            )[0].clientHeight;
            setHeight(`${height}px`);
          }
        }, 500);
      }
    }
  };

  const sliderClass = direction => {
    let sliderClass = `slider${direction}`;
    if (!props.arrows) {
      sliderClass = 'sliderDisabled';
    } else if (props.arrows && !props.arrowBorders) {
      sliderClass = `slider${direction}Noborders`;
    }
    return sliderClass;
  };

  return (
    <div className={styles.reactCarousel} style={{ height }} {...handlers}>
      {slides && slides.length > 0 && (
        <div className={styles.sliderContainer}>
          <div className={styles.sliderContent}>
            {slides.map((slider, index) => (
              <div className={classname([slider.class])} key={index}>
                <div className={styles.sliderSingleContent}>{slider.element}</div>
                <div className={styles.sliderTitle}>{slider.title}</div>
                <div className={styles.sliderQuote}>{slider.quote}</div>
                <div className={classname([isMobile && styles.sliderBtnGroup])}>
                  <div className={classname([styles[sliderClass('Left')], isMobile && styles.leftH5])} onClick={slideLeft}>
                    <img src={arrowLeft} alt="" />
                  </div>
                  <div className={classname([styles[sliderClass('Right')], isMobile && styles.rightH5])} onClick={slideRight}>
                    <img src={arrowRight} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
Carousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.object),
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
  arrows: PropTypes.bool,
  arrowBorders: PropTypes.bool,
};
Carousel.defaultProps = {
  autoplay: false,
  interval: 3000,
  arrows: true,
  arrowBorders: true,
};
