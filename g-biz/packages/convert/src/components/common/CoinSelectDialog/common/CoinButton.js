/*
 * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { styled } from '@kux/mui';
import { ICClosePlusOutlined } from '@kux/icons';
import CoinCodeToName from '../../CoinCodeToName';
import usePropsSelector from '../usePropsSelector';
import CoinTag from './CoinTag';

const Container = styled.div`
  display: flex;
  cursor: pointer;
  padding: 4px 12px;
  font-size: 14px;
  align-items: center;
  border-radius: 8px;
  position: relative;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  &:hover {
    color: ${(props) => props.theme.colors.text};
    .biz-convert-CoinButton-CloseIcon {
      display: flex;
    }
  }
  &:not(:last-of-type) {
    margin-right: 12px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
    padding: 4px 10px;
  }
`;
const StyledCoinTag = styled(CoinTag)`
  margin-right: 4px;
`;
const CloseIcon = styled.div`
  width: 16px;
  height: 16px;
  position: absolute;
  cursor: pointer;
  top: -6px;
  right: -6px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: ${(props) => props.theme.colors.overlay};
  border: 2px solid ${(props) => props.theme.colors.cover8};
`;

const CoinButton = ({ record, getCoin, onDelete, ...otherProps }) => {
  const coin = getCoin(record);
  const onChange = usePropsSelector((props) => props.onChange);

  const handleSelect = useCallback(
    (e) => {
      e.stopPropagation();
      if (onChange) onChange(coin);
    },
    [onChange, coin],
  );

  const handleClose = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onDelete) onDelete([coin]);
    },
    [onDelete, coin],
  );

  return (
    <Container onClick={handleSelect} {...otherProps}>
      <StyledCoinTag record={record} />
      <CoinCodeToName coin={coin} />
      {Boolean(onDelete) && (
        <CloseIcon onClick={handleClose} className="biz-convert-CoinButton-CloseIcon">
          <ICClosePlusOutlined size={6} />
        </CloseIcon>
      )}
    </Container>
  );
};

export default React.memo(CoinButton);
