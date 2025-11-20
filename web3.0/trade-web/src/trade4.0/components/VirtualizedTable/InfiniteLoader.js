/**
 * Owner: charles.yang@kupotech.com
 */
/**
 * 基于 react-virtuoso 封装的不定高组件
 * data 数据源
 * isMore 是否有更多
 * loadMoreItems 请求函数 返回一个 promise -> resolve(true) 表示成功，resolve(false) 则表示不会进行后续的loadMore
 * RowRender 渲染的子项
 * showLoading 展示 loading
 * showEmpty 展示无数据组件
 * isGrid 是否使用 Grid 多列布局
 * itemClassName? 为 Grid 布局时使用
 * listClassName? 为 Grid 布局时使用
 * 其它API参考 https://virtuoso.dev/virtuoso-api-reference/
 */

import Spin from '@/components/mui/Spin';
import Empty from '@mui/Empty';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';

const InfiniteLoader = (props, ref = null) => {
  const {
    isMore,
    loadMoreItems,
    useWindowScroll = false,
    style,
    RowRender,
    data = [],
    showLoading = true,
    overscan = 10,
    componentsProps = {},
    isGrid,
    itemClassName,
    listClassName,
    showEmpty,
    customScrollParent,
    emptyProps,
    loading,
    screen = '',
    className,
    ...other
  } = props;

  const { Footer, Header, ...otherC } = componentsProps;

  const compProps = React.useMemo(() => {
    return {
      Footer: () => <>{Footer}</>,
      Header: () => <>{Header}</>,
      ...otherC,
    };
  }, [Footer, Header, otherC]);

  if (loading) {
    return <Spin size="small" />;
  }

  if (showEmpty && !data.length) {
    return <Empty {...emptyProps} />;
  }

  let customer = {};
  if (useWindowScroll || customScrollParent) {
    // 不传参指向默认的root（注意下不能限制root高度）
    customer = { customScrollParent: customScrollParent || document.querySelector('#root') };
  }

  return (
    <Virtuoso
      className={`${screen} ${className}`}
      ref={ref}
      style={style}
      data={data}
      useWindowScroll={useWindowScroll}
      itemContent={RowRender}
      overscan={overscan}
      components={compProps}
      {...other}
    />
  );
};

export default React.memo(React.forwardRef(InfiniteLoader));
