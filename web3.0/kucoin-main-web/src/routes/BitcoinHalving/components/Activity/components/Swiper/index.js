/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addLangToPath } from 'src/tools/i18n';
import moment from 'moment';
import {
  Wrapper,
  Card,
  Container,
  CardWrapper,
  PointerWrapper,
  Point,
  CardTitle,
  Info,
  Mask,
} from './index.style';

const COUNT = 3;

//显示三张，两张轮播
export default ({ list }) => {
  const cardRef = useRef();
  const containerRef = useRef();
  const animateLeftRef = useRef(true);
  const [cardWidth, setCardWidth] = useState(400);
  const [refresh, setRefresh] = useState();
  const timer = useRef();
  const changeCard = useRef(false);
  const cardInfo = useRef({
    active: 1,
    cardLeft: 0,
  });

  const animate = useCallback((isLeft = false) => {
    const cardWidth = cardRef.current?.offsetWidth;
    const cardLeft = cardInfo.current.cardLeft;
    const active = cardInfo.current.active;
    let newleft = cardLeft + cardWidth;
    let newActiveIndex = active;
    if (isLeft) {
      newleft = cardLeft - cardWidth;
      newActiveIndex++;
    } else {
      newActiveIndex--;
    }
    cardInfo.current.active = newActiveIndex;
    cardInfo.current.cardLeft = newleft;
    setRefresh(Math.random());
    checked();
  }, []);

  const checked = useCallback(() => {
    const cardWidth = cardRef.current?.offsetWidth;
    let active;
    let cardLeft;
    animateLeftRef.current = true;
    if (cardInfo.current.cardLeft <= -(COUNT * cardWidth)) {
      changeCard.current = true;
      active = 1;
      cardLeft = -cardWidth;
    } else if (cardInfo.current.cardLeft === 0) {
      changeCard.current = true;
      active = COUNT - 1;
      cardLeft = -cardWidth * (COUNT - 1);
    }
    return {
      changeCard: changeCard.current,
      active: active,
      cardLeft: cardLeft,
    };
  }, []);

  useEffect(() => {
    // 改变卡片后立即执行(切换到前面的卡，保持无限轮询)
    setTimeout(() => {
      if (changeCard.current) {
        const data = checked();
        cardInfo.current.active = data.active;
        cardInfo.current.cardLeft = data.cardLeft;
        animateLeftRef.current = false;
        setRefresh(Math.random());
        changeCard.current = false;
      }
    }, 300);
  }, [refresh]);

  useEffect(() => {
    setTimeout(() => {
      changeWidth();
    }, 0);
  }, []);

  const changeWidth = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (containerRef.current) {
      const width = containerRef.current?.offsetWidth;
      if (width) {
        const cardWidth = Math.floor(width / 3);
        setCardWidth(cardWidth);
        cardInfo.current.active = 1;
        cardInfo.current.cardLeft = -cardWidth;
        animateLeftRef.current = true;
        setRefresh(Math.random());
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', changeWidth);
    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, []);

  const handlePoint = useCallback((index) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const active = cardInfo.current.active;
    const cardLeft = cardInfo.current.cardLeft;
    if (index === active) {
      return;
    }
    const cardWidth = cardRef.current?.offsetWidth;
    const offset = (index - active) * -cardWidth;
    cardInfo.current.active = index;
    cardInfo.current.cardLeft = cardLeft + offset;
    setRefresh(Math.random());
    checked();
  }, []);

  const renderPoint = useCallback(() => {
    const points = [];
    // 三张轮播，两个小点
    const active = cardInfo.current.active;
    let activeIndex = active;
    if (active === COUNT) {
      activeIndex = 1;
    }
    for (let i = 0; i < COUNT - 1; i++) {
      points.push(
        <Point
          key={i}
          active={activeIndex === i + 1}
          onClick={() => {
            handlePoint(i + 1);
          }}
        />,
      );
    }
    return points;
  }, []);

  useEffect(() => {
    if (changeCard.current) {
      return;
    }
    if (!timer.current) {
      timer.current = setTimeout(() => {
        if (changeCard.current) {
          return;
        }
        animateLeftRef.current = true;
        animate(true);
      }, 3000);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [refresh]);

  const handleClick = useCallback((event, currentIndex, active) => {
    const currentActive = active + 1 === currentIndex;
    if (!currentActive && event) {
      event?.preventDefault();
      if (active + 1 < currentIndex) {
        handlePoint(active + 1);
      } else {
        handlePoint(active - 1);
      }
    }
  }, []);

  const lastCardClick = useCallback((event) => {
    if (event) {
      event?.preventDefault();
    }
    const active = cardInfo.current.active;
    //不允许动画，就正在切换卡片实现无线轮询的效果
    if (changeCard.current) {
      lastCardClick();
    } else {
      handlePoint(active + 1);
    }
  }, []);

  const active = cardInfo.current.active;
  const cardLeft = cardInfo.current.cardLeft;

  return (
    <Wrapper>
      <Container ref={containerRef}>
        <CardWrapper style={{ left: `${cardLeft}px` }} animate={animateLeftRef.current}>
          <Card
            animate={animateLeftRef.current}
            href={addLangToPath(list[1].url)}
            pre={true}
            ref={cardRef}
            width={cardWidth}
          >
            {/* <span>3</span> 提示轮播的图片顺序*/}
            <img src={list[1].img} alt="activity" />
            <Mask active={false} />
            <CardTitle active={false}>{list[1].title}</CardTitle>
            <Info>
              {moment(list[1].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[1].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
          <Card
            animate={animateLeftRef.current}
            href={addLangToPath(list[0].url)}
            pre={true}
            active={active + 1 === 1}
            width={cardWidth}
            onClick={(event) => handleClick(event, 1, active)}
          >
            {/* <span>1</span> */}
            <img src={list[0].img} alt="activity" />
            <Mask active={active + 1 === 1} />
            <CardTitle active={active + 1 === 1}>{list[0].title}</CardTitle>
            <Info>
              {moment(list[0].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[0].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
          <Card
            animate={animateLeftRef.current}
            href={addLangToPath(list[1].url)}
            active={active + 1 === 2}
            width={cardWidth}
            onClick={(event) => handleClick(event, 2, active)}
          >
            {/* <span>2</span> */}
            <img src={list[1].img} alt="activity" />
            <Mask active={active + 1 === 2} />
            <CardTitle active={active + 1 === 2}>{list[1].title}</CardTitle>
            <Info>
              {moment(list[1].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[1].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
          <Card
            animate={animateLeftRef.current}
            href={addLangToPath(list[0].url)}
            next={true}
            active={active + 1 === 3}
            width={cardWidth}
            onClick={(event) => handleClick(event, 3, active)}
          >
            {/* <span>3</span> */}
            <img src={list[0].img} alt="activity" />
            <Mask active={active + 1 === 3} />
            <CardTitle active={active + 1 === 3}>{list[0].title}</CardTitle>
            <Info>
              {moment(list[0].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[0].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
          <Card
            animate={animateLeftRef.current}
            href={addLangToPath(list[1].url)}
            active={active + 1 === 4}
            width={cardWidth}
            onClick={(event) => handleClick(event, 4, active)}
          >
            {/* <span>1</span> */}
            <img src={list[1].img} next={true} alt="activity" />
            <Mask active={active + 1 === 4} />
            <CardTitle active={active + 1 === 4}>{list[1].title}</CardTitle>
            <Info>
              {moment(list[1].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[1].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
          <Card href={addLangToPath(list[0].url)} width={cardWidth} onClick={lastCardClick}>
            {/* <span>2</span> */}
            <img src={list[0].img} alt="activity" />
            <Mask active={false} />
            <CardTitle active={false}>{list[0].title}</CardTitle>
            <Info>
              {moment(list[0].startTime).format('YYYY/MM/DD')} -{' '}
              {moment(list[0].endTime).format('YYYY/MM/DD')}
            </Info>
          </Card>
        </CardWrapper>
        <PointerWrapper>{renderPoint()}</PointerWrapper>
      </Container>
    </Wrapper>
  );
};
