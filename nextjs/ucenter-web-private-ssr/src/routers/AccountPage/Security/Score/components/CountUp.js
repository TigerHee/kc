import { useEffect, useRef, useState } from 'react';

const CountUp = ({ target = 0, duration = 300, format = true }) => {
  const [current, setCurrent] = useState(0);
  const startTimestamp = useRef(null);

  useEffect(() => {
    const step = (timestamp) => {
      if (!startTimestamp.current) startTimestamp.current = timestamp;
      const progress = timestamp - startTimestamp.current;

      const progressRatio = Math.min(progress / duration, 1);
      const value = Math.floor(progressRatio * target);

      setCurrent(value);

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  const formatNumber = (num) => (format ? num.toLocaleString() : num);

  return (
    <span data-inspector="account_security_score_countUp" data-target={target}>
      {formatNumber(current)}
    </span>
  );
};

export default CountUp;
