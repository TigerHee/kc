/*
 * owner: borden@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { styled } from '@kux/mui';
import { map, filter } from 'lodash';
import { ICDeleteOutlined } from '@kux/icons';
import CoinButton from './CoinButton';

const Container = styled.div`
  margin-top: 16px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;
const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 40px; // 最多显示一行
  overflow: hidden;
`;
const StyledCoinButton = styled(CoinButton)`
  margin-top: 8px;
`;
const CloseIcon = styled(ICDeleteOutlined)`
  cursor: pointer;
  color: ${(props) => props.theme.colors.icon60};
`;

const defaultGetCoin = (v) => v?.currency || v;

const CoinGroup = ({
  title,
  onDelete,
  currencyMap,
  dataSource: _dataSource,
  getCoin = defaultGetCoin,
  ...otherProps
}) => {
  const dataSource = useMemo(() => {
    return filter(_dataSource, (v) => currencyMap[getCoin(v)]);
  }, [_dataSource, getCoin, currencyMap]);

  const handleClose = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onDelete) {
        onDelete(map(dataSource, (v) => getCoin(v)));
      }
    },
    [onDelete, dataSource, getCoin],
  );

  if (!dataSource?.length) return null;

  return (
    <Container {...otherProps}>
      <Header>
        {title}
        {Boolean(onDelete) && <CloseIcon size={16} onClick={handleClose} />}
      </Header>
      <List>
        {map(dataSource, (item) => {
          return (
            <StyledCoinButton
              record={item}
              getCoin={getCoin}
              key={getCoin(item)}
              onDelete={onDelete}
            />
          );
        })}
      </List>
    </Container>
  );
};

export default React.memo(CoinGroup);
