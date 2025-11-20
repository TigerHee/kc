/*
 * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import ChangeRender from '@/components/ChangeRender';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';
import { readableNumber } from '@/utils/format';

/** 样式开始 */
const Container = styled.div`
  text-align: left;
  color: ${(props) => props.theme.colors.text};
`;
const Price = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    font-weight: 700;
  }
`;
const Change = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => (props.changeRate < 0 ? props.down : props.up)};
`;
const ChangeRenderBox = styled.span`
  margin-right: 6px;
`;
/** 样式结束 */

const PriceInfo = React.memo(({ price, changeRate, changePrice, ...otherProps }) => {
  const priceChangeColor = usePriceChangeColor();

  return (
    <Container {...otherProps}>
      <Price>
        <ChangeRender
          value={+price ? price : '--'}
          withPrefix={false}
          render={readableNumber}
          changeValue={changePrice}
        />
      </Price>
      <Change changeRate={changeRate} {...priceChangeColor}>
        {changeRate ? (
          <Fragment>
            <ChangeRenderBox>
              <ChangeRender value={changeRate} withPrefix={changeRate > 0} />
            </ChangeRenderBox>{' '}
            {changePrice > 0 ? '+' : ''}
            {readableNumber(changePrice)}
          </Fragment>
        ) : (
          <ChangeRender value={changeRate} withPrefix={changeRate > 0} />
        )}
      </Change>
    </Container>
  );
});

export default PriceInfo;
