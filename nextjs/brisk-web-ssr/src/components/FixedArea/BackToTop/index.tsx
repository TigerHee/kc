import { StickIcon } from '@kux/iconpack';
import React from 'react';
import FixedItem from '../FixedItem';
import useScrollPosition from '@/hooks/useScrollPosition';

const BackToTop = () => {
  const isVisible = useScrollPosition(1000);

  if (!isVisible) {
    return null;
  }

  return (
    <FixedItem
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <StickIcon />
    </FixedItem>
  );
};

export default BackToTop;
