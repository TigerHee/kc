/**
 * Owner: willen@kupotech.com
 */
/* * @Author: Melon Zhao;  * @Date: 2022-10-17 23:05:13 ; * @Last Modified by:   Melon Zhao ; * @Last Modified time: 2022-10-17 23:05:13
owner victor@kupotech.com
*/
import React, { memo } from 'react';

import PropTypes from 'prop-types';
import { Drawer } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { CloseOutlined } from '@kufox/icons';

const CusDrawer = styled(Drawer)`
  padding: 0;
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
  min-height: max-content;
  max-height: calc(100vh - 40px);
`;

const Root = styled.div`
  position: relative;
  padding-top: 14px;
`;

const DrawerCloseIcon = styled(CloseOutlined)`
  position: absolute;
  left: 16px;
  top: 20px;
  width: 14px;
  height: 14px;
`;

const DrawerTitle = styled.div`
  margin: 0 auto;
  padding: 0 14px;
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
  text-align: center;
  color: #000d1d;
`;

const Index = memo(
  ({ children = null, title = '', showClose = true, onClose, show, restProps }) => {
    return (
      <CusDrawer anchor="bottom" show={show} onClose={onClose} {...restProps}>
        <Root>
          {showClose ? <DrawerCloseIcon onClick={onClose} /> : null}
          {title ? <DrawerTitle>{title}</DrawerTitle> : null}
          {children}
        </Root>
      </CusDrawer>
    );
  },
);

Index.propTypes = {
  title: PropTypes.any, // 标题
  show: PropTypes.bool.isRequired, // 是否展示抽屉
  showClose: PropTypes.bool.isRequired, // 是否展示关闭按钮
  onClose: PropTypes.func.isRequired, // 点击关闭币种弹窗回调
  anchor: PropTypes.oneOf(['bottom', 'top', 'right', 'left']), // 币种列表类型
  children: PropTypes.any, // 抽屉内容
};

Index.defaultProps = {
  title: '',
  show: false,
  showClose: true,
  onClose: () => {},
  anchor: 'bottom',
  children: null,
};
export default Index;
