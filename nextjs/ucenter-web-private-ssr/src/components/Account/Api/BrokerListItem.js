/**
 * Owner: willen@kupotech.com
 */

import { ICDeleteOutlined } from '@kux/icons';
import { Dialog, styled } from '@kux/mui';
import SpanForA from 'components/common/SpanForA';
import { injectLocale } from 'components/LoadLocale';
import { withRouter } from 'components/Router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const List_item = styled.div`
  padding: 40px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0;
  }
  .list_item__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    margin-bottom: 20px;
    .list_item__name {
      display: flex;
      align-items: center;
      span {
        &:first-child {
          color: ${({ theme }) => theme.colors.text};
          font-weight: 500;
          font-size: 20px;
          line-height: 130%;
          ${(props) => props.theme.breakpoints.down('sm')} {
            font-size: 16px;
          }
        }
        &:not(:first-child) {
          margin-left: 8px;
          padding: 0 4px;
          font-weight: 500;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          border-radius: 2px;
        }
      }
    }

    .list_item__btns {
      display: flex;
      align-items: center;
      a,
      .link_for_a {
        margin-left: 16px;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        ${(props) => props.theme.breakpoints.down('sm')} {
          font-size: 14px;
        }
        &:first-child {
          margin-left: 0;
        }
        svg {
          color: ${({ theme }) => theme.colors.text};
          vertical-align: middle;
        }
      }
    }
  }

  .list_item__body {
    .list_item__row {
      display: flex;
      margin-bottom: 16px;
      ${(props) => props.theme.breakpoints.down('sm')} {
        justify-content: space-between;
        margin-bottom: 8px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      & > span:first-child {
        width: 120px;
        min-width: 120px;
        max-width: 120px;
        padding-right: 16px;
        color: ${({ theme }) => theme.colors.text40};
        font-weight: 400;
        font-size: 14px;
        line-height: 130%;
      }

      & > span:last-child {
        flex-grow: 1;
        color: ${({ theme }) => theme.colors.text};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        ${(props) => props.theme.breakpoints.down('sm')} {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          margin-left: 30px;
          text-align: right;
        }
      }

      .list_item__auth {
        display: inline-block;
        height: 22px;
        color: ${({ theme }) => theme.colors.text};
        line-height: 22px;

        & + .list_item__auth {
          margin-left: 24px;
        }
      }
    }
  }
`;

const Del_dialog__notice = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
`;
const Del_dialog__key = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
`;

const BrokerListItem = ({ apiName, apiKey }) => {
  const dispatch = useDispatch();
  const [delOpen, setDelOpen] = useState(false);

  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  // 打开删除弹窗
  const showDelDialog = (e) => {
    e.preventDefault();
    trackClick(['Delete', '1']);
    setDelOpen(true);
  };

  // 关闭删除弹窗
  const closeDelDialog = () => {
    setDelOpen(false);
  };

  // 确认删除
  const submitDel = () => {
    closeDelDialog();
    dispatch({ type: 'api_key/deleteBrokerApiKey', payload: { apiKey } });
  };

  return (
    <List_item>
      <div className="list_item__title">
        <div className="list_item__name">
          <span>{apiName}</span>
        </div>
        <div className="list_item__btns">
          <SpanForA className="link_for_a" href="" onClick={showDelDialog}>
            <ICDeleteOutlined size={isH5 ? '16' : '24'} />
          </SpanForA>
        </div>
      </div>
      <div className="list_item__body">
        <div className="list_item__row">
          <span>{_t('api.key')}</span>
          <span>{apiKey}</span>
        </div>
        <div className="list_item__row">
          <span>{_t('rkc4nZwYVAXzB2zeQHe7Vu')}</span>
          <span>
            <span className="list_item__auth">{_t('mEif9UdGtVdQLQjAa3Fdvh')}</span>
          </span>
        </div>
      </div>

      <Dialog
        title={_t('delete')}
        open={delOpen}
        onCancel={closeDelDialog}
        onOk={submitDel}
        okText={_t('confirm')}
        cancelText={_t('cancel')}
        okButtonProps={{ size: 'basic' }}
        cancelButtonProps={{ size: 'basic' }}
        maxWidth={false}
      >
        <Del_dialog__notice>{_tHTML('api.delete.notice', { apiName })}</Del_dialog__notice>
        <Del_dialog__key>{apiKey}</Del_dialog__key>
      </Dialog>
    </List_item>
  );
};

export default withRouter()(injectLocale(BrokerListItem));
