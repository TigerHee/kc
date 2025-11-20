/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react'

/**
 * 图片点击跳转
 * @param {{
 *  link: string,
 *  imgUrl: string,
 *  style?: React.CSSProperties,
 *  className?: string,
 *  wrapAttr?: any,
 *  width?: string | number,
 *  height?: string | number,
 *  imgStyle?: React.CSSProperties,
 *  imgClassName?: string,
 *  imgAttr?: any,
 * }} props
 */
const JumpImg = (props) => {
    const { link, imgUrl, className, style, wrapAttr, imgAttr, imgStyle, imgClassName, width, height } = props
    const openPage = (e) => {
        e.preventDefault();
        const newTab = window.open(link, '_blank');
        newTab.opener = null;
    }
    return (
        <a {...wrapAttr} href={link} style={{ cursor: 'pointer', ...style}} className={className} onClick={openPage}>
            <img alt="img" {...imgAttr} width={width} height={height} style={imgStyle} className={imgClassName} src={imgUrl} />
        </a>
    )
}

export default JumpImg