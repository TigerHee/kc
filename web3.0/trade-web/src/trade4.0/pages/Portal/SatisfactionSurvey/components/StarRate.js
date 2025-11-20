/**
 * Owner: harry.lai@kupotech.com
 */
import React, { useState, memo } from 'react';
import SvgComponent from '@/components/SvgComponent';
import { StarImg, StarWrap } from './style';

const STAR_COUNTS = 5;
const starList = new Array(STAR_COUNTS).fill(0).map((_i, idx) => idx + 1);

const Star = ({ selected, onSelect, onMouseEnter, onMouseLeave }) => (
  <div onClick={onSelect} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <SvgComponent keepOrigin type={selected ? 'star_active' : 'star'} fileName="survey" size={24} />
  </div>
);

const StarRate = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleMouseEnter = (starValue) => {
    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const handleClick = (starValue) => {
    onChange(starValue);
  };

  const displayValue = hoverValue !== undefined ? hoverValue : value;

  const handleSelect = (starValue) => {
    onChange(starValue);
  };

  return (
    <StarWrap onMouseLeave={handleMouseLeave}>
      {starList.map((star, index) => (
        <Star
          key={index}
          selected={displayValue >= star}
          onSelect={() => handleSelect(star)}
          onMouseEnter={() => handleMouseEnter(star)}
        />
      ))}
    </StarWrap>
  );
};

export default memo(StarRate);
