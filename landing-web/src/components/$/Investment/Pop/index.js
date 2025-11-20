/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import _ from 'lodash';
import classname from 'classname';
import { connect } from 'dva';
import { _tHTML } from 'utils/lang';
import { useIsMobile } from 'components/Responsive';
import { px2rem } from 'helper';
import styles from './style.less';

const Pop = ({ currentLang }) => {
  const isMobile = useIsMobile();

  const scale = isMobile ? (359 / 700) : 1;

  const nodes = useMemo(() => {
    const orig = [
      { size: 139, dark: true, top: 241, left: '1.45%', text: _tHTML('invest.pop1') },
      { size: 87, dark: false, top: 431, left: '7.6%', text: '' },
      { size: 87, dark: true, top: 36, left: '13.5%', text: '' },
      { size: 195, dark: true, top: 235, left: '13.5%', text: _tHTML('invest.pop2') },
      { size: 69, dark: true, top: 431, left: '26.3%', text: '' },
      { size: 195, dark: false, top: 115, left: '27.65%', text: _tHTML('invest.pop3') },
      { size: 82, dark: true, top: 319, left: '37.81%', text: _tHTML('invest.pop4') },
      { size: 107, dark: false, top: 16, left: '39.5%', text: _tHTML('invest.pop5') },
      { size: 171, dark: false, top: 337, left: '45.1%', text: _tHTML('invest.pop6') },
      { size: 219, dark: true, top: 87, left: '52.76%', text: _tHTML('invest.pop7') },
      { size: 219, dark: true, top: 289, left: '65.52%', text: _tHTML('invest.pop8') },
      { size: 119, dark: false, top: 16, left: '65.93%', text: _tHTML('invest.pop9') },
      { size: 219, dark: false, top: 154, left: '77.86%', text: _tHTML('invest.pop10') },
      { size: 117, dark: true, top: 479, left: '79.74%', text: _tHTML('invest.pop11') },
      { size: 87, dark: true, top: 107, left: '91.875%', text: '' },
    ];

    return _.map(orig, (item) => {
      return {
        ...item,
        size: scale * item.size,
        top: scale * item.top,
        // left: `${parseFloat(item.left) * scale}%`,
      };
    });
  }, [currentLang, scale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={styles.pop}
    >
      <div className={styles.wrapper}>
        {_.map([1, 2], (i) => {
          return (
            <div key={i} className={styles.container}>
              {_.map(nodes, ({ size, dark, top, left, text }, index) => {
                const random = Math.random();

                const cls = classname({
                  [styles.node]: true,
                  [styles.dark]: dark,
                  [styles.an1]: random > 0.75,
                  [styles.an2]: random > 0.5 && random <= 0.75,
                  [styles.an3]: random > 0.25 && random <= 0.5,
                  [styles.an4]: random <= 0.25,
                });

                return (
                  <div
                    className={cls}
                    key={index}
                    style={{
                      left,
                      top: isMobile ? px2rem(top) : top,
                      width: isMobile ? px2rem(size) : size,
                      height: isMobile ? px2rem(size) : size,
                      borderRadius: isMobile ? px2rem(size/2) : (size/2),
                      fontSize: isMobile ? px2rem(13*size/87.5) : `${34*size/219}px`,
                      lineHeight: isMobile ? px2rem(13*size/87.5) : `${34*size/219}px`,
                      animationDuration: `${(random + 1) * 9}s`,
                    }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connect(state => {
  return {
    currentLang: state.app.currentLang,
  };
})(Pop);
