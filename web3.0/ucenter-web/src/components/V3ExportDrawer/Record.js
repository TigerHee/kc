/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { RightOutlined } from '@kux/icons';
import { Button, Tooltip, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import { ALL_TOP_CODES, ALL_TOP_CODES_MAP } from 'components/V3ExportDrawer/config';
import { showDatetime } from 'helper';
import { intersection } from 'lodash';
import React, { Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFailedMsg, TYPE_MAP_OLD } from 'src/components/Account/Download/Table';
import errMsgIcon from 'static/order/err-msg.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import saveAs from 'utils/saveAs';
import Status from './Status';

const TYPE_MAP = { ...TYPE_MAP_OLD, ...ALL_TOP_CODES_MAP };

const BetweenBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Header = styled(BetweenBox)`
  font-weight: 500;
  font-size: 14px;
  align-items: flex-end;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  svg {
    margin-left: 2px;
  }
`;
const Item = styled.div`
  padding: 16px 12px;
  margin-top: 16px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 8px;
`;
const SingerData = styled(BetweenBox)`
  &:not(:first-of-type) {
    margin-top: 16px;
  }
`;
const Label = styled.div`
  width: 33%;
  color: ${(props) => props.theme.colors.text40};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Value = styled.div`
  max-width: 66%;
  display: flex;
  flex-direction: row-reverse;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
const RightText = styled.div`
  width: 100%;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  span {
    &:not(:last-child) {
      margin-right: 2px;
    }
  }
`;
const ButtonStyled = styled(Button)`
  height: auto;
  font-weight: 500;
`;

export default React.memo(({ isInDrawer }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { records } = useSelector((state) => state.download);
  const { exportDrawerOpen } = useSelector((state) => state.order_meta);

  useEffect(() => {
    if (exportDrawerOpen || !isInDrawer) {
      dispatch({
        type: 'download/query',
        payload: {
          current: 1,
          pageSize: 5,
        },
      });
    }
  }, [exportDrawerOpen, dispatch, isInDrawer]);

  const handleDownload = useCallback(({ fileUrl, categoryCodes }) => {
    trackClick(['Export', 'DownloadTask'], {
      Source: intersection(categoryCodes, ALL_TOP_CODES).length > 0 ? '账单导出' : '其他',
    });
    saveAs(fileUrl, 'poster');
  }, []);

  const getStatusEl = (value, item) => {
    switch (value) {
      case 0:
      case 1:
        return <Status status="pending">{_t('generating')}</Status>;
      case 2:
        return <Status status="success">{_t('eYLww7Sv1ErM7hVXXXowRq')}</Status>;
      case 4:
        return <Status status="faild">{_t('deleted')}</Status>;
      case 3:
      default:
        const msg = getFailedMsg(item.message);

        return (
          <Status status="faild">
            {_t('cFpjnxjDzGSx9FPwaMn253')}
            {msg ? (
              <Tooltip placement="top" title={msg}>
                <img src={errMsgIcon} alt="error-msg-icon" />
              </Tooltip>
            ) : null}
          </Status>
        );
    }
  };

  return (
    <Fragment>
      <Header>
        <Title>{_t('pcBMD17yA7pwtgVZpRzBg6')}</Title>
        <LinkWrapper to="/account/download">
          {_t('2czUD6nJQFUvwWwXt4wBc3')}
          <RightOutlined size={12} />
        </LinkWrapper>
      </Header>

      {records.map((item) => {
        const { id, createdAt, categoryCodes, begin, end, status, fileUrl } = item;
        return (
          <Item key={id}>
            <SingerData>
              <Label>{_t('dTqnat7bSNwQNHQRJTejPh')}</Label>
              <Value>{showDatetime(createdAt)}</Value>
            </SingerData>
            <SingerData>
              <Label>{_t('iHGHX8kNKBSzhW5No277yg')}</Label>
              <Value>
                <Tooltip
                  placement="top"
                  title={
                    <>
                      {categoryCodes.map((item) => (
                        <div key={item}>{TYPE_MAP[item] || item}</div>
                      ))}
                    </>
                  }
                >
                  <RightText>
                    {categoryCodes.map((item) => (
                      <span key={item}>{TYPE_MAP[item] || item}</span>
                    ))}
                  </RightText>
                </Tooltip>
              </Value>
            </SingerData>
            <SingerData>
              <Label>{_t('8yZcx6kzD9APgNFow8QbEY')}</Label>
              <Value>{`${showDatetime(begin, 'YYYY/MM/DD')} - ${showDatetime(
                end,
                'YYYY/MM/DD',
              )}`}</Value>
            </SingerData>
            <SingerData>
              <Label>{_t('oHJraBWH5VLkDwciJsRvRD')}</Label>
              <Value>{getStatusEl(status, item)}</Value>
            </SingerData>
            <SingerData>
              <Label>{_t('5chJ4yYnYR3jMcFVMzdcWk')}</Label>
              <Value>
                {fileUrl ? (
                  <ButtonStyled
                    variant="text"
                    type="brandGreen"
                    size="mini"
                    onClick={() => handleDownload(item)}
                  >
                    {_t('35wKhJTBZzrHWsu5spLTG6')}
                  </ButtonStyled>
                ) : (
                  '-'
                )}
              </Value>
            </SingerData>
          </Item>
        );
      })}
    </Fragment>
  );
});
