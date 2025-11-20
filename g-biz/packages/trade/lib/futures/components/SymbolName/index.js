/**
 * owner@clyne@kupotech.com
 */
import React, { memo } from 'react';
import clsx from 'clsx';
import withWrapper from '../../hocs/withWrapper';
import { useGetSymbolText } from '../../hooks/useGetSymbolText';
import { Wrapper, Content, ContentTag } from './style';
import { VARIANT_TAG } from '../../constant';
const SymbolName = ({ symbol, className, size = 'basic', variant = 'text', }) => {
    const isTag = variant === VARIANT_TAG;
    const { symbolName, tagName } = useGetSymbolText({ symbol, isTag });
    let child = (React.createElement(Content, { className: className, dir: "ltr" },
        React.createElement("span", { className: "symbol-name" }, symbolName)));
    if (variant === VARIANT_TAG) {
        child = (React.createElement(ContentTag, { className: className },
            React.createElement("div", { className: "symbol-name" }, symbolName),
            React.createElement("div", { className: "symbol-tag" }, tagName)));
    }
    return React.createElement(Wrapper, { className: clsx(size) }, child);
};
const MemoizedSymbolName = memo(SymbolName);
export default withWrapper(MemoizedSymbolName);
