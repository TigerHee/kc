/**
 * Owner: solar.xia@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Carousel } from '@kux/mui';
import { forwardRef, useEffect, useRef, useState } from 'react';
import maker1 from 'static/aptp/maker-step1.svg';
import { default as maker2, default as taker2 } from 'static/aptp/maker-taker-step2.svg';
import { default as maker3, default as taker3 } from 'static/aptp/maker-taker-step3.svg';
import taker1 from 'static/aptp/taker-step1.svg';
import { _t } from 'tools/i18n';
import { ProcessContainer, StyledProcess, StyledRoleTabs, StyledSlider } from '../styledComponents';

const tabs = [
  _t('8hW3WSiLh5o8o7amgQL416'),
  _t('cfMYWKUgeW7McmYXEKeR6K'),
  _t('tkbyvmzRoM2NKXsSxCU6zQ'),
  _t('oZwNDadJUJuuFtSLuUYqks'),
];
const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};
const Process = forwardRef((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef();
  const { isRTL } = useLocale();
  const processBtnRefs = useRef([]);
  const btnContainerRef = useRef();

  useEffect(() => {
    carouselRef.current.slickGoTo(currentIndex);
  }, [currentIndex]);

  const data = [
    [
      {
        icon: maker1,
        text: _t('cernoQuef6qPYLWaWBDHJv'),
      },
      {
        icon: maker2,
        text: _t('fnMFkT8YbtX3ug1DerBvWv'),
      },
      {
        icon: maker3,
        text: _t('goYrXhhsLFuzL1eWrNSS6b'),
      },
    ],
    [
      {
        icon: taker1,
        text: _t('1a2e317e558c4000a0ef'),
      },
      {
        icon: taker2,
        text: _t('2523209627b24000a860'),
      },
      {
        icon: taker3,
        text: _t('5e6cb66c31584000aa1f'),
      },
    ],
    [
      {
        icon: maker1,
        text: _t('fKYFT7JTk6jRu4dTD8V1FW'),
      },
      {
        icon: maker2,
        text: _t('mtaNo1SmMQRmo9hnshSXxV'),
      },
      {
        icon: maker3,
        text: _t('rEY8XPkk3C3mymbkLYr4xu'),
      },
    ],
    [
      {
        icon: taker1,
        text: _t('uGNrszQPf7m9NCx1FCgbJX'),
      },
      {
        icon: taker2,
        text: _t('vNWM4ZQdGqarffkrUnPzsJ'),
      },
      {
        icon: taker3,
        text: _t('sa7Ur1gRrX2DW8dFe5gjMF'),
      },
    ],
  ];

  return (
    <StyledProcess ref={ref} data-inspector="inspector_premarket_process">
      <ProcessContainer>
        <h2>{_t('7qnodEvdM3qZb3VtQhyw5S')}</h2>
        <StyledRoleTabs isRTL={isRTL} ref={btnContainerRef}>
          <ul>
            {tabs.map((name, index) => (
              <li
                ref={(_ref) => (processBtnRefs.current[index] = _ref)}
                onClick={() => {
                  // 使按钮也能滑动到可视的区域内
                  const { x } = processBtnRefs.current[index]?.getBoundingClientRect?.() || {
                    x: 0,
                  };
                  const { x: containerX } = btnContainerRef.current?.getBoundingClientRect?.() || {
                    x: 0,
                  };
                  btnContainerRef.current.scrollTo({ left: x - containerX, behavior: 'smooth' });
                  setCurrentIndex(index);
                }}
                role="button"
                tabIndex="0"
                key={name}
                className={currentIndex === index ? 'actived' : undefined}
              >
                {name}
              </li>
            ))}
          </ul>
        </StyledRoleTabs>
        <StyledSlider>
          <Carousel
            {...settings}
            ref={carouselRef}
            afterChange={(idx) => {
              setCurrentIndex(idx);
            }}
            rtl={isRTL}
          >
            {data.map((items, index) => (
              <div key={index}>
                <ul>
                  {items.map((item, _index, { length }) => (
                    <li key={_index}>
                      <section>
                        <img src={item.icon} alt="" />
                        {_index !== length - 1 && <div className="divider" />}
                      </section>
                      <article>
                        {/* <h2>{item.title}</h2> */}
                        <p>{item.text}</p>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Carousel>
        </StyledSlider>
      </ProcessContainer>
    </StyledProcess>
  );
});

export default Process;
